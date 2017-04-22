<?php

use App\ProjectRepository;

$app->get($app['sub_domain'] . '/', 'App\\Controllers\\MainController::indexAction');
$app->get($app['sub_domain'] . '/movie/{id}', 'App\\Controllers\\MainController::indexAction');
$app->get($app['sub_domain'] . '/contacts', 'App\\Controllers\\MainController::indexAction');
$app->get($app['sub_domain'] . '/about', 'App\\Controllers\\MainController::indexAction');
$app->get($app['sub_domain'] . '/works', 'App\\Controllers\\MainController::indexAction');
$app->get($app['sub_domain'] . '/impressum', 'App\\Controllers\\MainController::indexAction');


/* SITEMAP */

$app->get('sitemap.xml', function () use ($app) {
  
    $host = $app['request']->getSchemeAndHttpHost();
      
    $sitemap = $app['sitemap'];
    $sitemap->addEntry($host . '/', 1, 'monthly');

    $sitemap->addEntry($host . '/contacts', 1, 'monthly');
    $sitemap->addEntry($host . '/about', 1, 'monthly');
    $sitemap->addEntry($host . '/works', 1, 'monthly');
    $sitemap->addEntry($host . '/impressum', 1, 'monthly');

    $db = new ProjectRepository($app);
    $projects = $db->getAllProjects();

    foreach ($projects as $k => $p) {
        $sitemap->addEntry($host . '/movie/' . $p['url'], 0.8, 'monthly');
    }
  
    return $sitemap->generate();
})
    ->bind('sitemap');

/* API */

$app->get($app['sub_domain'] . '/api', 'App\\Controllers\\ApiController::indexAction');

$app->get($app['sub_domain'] . '/api/all-movies', 'App\\Controllers\\ApiController::allMoviesAction');

$app->get($app['sub_domain'] . '/api/page/{page}', 'App\\Controllers\\ApiController::indexPageAction');

$app->get($app['sub_domain'] . '/api/movie/{id}', 'App\\Controllers\\ApiController::movieDescriptionAction');

$app->get($app['sub_domain'] . '/api/change-language/{language}', 'App\\Controllers\\ApiController::changeLanguage');

$app->post($app['sub_domain'] . '/api/send-email', 'App\\Controllers\\ApiController::sendMail');

/* ADMIN */

$app->get($app['sub_domain'] . '/admin', 'App\\Controllers\\AdminController::indexAction')
    ->bind('admin');

$app->get($app['sub_domain'] . '/admin/edit/project/{id}', 'App\\Controllers\\AdminController::editProjectAction')
    ->bind('admin_edit_project');
$app->post($app['sub_domain'] . '/admin/edit/project/{id}', 'App\\Controllers\\AdminController::editProjectPostAction');

$app->match($app['sub_domain'] . '/admin/add/project', 'App\\Controllers\\AdminController::addProjectAction', '(GET|POST)')
    ->bind('admin-add_project');

$app->get($app['sub_domain'] . '/admin/remove/project/{id}', 'App\\Controllers\\AdminController::removeProjectAction')
    ->bind('admin-remove_project');

$app->get($app['sub_domain'] . '/admin/show-custom-pages', 'App\\Controllers\\AdminController::showCustomPagesAction')
    ->bind('show-pages');

$app->get($app['sub_domain'] . '/admin/edit-page/{page_name}', 'App\\Controllers\\AdminController::editCustomPageGetAction')
    ->bind('edit-page');
$app->post($app['sub_domain'] . '/admin/edit-page/{page_name}', 'App\\Controllers\\AdminController::editCustomPagePostAction');