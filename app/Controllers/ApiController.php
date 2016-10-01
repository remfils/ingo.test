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
        $password = $app['security.encoder.digest']->encodePassword('admin');
        return $password;
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
            $model = $result->as_array();
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

        //$model = self::array_utf8_encode($model);

        return json_encode($model);
    }

    public function sendMail(Request $req, Application $app) {
        $to = $app['sender_email']; // this is your Email address
        $from = $_POST['email']; // this is the sender's Email address
        $name = $_POST['name'];
        $subject = "Form submission";
        $subject2 = "Copy of your form submission";
        $message = $name . " wrote the following:" . "\n\n" . $_POST['message'];
        $message2 = "Here is a copy of your message " . $name . "\n\n" . $_POST['message'];

        $headers = "From:" . $from;
        $headers2 = "From:" . $to;
        mail($to,$subject,$message,$headers);
        mail($from,$subject2,$message2,$headers2); // sends a copy of the message to the sender
        echo "Mail Sent. Thank you " . $name . ", we will contact you shortly.";
        // You can also use header('Location: thank_you.php'); to redirect to another page.
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