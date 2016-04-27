<?php

namespace App\Controllers;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

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

    public function addProjectAction( Request $req, Application $app ) {
        $success_message = '';
        $error_message = '';

        if ( $req->isMethod('POST') ) {
            $data = array();

            $img_dir = 'img/movies';
            $upload_directory = dirname($_SERVER["SCRIPT_FILENAME"]) . '/' . $img_dir;
            $logo_file_name = str_replace(' ', '_', $_FILES['logo']['name']);

            var_dump($_FILES["logo"]["tmp_name"], "$upload_directory/$logo_file_name");

            $data['name'] = $req->get('name');
            $data['color'] = $req->get('color');
            $data['year'] = $req->get('year');
            $data['logo'] = $img_dir . '/' . $logo_file_name;
            $data['preview_url'] = $req->get('preview_url');
            $data['description'] = $req->get('description');

            $fields = array();
            $comments = array();

            foreach ( $req->request->all() as $key => $value ) {
                if ( preg_match('/^field_(?P<name>.+)_(?P<id>.+)/', $key, $matches ) ) {
                    if ( isset($fields[$matches['id']]) ) {
                        $fields[$matches['id']][$matches['name']] = $value;
                    }
                    else {
                        $fields[$matches['id']] = array( $matches['name'] => $value);
                    }
                }
                else if ( preg_match('/^comment_(?P<name>.+)_(?P<id>.+)/', $key, $matches ) ) {
                    $cid = $matches['id'];
                    if ( isset($comments[$matches['id']]) ) {
                        $comments[$cid][$matches['name']] = $value;
                    }
                    else {
                        if ( $_FILES['comment_img_' . $cid]['size'] > 1 ) {
                            $comments[$cid] = array( $matches['name'] => $value);
                            $comments[$cid]['file'] = $_FILES['comment_img_' . $cid];
                        }
                    }
                }
            }

            /*if ( file_exists("$upload_directory/$logo_file_name") ) {
                $error_message = "Logotype file: $logo_file_name already exists!";
            }*/

            if ( empty($error_message) ) {
                move_uploaded_file($_FILES["logo"]["tmp_name"], "$upload_directory/$logo_file_name");

                $q = $app['db']->prepare('INSERT INTO projects (name, color, year, logo) VALUES (:name, :color, :year, :logo)');
                $q->bindValue(':name', $data['name']);
                $q->bindValue(':color', $data['color']);
                $q->bindValue(':year', $data['year']);
                $q->bindValue(':logo', $data['logo']);
                $q->execute();

                $id = $app['db']->lastInsertId();

                $q = $app['db']->prepare('INSERT INTO project_description (preview_url, description, movie_id) VALUES (:preview_url, :description, :movie_id)');
                $q->bindValue(':preview_url', $data['preview_url']);
                $q->bindValue(':description', $data['description']);
                $q->bindValue(':movie_id', $id);
                $q->execute();

                foreach ( $fields as $key => $field ) {
                    $q = $app['db']->prepare('INSERT INTO project_fields (movie_id, field_name, field_value) VALUES (:movie_id, :field_name, :field_value)');
                    $q->bindValue(':field_name', $field['name']);
                    $q->bindValue(':field_value', $field['value']);
                    $q->bindValue(':movie_id', $id);
                    $q->execute();
                }

                foreach ( $comments as $key => $comment ) {
                    $file_name = $id . '_' . str_replace(' ', '_', $comment['file'][name]);
                    var_dump("$upload_directory/comments/$file_name");
                    move_uploaded_file($comment['file']["tmp_name"], "$upload_directory/comments/$file_name");

                    $q = $app['db']->prepare('INSERT INTO project_comments (movie_id, image_url, text) VALUES (:movie_id, :image_url, :text)');
                    $q->bindValue(':movie_id', $id);
                    $q->bindValue(':image_url', "$img_dir/comments/$file_name");
                    $q->bindValue(':text', $comment["text"]);
                    $q->execute();
                }

                $success_message = 'project successfully created! ';
            }
        }

        return $app['twig']->render('admin/new-project.html.twig', array(
            'success_message' => $success_message,
            'error_message' => $error_message
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

        $form->handleRequest($req);

        $success_message = '';

        if ( $form->isValid() ) {
            $data = $form->getData();

            $q = $app['db']->prepare('update projects set name = :name, color = :color, year=:year, logo=:logo where movie_id = :movie_id');
            $q->bindValue(':name', $data['name']);
            $q->bindValue(':color', $data['color']);
            $q->bindValue(':year', $data['year']);
            $q->bindValue(':logo', $data['logo']);
            $q->bindValue(':movie_id', $id);
            $q->execute();

            $success_message = 'project successfully edited!';
        }

        return $app['twig']->render('admin/edit-project.html.twig', array(
            'form'=>$form->createView(),
            'success_message' => $success_message
        ));
    }
}