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
            ->where('lang.name', 'de')
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
}