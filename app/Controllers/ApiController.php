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

        $q = $app['db']->prepare('select p.id, p.color , p.logo , p.logo_short, p.preview_url, p.year ,p.preview_url  , pl.name, pl.genre, pl.description from projects as p join project_lang as pl on p.id = pl.project_id join lang as lng on pl.lang_id = lng.id where p.active = true AND  lng.name =:language');
        $q->bindValue(':language', $lang);
        $q->execute();
        $result = $q->fetchAll();

        return json_encode($result);
    }

    public function movieDescriptionAction( Request $req, Application $app ) {
        $id = $req->attributes->get('id');

        $q = $app['db']->prepare('select * from project_description pd where pd.movie_id = :movie_id');
        $q->bindValue(':movie_id', $id);
        $q->execute();

        $dsc = $q->fetch();

        $q = $app['db']->prepare('select * from project_fields pf where pf.movie_id = :movie_id');
        $q->bindValue(':movie_id', $id);
        $q->execute();

        $fields = $q->fetchAll();

        $dsc['table'] = $fields;

        $q = $app['db']->prepare('select * from project_comments pc where pc.movie_id = :movie_id');
        $q->bindValue(':movie_id', $id);
        $q->execute();
        $comments = $q->fetchAll();

        $dsc['comments'] = $comments;

        return json_encode($dsc);
    }
}