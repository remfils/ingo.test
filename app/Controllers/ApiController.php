<?php

namespace App\Controllers;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class ApiController
{
    public function indexAction( Request $req, Application $app )
    {

    }

    public function allMoviesAction() {
        $result = array(
            array(
                'id' => 1,
                'name' =>'INSULINE MEDICAL - INSUPAD',
                'year' => '2001',
                'logo' => 'img/movies/InsuPad-6.png',
                'color' => '#cbfdcb'
            ),
            array(
                'id' => 2,
                'name' =>'Renault Twizzy Brand Campaign',
                'year' => '2012',
                'logo' => 'img/movies/Frame_Renault-5.png',
                'color' => '#ccf6e2'
            )
        );

        return json_encode($result);
    }

    public function smallMovieDescription( Request $req, Application $app ) {
        $id = $req->attributes->get('id');

        $movie_array = array(
            array(
                'id' => 1,
                'preview' => "",
                'table' => array(
                    'Agentur' => 'tsitrone medien GmbH & Co. KG',
                    'Kamera' => 'Ingo Scheel',
                    'Schnitt' => 'Ingo Scheel'
                )
            ),
            array(
                'id' => 2,
                'preview' => "",
                'table' => array(
                    'Produktion' => 'Ingo Scheel',
                    'DoP' => 'Ingo Scheel',
                    'Schnitt' => 'Ingo Scheel'
                )
            )
        );

        $result = array();

        foreach ( $movie_array as $i => $movie ) {
            if ( $movie['id'] == $id ) {
                $result = $movie;
                break;
            }
        }

        return json_encode($result);
    }

    public function largeMovieDescription( Request $req, Application $app ) {
        $result = array();

        return json_encode($result);
    }

    public function movieAction( Request $req, Application $app )
    {
        $result = array(
            array(
                'id' => 1,
                'name' =>'INSULINE MEDICAL - INSUPAD',
                'year' => '2001',
                'logo' => 'img/movies/InsuPad-6.png',
                'color' => '#cbfdcb'
            ),
            array(
                'id' => 2,
                'name' =>'Renault Twizzy Brand Campaign',
                'year' => '2012',
                'logo' => 'img/movies/Frame_Renault-5.png',
                'color' => '#ccf6e2'
            )
        );

        return $result;
    }
}