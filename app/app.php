<?php

require_once '../vendor/autoload.php';

use Silex\Application;

$app = new Application();

$app['tmp_dir'] = __DIR__ . '/../var/tmp/';

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../templates/'
));

$app['asset_path'] = 'http://ingo-test.tk/web/';

if ( $app['debug'] == true ) {
    $app['asset_path'] = 'http://ingo.test/web/';
}

$app->register(new Silex\Provider\SessionServiceProvider());

$app->register(new Silex\Provider\UrlGeneratorServiceProvider());

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