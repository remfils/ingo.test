import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import 'gsap';
import config from './config';
// require('gsap/src/minified/plugins/ColorPropsPlugin.min');
require('../../../node_modules/gsap/src/minified/plugins/ColorPropsPlugin.min');

require('jquery-mousewheel');

import Application from './Application';

var app = document.getElementById('App');

var loading_screen = $('#LoadingScreen');
var loading_cover = $('#LoadingScreen > .loading-cover');
var loading_text = $('#LoadingScreen > .loading-percents');

loading_cover.css('width', '50%');

window.$ = $;

window.scrollTo(0,0);

function updatePercents() {
    var ratio = Math.round(loading_cover.outerWidth(true) / loading_screen.outerWidth(true) * 100);
    loading_text.html(ratio);
}

var timer = setInterval(updatePercents, 10);

var load_start_time = Date.now();

function hideLoadingScreen(callback) {
    loading_cover.css('width', '100%');

    var delta_time = Date.now() - load_start_time;
    var load_delay = 0;
    if (delta_time < config.MIN_LOAD_TIME)
        load_delay = config.MIN_LOAD_TIME - delta_time;

    setTimeout(function(){
        clearInterval(timer);

        var $load_screen = $('#LoadingScreen');

        TweenLite.to($('#LoadingScreen .loading-text'), 0.5, {opacity: 0});
        TweenLite.to($load_screen, 1, {opacity: 0, delay: 0.8, onComplete: () => {
            $load_screen.hide();
        }});
    }, load_delay);

    if (callback) {
        callback();
    }
}

ReactDOM.render(<Application onAjaxLoaded={hideLoadingScreen} lang={window.lang}/>, app);