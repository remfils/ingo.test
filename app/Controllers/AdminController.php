<?php

namespace App\Controllers;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

use App\Models\Project;

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

            // var_dump($_FILES["logo"]["tmp_name"], "$upload_directory/$logo_file_name");

            $data['name'] = $req->get('name');
            $data['color'] = $req->get('color');
            $data['year'] = $req->get('year');
            $data['logo'] = $img_dir . '/' . $logo_file_name;
            $data['preview_url'] = $req->get('preview_url');
            $data['description'] = $comment["text"] = str_replace("\n", '<br/>', trim($req->get('description')));;

            $data = $this->getFieldsAndCommentsFromArray($req->request->all());
            $fields = $data['fields'];
            $comments = $data['comments'];

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
                    $comment["text"] = str_replace("\n", '<br/>', trim($comment["text"]));

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

    private function getFieldsAndCommentsFromArray( $data, $images_required = true ) {
        $fields = array();
        $comments = array();

        foreach ( $data as $key => $value ) {
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
                    if ( !$images_required or $_FILES['comment_img_' . $cid]['size'] > 1 ) {
                        $comments[$cid] = array( $matches['name'] => $value);
                        $comments[$cid]['file'] = $_FILES['comment_img_' . $cid];
                    }
                }
            }
        }

        return array(
            'fields' => $fields,
            'comments' => $comments
        );
    }

    public function editProjectAction( Request $req, Application $app ) {
        $id = $req->attributes->get('id');

        $q = $app['db']->prepare('select * from projects p join project_description pd on pd.movie_id = p.id where p.id = :id');
        $q->bindValue(':id', $id);
        $q->execute();
        $movie = $q->fetchAll(\PDO::FETCH_CLASS, 'App\\Models\\Project')[0];
        $movie->description = str_replace('<br/>', "\n", $movie->description);

        $movie->loadProjectData($app);

        return $app['twig']->render('admin/edit-project.html.twig', array(
            'error_msg' => '',
            'success_msg' => '',
            'movie' => $movie
        ));
    }

    public function editProjectPostAction( Request $req, Application $app ) {
        $id = $req->attributes->get('id');
        $data = $req->request->all();
        $pr = new Project();
        $pr->id = $req->attributes->get('id');

        $pr->setProjectFromPost($req->request->all());

        $is_logo_changed = false;

        if ( isset($data['logo']) ) {
            // move uploaded image
            $is_logo_changed = true;
            var_dump($is_logo_changed);
        }

        $fields = $this->getFieldsAndCommentsFromArray($data, false);
        $data['fields'] = $fields['fields'];
        $data['comments'] = $fields['comments'];

        /*$r = 'update projects set name=:name, color=:color, year=:year' . ($is_logo_changed ? ', logo=:logo' : '') . ' where id=:movie_id;';
        $q = $app['db']->prepare($r);
        $q->bindValue(':name', $data['name']);
        $q->bindValue(':color', $data['color']);
        $q->bindValue(':year', $data['year']);
        $q->bindValue(':movie_id', $id);
        if ( $is_logo_changed ) {
            $q->bindValue(':logo', $data['logo']);
        }

        $q->execute();*/

        $q = $app['db']->prepare('select id from project_fields where movie_id=:id');
        $q->bindValue(':id', $id);
        $q->execute();
        $fields_id = $q->fetchAll();

        $fields_id = array_map(function($row){
            return $row['id'];
        }, $fields_id);

        $new_fields = 0;

        foreach ( $data['fields'] as $key => $field ) {
            $id_index = array_search($key, $fields_id);

            if ( $id_index ) {
                /*$r = 'UPDATE project_fields SET field_name=:field_name, field_value=:field_value WHERE id=:id';
                $q = $app['db']->prepare($r);
                $q->bindValue(':id', $key);*/
                unset($fields_id[$id_index]);
            }
            else {
                /*$r = 'INSERT INTO project_fields (field_name, field_value) VALUES (:field_name, :field_value)';
                $q = $app['db']->prepare($r);*/
                $new_fields++;
            }

            /*$q->bindValue(':field_name', $field['name']);
            $q->bindValue(':field_value', $field['value']);
            $q->execute();*/
        }

        var_dump($fields_id,$data['fields']);

        return $new_fields;

        /*foreach ( $fields_id as $key => $id ) {
            $q = $app['db']->prepare('DELETE FROM project_fields WHERE id=:id');
            $q->bindValue(':id', $id);
            $q->execute();
        }*/


        /*foreach ( $data['comments'] as $key => $comment ) {
            $q = $app['db']->prepare('update project_comments set text=:text where id=:id');

            $text = str_replace("\n", '<br/>', trim($comment['text']));

            $q->bindValue(':text', $text);
            $q->bindValue(':id', $key);
            $q->execute();
        }*/


        return $app->redirect('admin');
    }

    public function removeProjectAction( Request $req, Application $app ) {
        $id = $req->attributes->get('id');

        $q = $app['db']->prepare('DELETE FROM projects WHERE id=:id');
        $q->bindValue(':id', $id);
        $q->execute();

        $remove_project_from = function($table) use ($app, $id) {
            $q = $app['db']->prepare('DELETE FROM '. $table .' WHERE id=:movie_id');
            $q->bindValue(':movie_id', $id);
            $q->execute();
        };

        $remove_project_from('project_description');

        $remove_project_from('project_fields');

        $remove_project_from('project_comments');

        return $app->redirect('/admin');
    }
}