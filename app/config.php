<?php

$app['debug'] = false;

/* assets */
$app['asset_path'] = 'http://ingo-test.tk/web/';

if ( $app['debug'] == true ) {
    $app['asset_path'] = 'http://ingo.test/web/';
}