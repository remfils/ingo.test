<?php

$app->get('/', 'App\\Controllers\\MainController::indexAction');
$app->get('/movie/{id}', 'App\\Controllers\\MainController::indexAction');
$app->get('/contacts', 'App\\Controllers\\MainController::indexAction');

/* API */

$app->get('/api/all-movies', 'App\\Controllers\\ApiController::allMoviesAction');

$app->get('/api/movie/{id}', 'App\\Controllers\\ApiController::movieDescriptionAction');

$app->get('/api/change-language/{language}', 'App\\Controllers\\ApiController::changeLanguage');

/* ADMIN */

$app->get('/admin', 'App\\Controllers\\AdminController::indexAction')
    ->bind('admin');

$app->get('/admin/edit/project/{id}', 'App\\Controllers\\AdminController::editProjectAction')
    ->bind('admin_edit_project');
$app->post('/admin/edit/project/{id}', 'App\\Controllers\\AdminController::editProjectPostAction');

$app->match('/admin/add/project', 'App\\Controllers\\AdminController::addProjectAction', '(GET|POST)')
    ->bind('admin-add_project');

$app->get('/admin/remove/project/{id}', 'App\\Controllers\\AdminController::removeProjectAction');