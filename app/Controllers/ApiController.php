<?php

namespace App\Controllers;

use Silex\Application;
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
        $lang = $app['session']->get('lang');

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
        $lang_id = $app['idiorm.db']
            ->for_table('lang')
            ->select('id')
            ->where('name', $app['session']->get('lang'))
            ->find_one()['id'];

        $id = $req->attributes->get('id');

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
            ->where('p.id', $id)
            ->where('p.active', true)
            ->where('pl.lang_id', $lang_id)
            ->find_one()
            ->as_array();

        $result['table'] = $app['idiorm.db']
            ->for_table('project_field_lang')
            ->where('project_id', $id)
            ->where('lang_id', $lang_id)
            ->find_one()
            ->as_array();

        $result['comments'] = $app['idiorm.db']
            ->for_table('project_comment_lang')
            ->where('project_id', $id)
            ->where('lang_id', $lang_id)
            ->find_one()
            ->as_array();

        return json_encode($result);
    }
}