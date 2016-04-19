<?php

namespace App\Controllers;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;


class MainController
{
    public function indexAction( Request $req, Application $app ) {
        foreach(glob(__DIR__ . '/locale/*') as $locale) {
            $languages[] = basename($locale);
        }

        return $app['twig']->render('index.html.twig', array('languages' => $languages));
    }
}