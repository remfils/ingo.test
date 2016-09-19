<?php

namespace App;

use App\Models\Project;

class ProjectRepository {
    private $db;
    private $app;

    public function __construct($app) {
        $this->db = $app['idiorm.db'];
        $this->app = $app;
    }

    public function getAllProjects() {
        $lang = $this->app['translator']->getLocale();

        $result = $this->db
            ->for_table('projects')
            ->table_alias('p')
            ->select_many(
                'p.id',
                'p.color',
                'p.year',
                'p.logo',
                'p.logo_short',
                'p.preview_url',
                'pl.name',
                'pl.genre',
                'pl.description'
            )
            ->join('project_lang', array('p.id', '=', 'pl.project_id'), 'pl')
            ->join('lang', array('pl.lang_id', '=', 'lang.id'), 'lang')
            ->where('p.active', true)
            ->where('lang.name', $lang)
            ->find_array();

        $result = self::array_utf8_encode($result);

        return $result;
    }

    public function getProject($project_id) {
        $lang = $this->app['translator']->getLocale();

        $lang_id_query = $this->db
            ->for_table('lang')
            ->select('id')
            ->where('name', $lang)
            ->find_one();

        if (!$lang_id_query) {
            throw new Exception("no lang_id was found");
        }

        $lang_id = $lang_id_query->get('id');

        $result = $this->db
            ->for_table('projects')
            ->table_alias('p')
            ->select_many(
                'p.id',
                'p.color',
                'p.year',
                'p.logo',
                'p.logo_short',
                'p.preview_url',
                'pl.name',
                'pl.genre',
                'pl.description'
            )
            ->join('project_lang', array('p.id', '=', 'pl.project_id'), 'pl')
            ->where('p.id', $project_id)
            ->where('p.active', true)
            ->where('pl.lang_id', $lang_id)
            ->find_one();

        if ($result) {
            $model = $result->as_array();
        }
        else {
            throw new Exception("Project was not found");
        }

        $result = $this->db
            ->for_table('project_field_lang')
            ->where('project_id', $project_id)
            ->where('lang_id', $lang_id)
            ->find_array();

        $model['fields'] = $result;

        $result = $this->db
            ->for_table('project_comment_lang')
            ->where('project_id', $project_id)
            ->where('lang_id', $lang_id)
            ->find_array();

        $model['comments'] = $result;

        $model = self::array_utf8_encode($model);

        return $model;
    }

    public function getProjectForEditing($project_id) {
        $result = $this->db
            ->for_table('projects')
            ->table_alias('p')
            ->select_many(array(
                'language' => 'lang.name',
                'p.id',
                'p.color',
                'p.year',
                'p.logo',
                'p.logo_short',
                'p.preview_url',
                'pl.name',
                'pl.genre',
                'pl.description')
            )
            ->join('project_lang', array('p.id', '=', 'pl.project_id'), 'pl')
            ->where('p.id', $project_id)
            ->where('p.active', true)
            ->join('lang', array('pl.lang_id', '=', 'lang.id'), 'lang')
            ->group_by('lang.name')
            ->find_array();

        foreach ( $result as $k => $item ) {
            $model[$item['language']] = $item;
        }

        $result = $this->db
            ->for_table('project_field_lang')
            ->table_alias('pf')
            ->select_many(array(
                'pf.id',
                'language' => 'lang.name',
                'name' => 'pf.field_name',
                'value' => 'pf.field_value'
            ))
            ->where('pf.project_id', $project_id)
            ->join('lang', array('lang.id', '=', 'pf.lang_id'), 'lang')
            ->find_array();

        $model['de']['fields'] = array();
        $model['en']['fields'] = array();
        foreach ( $result as $key => $item ) {
            $model[$item['language']]['fields'][] = $item;
        }

        $result = $this->db
            ->for_table('project_comment_lang')
            ->table_alias('cm')
            ->select_many(array(
                'id' => 'cm.id',
                'language' => 'lang.name',
                'text' => 'cm.text',
                'image_url' => 'cm.image_url'
            ))
            ->where('project_id', $project_id)
            ->join('lang', array('lang.id', '=', 'cm.lang_id'), 'lang')
            ->find_array();

        $model['de']['comments'] = array();
        $model['en']['comments'] = array();
        foreach ( $result as $key => $item ) {
            $model[$item['language']]['comments'][] = $item;
        }

        $model = self::array_utf8_encode($model);

        return $model;
    }

    public function updateProjectFromPost($prj_id, $p_data) {
        $this->updateBaseProjectInfo($prj_id, $p_data);

        $this->updateMultilangInfo($prj_id, $p_data);

        $this->updateFields($prj_id, $p_data);

        $this->updateComments($prj_id, $p_data);
    }

    private function updateBaseProjectInfo($prj_id, $p_data)
    {
        $prj = $this->db->for_table('projects')->table_alias('p')
            ->where_equal('id', $prj_id)
            ->find_one();

        $prj_de = $p_data['de'];
        $prj_en = $p_data['en'];

        $prj->set(array(
            'color' => $prj_de['color'],
            'year' => $prj_de['year'],
            'preview_url' => $prj_de['preview_url']
        ));

        $dummy_project = new Project(null);

        $project_logo_name = $dummy_project->getLogoAttrName();
        if ($this->isImageUploaded($project_logo_name)) {
            $img_path = $this->moveUploadedImageToImagesDir($project_logo_name, 'movies');

            $prj->logo = $img_path;
        }

        $project_shortlogo_name = $dummy_project->getLogoShortAttrName();
        if ($this->isImageUploaded($project_shortlogo_name)) {
            $img_path = $this->moveUploadedImageToImagesDir($project_shortlogo_name, 'movies/images_small');

            $prj->logo = $img_path;
        }

        $prj->save();
    }

    private function isImageUploaded( $image_id )
    {
        if ( !isset($_FILES[$image_id]) ) {
            return false;
        }

        $file = $_FILES[$image_id];
        if ( !file_exists($file['tmp_name']) || !is_uploaded_file($file['tmp_name']) ) {
            return false;
        }

        return true;
    }

    private function moveUploadedImageToImagesDir ( $image, $sub_dir )
    {
        $img_dir = "img/$sub_dir";
        $upload_directory = dirname($_SERVER["SCRIPT_FILENAME"]) . '/' . $img_dir;
        $image_file_name = str_replace(' ', '_', $_FILES[$image]['name']);
        move_uploaded_file($_FILES[$image]["tmp_name"], "$upload_directory/$image_file_name");

        return "$img_dir/$image_file_name";
    }

    private function updateMultilangInfo($prj_id, $p_data)
    {
        $prj = $this->db->for_table('project_lang')->table_alias('pl')
            ->where('project_id', $prj_id)
            ->select_many(array(
                'id' => 'pl.id',
                'lang' => 'l.name',
                'genre',
                'description',
                'name' => 'pl.name'
            ))
            ->join('lang', array('pl.lang_id', '=', 'l.id'), 'l')
            ->find_many();

        foreach ($prj as $row) {
            $lang = $row['lang'];

            $row->name = $p_data[$lang]['name'];
            $row->description = $p_data[$lang]['description'];
            $row->genre = $p_data[$lang]['genre'];

            $row->save();
        }
    }

    private function updateFields($prj_id, $p_data)
    {
        $langs = $this->db->for_table('lang')->find_array();

        foreach($langs as $k => $lang) {
            $fields = $p_data[$lang['name']]['fields'];

            foreach ($fields as $k2 => $field) {

                if (array_key_exists('delete', $field)) {
                    if (!array_key_exists('new', $field)) {
                        $item = $this->db->for_table('project_field_lang')->where_id_is($field['id'])->find_one();

                        if ($item) {
                            $item->delete();
                        }
                    }
                }
                else if (array_key_exists('new', $field)) {
                    $item = $this->db->for_table('project_field_lang')->create();

                    $item->project_id = $prj_id;
                    $item->lang_id = $lang['id'];
                    $item->field_name = $field['name'];
                    $item->field_value = $field['value'];

                    $item->save();
                }
                else {
                    $q = $this->db->for_table('project_field_lang')
                        ->where_id_is($field['id'])->find_one();

                    if ($q) {
                        $q->field_name = $field['name'];
                        $q->field_value = $field['value'];

                        $q->save();
                    }
                }
            }
        }
    }

    private function updateComments($prj_id, $p_data)
    {
        $langs = $this->db->for_table('lang')->find_array();

        foreach($langs as $k => $lang) {
            $comments = $p_data[$lang['name']]['comments'];

            foreach ($comments as $k2 => $comment) {
                if (array_key_exists('new', $comment)) {
                    if (!array_key_exists('delete', $comment)) {
                        $item = $this->for_table('project_comment_lang')->create();

                        $item->project_id = $prj_id;
                        $item->lang_id = $lang['id'];
                        $item->text = $comment['text'];

                        $item->save();
                    }
                }
                else {
                    $q = $this->db->for_table('project_comment_lang')
                        ->where_id_is($comment['id'])->find_one();

                    if (!$q) {
                        continue;
                    }

                    if (array_key_exists('delete', $comment)) {
                        $q->delete();
                    }
                    else {
                        $q->text = $comment['text'];

                        $q->save();
                    }
                }
            }
        }
    }

    public static function array_utf8_encode($dat)
    {
        if (is_string($dat))
            return utf8_encode($dat);
        if (!is_array($dat))
            return $dat;
        $ret = array();
        foreach ($dat as $i => $d)
            $ret[$i] = self::array_utf8_encode($d);
        return $ret;
    }
}