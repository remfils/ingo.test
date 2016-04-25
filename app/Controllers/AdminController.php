<?php

namespace App\Controllers;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class AdminController
{
    public function indexAction( Request $req, Application $app )
    {
        if ($app['security.authorization_checker']->isGranted('ROLE_USER')) {
            $q = $app['db']->query('select * from projects');
            $q->execute();
            $projects = $q->fetchAll();

            return $app['twig']->render('admin/admin.html.twig', array(
                'projects' => $projects
            ));
        }

        return 'NOPE';
    }
/*D!*/
    public function loginAction( Request $req, Application $app )
    {
        $default = array(
            'login' => 'login',
            'password' => 'pass'
        );

        $pass = $app['security.encoder.digest']->encodePassword('admin', '');

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
            'login_form' => $login_form->createView(),
            'pass' => $pass
        ));
    }

    public function editProjectAction( Request $req, Application $app ) {
        $id = $req->attributes->get('id');

        $q = $app['db']->prepare('select * from projects p join project_description pd on pd.movie_id = p.id where p.id = :id');
        $q->bindValue(':id', $id);
        $q->execute();
        $movie = $q->fetch();

        $q = $app['db']->prepare('select * from project_fields p where p.movie_id = :id');
        $q->bindValue(':id', $id);
        $q->execute();
        $table = $q->fetchAll();

        $form = $app['form.factory']->createBuilder('form', $movie)
            ->add('name', 'text')
            ->add('color', 'text')
            ->add('year', 'text')
            ->add('logo', 'text')
            ->add('preview_url', 'text')
            ->add('description', 'textarea', array(
                'attr' => array('rows' => '10')
            ))
            ->add('submit', 'submit', array(
                'attr' => array('class' => 'btn-submit')
            ))
            ->getForm();

        return $app['twig']->render('admin/edit-project.html.twig', array('form'=>$form->createView()));
    }
}