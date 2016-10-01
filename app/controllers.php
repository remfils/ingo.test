<?php

$app->get($app['sub_domain'] . '/', 'App\\Controllers\\MainController::indexAction');
$app->get($app['sub_domain'] . '/movie/{id}', 'App\\Controllers\\MainController::indexAction');
$app->get($app['sub_domain'] . '/contacts', 'App\\Controllers\\MainController::indexAction');
$app->get($app['sub_domain'] . '/about', 'App\\Controllers\\MainController::indexAction');
$app->get($app['sub_domain'] . '/works', 'App\\Controllers\\MainController::indexAction');
$app->get($app['sub_domain'] . '/impressum', 'App\\Controllers\\MainController::indexAction');

/* API */

$app->get($app['sub_domain'] . '/api', 'App\\Controllers\\ApiController::indexAction');

$app->get($app['sub_domain'] . '/api/all-movies', 'App\\Controllers\\ApiController::allMoviesAction');

$app->get($app['sub_domain'] . '/api/movie/{id}', 'App\\Controllers\\ApiController::movieDescriptionAction');

$app->get($app['sub_domain'] . '/api/change-language/{language}', 'App\\Controllers\\ApiController::changeLanguage');

$app->get($app['sub_domain'] . '/api/send-email', 'App\\Controllers\\ApiController::sendMail');

/* ADMIN */

$app->get($app['sub_domain'] . '/admin', 'App\\Controllers\\AdminController::indexAction')
    ->bind('admin');

$app->get($app['sub_domain'] . '/admin/edit/project/{id}', 'App\\Controllers\\AdminController::editProjectAction')
    ->bind('admin_edit_project');
$app->post($app['sub_domain'] . '/admin/edit/project/{id}', 'App\\Controllers\\AdminController::editProjectPostAction');

$app->match($app['sub_domain'] . '/admin/add/project', 'App\\Controllers\\AdminController::addProjectAction', '(GET|POST)')
    ->bind('admin-add_project');

$app->get($app['sub_domain'] . '/admin/remove/project/{id}', 'App\\Controllers\\AdminController::removeProjectAction');