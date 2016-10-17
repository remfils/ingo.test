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
                'p.url',
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
                'p.url',
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

        //$model = self::array_utf8_encode($model);

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
                'p.url',
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

        //$model = self::array_utf8_encode($model);

        return $model;
    }

    public function createProjectFromPost($p_data)
    {
        $prj = $this->createOrUpdateBasicProject(null, $p_data);
        $prj_id = $prj->id;

        $this->createMultilangInfo($prj_id, $p_data);

        $this->updateFields($prj_id, $p_data);

        $this->updateComments($prj_id, $p_data);
    }

    private function createMultilangInfo($prj_id, $p_data) {
        $langs = $this->db->for_table('lang')->find_array();

        foreach ($langs as $i => $lang) {
            $l = $lang['name'];

            $row = $this->db->for_table('project_lang')->create();

            $row->lang_id = $lang['id'];
            $row->project_id = $prj_id;

            $row->name = $p_data[$l]['name'];
            $row->description = $p_data[$l]['description'];
            $row->genre = $p_data[$l]['genre'];

            $row->save();


        }
    }

    public function updateProjectFromPost($prj_id, $p_data) {
        $this->createOrUpdateBasicProject($prj_id, $p_data);

        $this->updateMultilangInfo($prj_id, $p_data);

        $this->updateFields($prj_id, $p_data);

        $this->updateComments($prj_id, $p_data);
    }

    private function createOrUpdateBasicProject($prj_id, $p_data)
    {
        if ($prj_id) {
            $prj = $this->db->for_table('projects')->table_alias('p')
                ->where_equal('id', $prj_id)
                ->find_one();
        }
        else {
            $prj = $this->db->for_table('projects')->create();
        }

        $prj_de = $p_data['de'];
        $prj_en = $p_data['en'];

        $prj->set(array(
            'color' => $prj_de['color'],
            'year' => $prj_de['year'],
            'preview_url' => $prj_de['preview_url'],
            'url' => $prj_de['url']
        ));

        $dummy_project = new Project(null);

        if ($this->isImageUploaded($dummy_project, 'logo')) {
            $img_path = $this->moveUploadedImageToImagesDir($dummy_project, 'logo', 'movies');

            $prj->logo = $img_path;
        }

        if ($this->isImageUploaded($dummy_project, 'logo_short')) {
            $img_path = $this->moveUploadedImageToImagesDir($dummy_project, 'logo_short', 'movies/images_small');

            $prj->logo_short = $img_path;
        }

        $prj->save();

        return $prj;
    }

    private function isImageUploaded( $prj, $image_name, $id = 0 )
    {
        $image_file_name = $prj->getUploadedImage('name', $image_name, $id);

        if ( !$image_file_name ) {
            return false;
        }

        $tmp_name = $prj->getUploadedImage('tmp_name', $image_name, $id);
        if ( !file_exists($tmp_name) || !is_uploaded_file($tmp_name) ) {
            return false;
        }

        return true;
    }

    private function moveUploadedImageToImagesDir ( $prj, $image_name, $sub_dir, $cid = 0 )
    {
        $img_dir = "img/$sub_dir";
        $upload_directory = dirname($_SERVER["SCRIPT_FILENAME"]) . '/' . $img_dir;
        $image_file_name = time() . '_' . str_replace(' ', '_', $prj->getUploadedImage('name', $image_name, $cid));
        move_uploaded_file($prj->getUploadedImage('tmp_name', $image_name, $cid), "$upload_directory/$image_file_name");

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

        $dummy_project = new Project(null);

        $image_urls = array();

        foreach($langs as $k => $lang) {
            $comments = $p_data[$lang['name']]['comments'];

            foreach ($comments as $k2 => $comment) {
                if (array_key_exists('new', $comment)) {
                    if (!array_key_exists('delete', $comment)) {
                        $item = $this->db->for_table('project_comment_lang')->create();

                        $item->project_id = $prj_id;
                        $item->lang_id = $lang['id'];
                    }
                }
                else {
                    $item = $this->db->for_table('project_comment_lang')
                        ->where_id_is($comment['id'])->find_one();

                    if (!$item) {
                        continue;
                    }

                    if (array_key_exists('delete', $comment)) {
                        $item->delete();
                        continue;
                    }
                }

                $item->text = $comment['text'];

                if ( strcmp($lang['name'], 'de') == 0) {
                    if ($this->isImageUploaded($dummy_project, 'comments', $k2)) {
                        $image_path = $this->moveUploadedImageToImagesDir($dummy_project, 'comments','movies/comments', $k2);

                        $image_urls[] = $image_path;
                        $item->image_url = $image_path;
                    }
                    else {
                        $image_urls[] = 0;
                    }
                }
                else {
                    $val = array_shift($image_urls);
                    if ($val) {
                        $item->image_url = $val;
                    }
                }

                $item->save();
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