<?php

$app['debug'] = true;

/* assets */
$app['asset_path'] = 'http://'. $_SERVER['SERVER_NAME'] .'/web/';

$db_name = "ingo";
$db_user = "ingo";
$db_pass = "777qwe777";

if ( $app['debug'] == true ) {
    $db_name = "ingo.test";
    $db_user = "root";
    $db_pass = "";
}