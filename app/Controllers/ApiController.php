<?php

namespace App\Controllers;

use App\ProjectRepository;
use Silex\Application;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\Request;
use PHPMailer;

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

    public function indexPageAction(Request $req, Application $app) {
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

        $page_name = $req->attributes->get('page');

        $page = $app['idiorm.db']->for_table('pages_lang')
            ->select_many(
                'page_name',
                'placeholder_name',
                'placeholder_text'
            )
            ->where('page_name', $page_name)
            ->where('lang_id', $lang_id)
            ->group_by('placeholder_name')
            ->find_array();

        $result = array();

        foreach($page as $k => $item) {
            $result[$item['placeholder_name']] = $item['placeholder_text'];
        }

        return json_encode($result);
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
                'p.url',
                'p.logo',
                'p.logo_short',
                'p.preview_url',
                'p.year',
                'pl.name',
                'pl.genre',
                'pl.description'
            )
            ->join('project_lang', array('p.id', '=', 'pl.project_id'), 'pl')
            ->where('p.url', $project_id)
            ->where('p.active', true)
            ->where('pl.lang_id', $lang_id)
            ->find_one();

        if ($result) {
            $model = $result->as_array();
        }
        else {
            throw new Exception("Project was not found");
        }

        $project_id = $model['id'];

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

        return json_encode($model);
    }

    public function sendMail(Request $req, Application $app) {
        $RECIPIENT_EMAIL = $app['recepient_email'] ;
        $BOT_EMAIL = $app['bot_email'];

        $from = $_POST['email'];
        $name = $_POST['name'];
        $message = "Message from $name: $from <br/><br/>" . $_POST['message'];

        $EMAIL_SUBJECT = "ingo: contact message from $from";

        $mail = new PHPMailer;

        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->SMTPDebug = 0;
        $mail->Host = '94.100.180.160';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = $BOT_EMAIL;                 // SMTP username
        $mail->Password = $app['bot_password'];                           // SMTP password
        $mail->Port = 587;
        $mail->SMTPSecure = 'tls';

        $mail->From = $BOT_EMAIL;
        $mail->FromName = $name;
        $mail->addAddress($RECIPIENT_EMAIL, 'Joe User');     // Add a recipient

        $mail->Subject = $EMAIL_SUBJECT;
        $mail->Body = $message;
        $mail->AltBody = $message;

        if(!$mail->send()) {
            return json_encode(array('message' => 'Message could not be sent.'));
        } else {
            return json_encode(array(
                'message' => 'Message has been sent',
                'messageIsSent' => true
            ));
        }
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
