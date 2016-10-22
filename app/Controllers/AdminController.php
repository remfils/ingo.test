<?php

namespace App\Controllers;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

use App\Models\Project;
use App\ProjectRepository;

use Kint;

class AdminController
{
    public function indexAction( Request $req, Application $app )
    {
        if ($app['security.authorization_checker']->isGranted('ROLE_USER')) {
            $db = new ProjectRepository($app);
            $model = $db->getAllProjects();

            return $app['twig']->render('admin/admin.html.twig', array(
                'projects' => $model
            ));
        }

        $password = $app['security.encoder.digest']->encodePassword('admin', '');

        return $password;
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

    public function showCustomPagesAction(Request $req, Application $app) {
        $model = $app['idiorm.db']->for_table('pages_lang')
            ->group_by('page_name')
            ->find_array();

        return $app['twig']->render('admin/show-custom-pages.html.twig', array(
            'model' => $model
        ));
    }

    public function editCustomPageGetAction(Request $req, Application $app) {
        $page = $req->get('page_name');

        $model = $app['idiorm.db']->for_table('pages_lang')
            ->table_alias('p')
            ->select_many(array(
                'p.id',
                'page_name',
                'lang' => 'l.name',
                'placeholder_name',
                'placeholder_text'
            ))
            ->join('lang', array('p.lang_id', '=', 'l.id'), 'l')
            ->where('page_name', $page)
            ->find_array();

        $result = array();

        foreach ($model as $k => $item) {
            $lang = $item['lang'];
            $key = $item['placeholder_name'];

            if (!array_key_exists($key, $result)) {
                $result[$key] = array();
            }

            if (!array_key_exists($lang, $result[$key])) {
                $result[$key][$lang] = array();
            }

            $result[$key][$lang]['id'] = $item['id'];
            $result[$key][$lang]['key'] = $item['placeholder_name'];
            $result[$key][$lang]['value'] = $item['placeholder_text'];
        }

        return $app['twig']->render('admin/edit-custom-page.html.twig', array(
            'page_name' => $page,
            'model' => $result,
            'message' => null,
            'error_message' => null
        ));
    }

    public function editCustomPagePostAction(Request $req, Application $app) {
        $page = $req->get('page_name');
        $data = $req->get('model');

        foreach ($data as $k => $v) {
            $item = $app['idiorm.db']->for_table('pages_lang')->where('id', $k)->find_one();
            $item->placeholder_text = $v;
            $item->save();
        }

        $model = $app['idiorm.db']->for_table('pages_lang')
            ->table_alias('p')
            ->select_many(array(
                'p.id',
                'page_name',
                'lang' => 'l.name',
                'placeholder_name',
                'placeholder_text'
            ))
            ->join('lang', array('p.lang_id', '=', 'l.id'), 'l')
            ->where('page_name', $page)
            ->find_array();

        $result = array();

        foreach ($model as $k => $item) {
            $lang = $item['lang'];
            $key = $item['placeholder_name'];

            if (!array_key_exists($key, $result)) {
                $result[$key] = array();
            }

            if (!array_key_exists($lang, $result[$key])) {
                $result[$key][$lang] = array();
            }

            $result[$key][$lang]['id'] = $item['id'];
            $result[$key][$lang]['key'] = $item['placeholder_name'];
            $result[$key][$lang]['value'] = $item['placeholder_text'];
        }

        return $app['twig']->render('admin/edit-custom-page.html.twig', array(
            'page_name' => $page,
            'model' => $result,
            'message' => 'Page was saved successfully!',
            'error_message' => null
        ));
    }

    public function editImpressumPage(Request $req, Application $app) {
        return $app['twig']->render('admin/edit-impressum.html.twig');
    }

    public function addProjectAction( Request $req, Application $app ) {
        $success_message = '';
        $error_message = '';
        $errs = array();
        $project = null;

        if ( $req->isMethod('POST') ) {
            $db = new ProjectRepository($app);

            $project = $req->request->all()['project'];

            if ($db->isProjectValid($project, $errs)) {
                $db->createProjectFromPost($project);
            }
        }

        return $app['twig']->render('admin/edit-project.html.twig', array(
            'success_msg' => $success_message,
            'error_msg' => $error_message,
            'errors' => $errs,
            'movie' => new Project($project)
        ));
    }

    public function editProjectAction( Request $req, Application $app ) {
        $id = $req->attributes->get('id');

        $db = new ProjectRepository($app);
        $res = $db->getProjectForEditing($id);
        $model = new Project($res);

        return $app['twig']->render('admin/edit-project.html.twig', array(
            'error_msg' => '',
            'success_msg' => '',
            'errors' => array(),
            'movie' => $model
        ));
    }

    public function editProjectPostAction( Request $req, Application $app ) {
        $id = $req->attributes->get('id');

        $post = $req->request->all();

        $project_repo = new ProjectRepository($app);
        $project_repo->updateProjectFromPost($id, $post['project']);
        
        return $app->redirect($app["url_generator"]->generate('admin_edit_project', array('id'=>$id)));
    }

    public function removeProjectAction( Request $req, Application $app ) {
        $id = $req->attributes->get('id');

        $db = new ProjectRepository($app);
        $db->softRemoveProject($id);

        /*$q = $app['db']->prepare('DELETE FROM projects WHERE id=:id');
        $q->bindValue(':id', $id);
        $q->execute();

        $remove_project_from = function($table) use ($app, $id) {
            $q = $app['db']->prepare('DELETE FROM '. $table .' WHERE id=:movie_id');
            $q->bindValue(':movie_id', $id);
            $q->execute();
        };

        $remove_project_from('project_description');

        $remove_project_from('project_fields');

        $remove_project_from('project_comments');*/

        return $app->redirect($app['url_generator']->generate('admin'));
    }
}