<?php

namespace App\Controllers;

use Silex\Application;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\Request;

class ApiController
{
    public function indexAction( Request $req, Application $app )
    {

    }

    public function changeLanguage(Request $req, Application $app)
    {
        $lang = $req->attributes->get('language');
        //$lang = 'de';
        $app['session']->set('lang', $lang);
        $referer = $req->headers->get('referer');
        return $app->redirect("/");

    }

    public function allMoviesAction( Request $req, Application $app ) {
        $lang = $app['translator']->getLocale();

        $result = $app['idiorm.db']
            ->for_table('projects')
            ->table_alias('p')
            ->select_many(
                'p.id',
                'p.color',
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

        return json_encode($result);
    }

    public function movieDescriptionAction( Request $req, Application $app ) {
        $lang = $app['translator']->getLocale();

        $lang_id_query = $app['idiorm.db']
            ->for_table('lang')
            ->select('id')
            ->where('name', $lang)
            ->find_one();

        if (!$lang_id_query) {
            throw new Exception("no lang_id was found");
        }

        $lang_id = $lang_id_query->get('id');

        $project_id = $req->attributes->get('id');

        $result = $app['idiorm.db']
            ->for_table('projects')
            ->table_alias('p')
            ->select_many(
                'p.id',
                'p.color',
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

        $result = $app['idiorm.db']
            ->for_table('project_field_lang')
            ->where('project_id', $project_id)
            ->where('lang_id', $lang_id)
            ->find_array();

        $model['table'] = $result || array();

        $result = $app['idiorm.db']
            ->for_table('project_comment_lang')
            ->where('project_id', $project_id)
            ->where('lang_id', $lang_id)
            ->find_array();

        $model['comments'] = $result || array();

        return json_encode($result);
    }
}