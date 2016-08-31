<?php

namespace App\Controllers;

use App\ProjectRepository;
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

        $app['session']->set('current_language', $lang);

        $referer = $req->headers->get('referer');
        return $app->redirect($referer);
    }

    public function allMoviesAction( Request $req, Application $app ) {
        $db = new ProjectRepository($app);
        $model = $db->getAllProjects();

        $model = self::array_utf8_encode($model);

        $result = $app->json($model);

        return $result;
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
                'p.year',
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
            $model = self::array_utf8_encode($result->as_array());
        }
        else {
            throw new Exception("Project was not found");
        }

        $result = $app['idiorm.db']
            ->for_table('project_field_lang')
            ->where('project_id', $project_id)
            ->where('lang_id', $lang_id)
            ->find_array();

        $model['table'] = $result;

        $result = $app['idiorm.db']
            ->for_table('project_comment_lang')
            ->where('project_id', $project_id)
            ->where('lang_id', $lang_id)
            ->find_array();

        $model['comments'] = $result;

        $model = self::array_utf8_encode($model);

        return json_encode($model);
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