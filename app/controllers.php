<?php

$app->get('/', 'App\\Controllers\\MainController::indexAction');

/* API */

$app->get('/api/all-movies', 'App\\Controllers\\ApiController::allMoviesAction');

$app->get('/api/movie/{id}', 'App\\Controllers\\ApiController::movieDescriptionAction');

$app->get('/api/movie/small/{id}', 'App\\Controllers\\ApiController::smallMovieDescription');

$app->get('/api/movie/full/{id}', 'App\\Controllers\\ApiController::largeMovieDescription');

/* ADMIN */

$app->match('/login', 'App\\Controllers\\AdminController::loginAction', '(GET|POST)')
    ->bind('login');

$app->get('/admin', 'App\\Controllers\\AdminController::indexAction')
    ->bind('admin');