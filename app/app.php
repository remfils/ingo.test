<?php

require_once '../vendor/autoload.php';

use Silex\Application;

$app = new Application();

require 'config.php';

$app['tmp_dir'] = __DIR__ . '/../var/tmp/';

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../templates/'
));

$app->register(new Silex\Provider\SessionServiceProvider());

$app->register(new Silex\Provider\UrlGeneratorServiceProvider());

$app->register(new Silex\Provider\FormServiceProvider());

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
        'driver' => 'pdo_mysql',
        'dbhost' => 'localhost',
        'dbname' => $db_name,
        'user' => $db_user,
        'password' => $db_pass,
        'charset' => 'utf8'
    ),
));

$app->register(new Arseniew\Silex\Provider\IdiormServiceProvider(), array(
    'idiorm.db.options' => array(
        'connection_string' => 'mysql:host=localhost;dbname=' . $db_name,
        'username' => $db_user,
        'password' => $db_pass
    )
));

/* SECURITY */

$app->register(new Silex\Provider\SecurityServiceProvider(), array(
    'security.firewalls' => array(
        'admin' => array(
            'pattern' => '^'. $app['sub_domain'] .'/admin',
            'http' => true,
            'logout' => array('logout_path' => $app['sub_domain'] . '/admin/logout', 'invalidate_session' => true),
            'users' => $app->share(function() use ($app) {
                return new App\Providers\UserProvider($app['idiorm.db']);
            }),
        ),
    )
));

/* LANGUAGE */

$app->register(new Silex\Provider\TranslationServiceProvider(), array(
    'locale_fallbacks' => array('de'),
));

$app['translator'] = $app->share($app->extend('translator', function($translator, $app) {
    $translator->addLoader('yaml', new Symfony\Component\Translation\Loader\YamlFileLoader());
    return $translator;
}));

$lang = "de";
if ($app['session']->get('current_language')) {
    $lang = $app['session']->get('current_language');
}

foreach (glob(__DIR__ . '../locale/'. $lang . '/*.yml') as $locale) {
    $app['translator']->addResource('yaml', $locale, $lang);
}

$app['translator']->setLocale($lang);

//$lang = 'de';

/*if ($app['session']->get('current_language')) {
    $lang = $app['session']->get('current_language');
}*/
/*foreach (glob(__DIR__ . '/../locale/'. $lang . '/*.yml') as $locale) {
    $app['translator']->addResource('yaml', $locale, $lang);
}*/

//$app['translator']->setLocale($lang);

return $app;