import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import 'gsap';
// require('gsap/src/minified/plugins/ColorPropsPlugin.min');
require('../../../node_modules/gsap/src/minified/plugins/ColorPropsPlugin.min');

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

function hideLoadingScreen(callback) {
    loading_cover.css('width', '100%');
    setTimeout(function(){
        clearInterval(timer);
        loading_screen.hide();
        if (callback) {
            callback();
        }
    }, 2000);
}

ReactDOM.render(<Application onAjaxLoaded={hideLoadingScreen} lang={window.lang}/>, app);