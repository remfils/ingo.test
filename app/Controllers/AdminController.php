<?php

namespace App\Controllers;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class AdminController
{
    public function indexAction( Request $req, Application $app )
    {
        return '<h1>This is admin page</h1>';
    }

    public function loginAction( Request $req, Application $app )
    {
        $default = array(
            'login' => 'login',
            'password' => 'pass'
        );

        $login_form = $app['form.factory']->createBuilder('form', $default)
            ->add('login', 'text', array(
                'attr' => array('class' => 'txt-field')
            ))
            ->add('password', 'password', array(
                'attr' => array('class' => 'txt-field')
            ))
            ->add('send', 'submit', array(
                'attr' => array('class' => 'btn-submit')
            ))
            ->getForm();

        $login_form->handleRequest($req);

        if ( $login_form->isValid() ) {
            $data = $login_form->getData();

            if ( $data['login'] == 'admin' && $data['password'] == 'admin' ) {

            }
        }

        return $app['twig']->render('admin/login.html.twig', array(
            'login_form' => $login_form->createView()
        ));
    }
}