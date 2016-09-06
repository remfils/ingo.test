<?php

namespace App;

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

        if (array_key_exists('logo',$prj_de)) {
            $prj->set('logo', $prj_de['logo']);
        }
        if (array_key_exists('logo_short',$prj_de)) {
            $prj->set('logo_short', $prj_de['logo_short']);
        }

        $prj->save();
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
                        // delete existing fields
                    }
                }
                else if (array_key_exists('new', $field)) {
                    // create new fields
                }
                else {
                    $q = $this->db->for_table('project_field_lang')
                        ->where_id_is($field['id'])->find_one();

                    $q->field_name = $field['name'];
                    $q->field_value = $field['value'];

                    $q->save();
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
                        /*$q = $this->for_table('project_comment_lang')->create();

                        $q->*/
                    }
                }
                else {
                    $q = $this->db->for_table('project_comment_lang')
                        ->where_id_is($comment['id'])->find_one();

                    if (array_key_exists('delete', $comment)) {
                        //$q->delete();
                    }
                    else {
                        $q->text = $comment['text'];

                        $q->save();
                    }
                }
            }
        }
    }
}