<?php

$app['debug'] = true;

/* assets */
$app['asset_path'] = 'http://ingo-test.tk/web/';

if ( $app['debug'] == true ) {
    $app['asset_path'] = 'http://ingo.test/web/';
}