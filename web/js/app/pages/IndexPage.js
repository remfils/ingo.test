import React from "react";
//import "gsap";
var $ = require('jquery');

import config from '../config';
import TransitionStore from '../stores/TransitionStore';
import * as TransitionActions from '../actions/TransitionActions';

export default class IndexPage extends React.Component {
    componentDidMount() {
        var animated_bar = $('.animated-bar');
        var loading_msg = $('.index-loading-message');
        var logo = $('.index-logo');
        var video = $('.video-container');

        $('.video-container > video').on('click', this.showNavigationBar.bind(this));

        if ( config.DEBUG ) {
            TweenLite.set(video, {opacity: 1});
            this.showNavigationBar();
            return;
        }

        var tl = new TimelineLite();
        tl.to(animated_bar, 1, {width: '100%'})
            .to(loading_msg, 1, {width: '60%', delay: -0.5})
            .to(logo, 1, {opacity: 1})
            .to(loading_msg, 0.5, {opacity: 0, delay: -0.5})
            .to(animated_bar, 1, {height: '100%'})
            .to(video, 0, {opacity: 1})
            .to(animated_bar, 1, {opacity: 0})
            .to(logo, 1, {delay: -1, opacity: 0})
            .to(video, 0, {delay: -1, onComplete: (e) => {
                var vid = $('.video-container > video')[0];
                vid.play();
            }})
            .to(video, 0, {onComplete: function() {
                var vid = $('.video-container > video')[0];
                vid.style['z-index'] = 999;
            }});
    }

    showNavigationBar() {
        var navigation = $('.index-navigation');
        var video = $('.video-container > video')[0];
        var curtains = $('.curtain');
        var underlines = $('.underline');

        if ( config.DEBUG ) {
            TweenLite.set(navigation, {height: '30%'});
            TweenLite.set(navigation, {y: '30%'});
            TweenLite.set(underlines, {top: '100%'});
            TweenLite.set(curtains, {height: '1em'});
        }

        var tl = new TimelineLite();

        tl.to(navigation, 1, {height: '30%'})
            .to(video, 1, {delay: -1, y: '30%'})
            .to(underlines, 1, {top: '100%'})
            .to(curtains, 1, {delay: -1, height: '1em'});
    }

    leaveToMovies(event) {
        event.preventDefault();

        var index_section = $('#IndexPage')[0];
        var curtains = $('.curtain');

        /*TransitionStore.makeTransition(
            TransitionStore.INDEX_PAGE,
            TransitionStore.MOVIE_PAGE,
            tl
        );*/
        var tl = new TimelineLite();
        TransitionActions.fromIndexToMovieTranstion(tl);

        if ( config.DEBUG ) {
            index_section.style['display'] = 'none'
            return;
        }

        tl.to(curtains, 1, {height: '0'})
            .to(index_section, 1, {y: '-100%', onComplete:()=>{index_section.style['display'] = 'none'}});
    }

    leavePage(event) {
        return false;
    }

    transitionToMovies(event) {
        event.preventDefault();
        console.log('Leaving index to movies');

        var index_section = $('#IndexPage');
        var curtains = $('.curtain');

        var tl = new TimelineLite();
        tl.to(curtains, 1, {height: '0'})
            .to(index_section, 1, {y: '-100%'});
    }

    render() {
        return (
            <section id='IndexPage' class='animated-content'>
                <nav class="index-navigation">
                    <ul>
                        <li><div className="curtain"><a href="http://google.com" onClick={this.leaveToMovies.bind(this)}>Films</a></div><span class='underline'></span></li>
                        <li><div className="curtain"><a href="http://google.com" onClick={this.leavePage.bind(this)}>About</a></div><span class='underline'></span></li>
                        <li><div className="curtain"><a href="http://google.com" onClick={this.leavePage.bind(this)}>Contacts</a></div><span class='underline'></span></li>
                    </ul>
                </nav>

                <div class="content">
                    <div className="video-container">
                        <video src="res/Reel_Teil.mp4"></video>
                    </div>

                    <div className="animated-bar">
                    </div>

                    <div className="index-logo-container">
                        <span class='index-logo'></span>
                    </div>

                    <div className="index-loading-message">
                        <h1>Loading page...</h1>
                    </div>
                </div>

            </section>
        );
    }
}