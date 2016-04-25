<?php

$app['debug'] = false;

/* assets */
$app['asset_path'] = 'http://ingo-test.tk/web/';

$db_name = "ingo";
$db_user = "ingo";
$db_pass = "777qwe777";

if ( $app['debug'] == true ) {
    $app['asset_path'] = 'http://ingo.test/web/';
    $db_name = "ingo.test";
    $db_user = "root";
    $db_pass = "";
}