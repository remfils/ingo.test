<?php

$app->get('/', 'App\\Controllers\\MainController::indexAction');

/* API */

$app->get('/api/all-movies', 'App\\Controllers\\ApiController::allMoviesAction');

$app->get('/api/movie/{id}', 'App\\Controllers\\ApiController::movieDescriptionAction');

/*D!*/
$app->get('/api/movie/small/{id}', 'App\\Controllers\\ApiController::smallMovieDescription');
/*D!*/
$app->get('/api/movie/full/{id}', 'App\\Controllers\\ApiController::largeMovieDescription');

/* ADMIN */

$app->get('/admin', 'App\\Controllers\\AdminController::indexAction')
    ->bind('admin');

$app->match('/admin/edit/project/{id}', 'App\\Controllers\\AdminController::editProjectAction', '(GET|POST)');

$app->match('/admin/add/project', 'App\\Controllers\\AdminController::addProjectAction', '(GET|POST)');