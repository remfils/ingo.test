<?php

$app['debug'] = true;

/* assets */
$app['sub_domain'] = '';
$app['asset_path'] = 'http://'. $_SERVER['SERVER_NAME'] . $app['sub_domain'] .'/web/';

/*$db_name = "ingo";
$db_user = "ingo";
$db_pass = "777qwe777";*/

$db_name = "wsh1490_ingo";
$db_user = "wsh1490_ingo";
$db_pass = "777qwe777";

$app['sender_email'] = 'pereskokow@gmail.com';

if ( $app['debug'] == true ) {
    $db_name = "ingo.test";
    $db_user = "root";
    $db_pass = "";
}