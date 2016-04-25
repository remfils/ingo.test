<?php

require_once '../vendor/autoload.php';

use Silex\Application;

$app = new Application();

$app['tmp_dir'] = __DIR__ . '/../var/tmp/';

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../templates/'
));

$app->register(new Silex\Provider\SessionServiceProvider());

$app->register(new Silex\Provider\UrlGeneratorServiceProvider());

$app->register(new Silex\Provider\FormServiceProvider());

/* SECURITY */

$app->register(new Silex\Provider\SecurityServiceProvider(), array(
    'security.firewalls' => array(
        'admin' => array(
            'pattern' => '^/admin',
            'http' => true,
            'users' => array(
                // raw password is foo
                'admin' => array('ROLE_ADMIN', '5FZ2Z8QIkA7UTZ4BYkoC+GsReLf569mSKDsfods6LYQ8t+a8EW9oaircfMpmaLbPBh4FOBiiFyLfuZmTSUwzZg=='),
            ),
        ),
    )
));

/* LANGUAGE */

$app->register(new Silex\Provider\TranslationServiceProvider(), array(
    'locale_fallback' => 'en',
));

$app['translator'] = $app->share($app->extend('translator', function($translator, $app) {
    $translator->addLoader('yaml', new Symfony\Component\Translation\Loader\YamlFileLoader());
    return $translator;
}));

$lang = 'en';

if ($app['session']->get('current_language')) {
    $lang = $app['session']->get('current_language');
}
foreach (glob(__DIR__ . '/../locale/'. $lang . '/*.yml') as $locale) {
    $app['translator']->addResource('yaml', $locale, $lang);
}

$app['translator']->setLocale($lang);

return $app;