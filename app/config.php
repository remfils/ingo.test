<?php

$app['debug'] = true;

/* assets */
$app['sub_domain'] = '';
$app['asset_path'] = 'http://'. $_SERVER['SERVER_NAME'] . $app['sub_domain'] .'/web/';

/*$db_name = "ingo";
$db_user = "ingo";
$db_pass = "777qwe777";*/

$db_name = "ingodb";
$db_user = "a2892633_ingo";
$db_pass = "777qwe777";

if ( $app['debug'] == true ) {
    $db_name = "ingo.test";
    $db_user = "root";
    $db_pass = "";
}