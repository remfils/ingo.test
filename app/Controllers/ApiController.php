<?php

namespace App\Controllers;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class ApiController
{
    public function indexAction( Request $req, Application $app )
    {

    }

    public function allMoviesAction( Request $req, Application $app ) {
        $q = $app['db']->query('select * from projects');
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