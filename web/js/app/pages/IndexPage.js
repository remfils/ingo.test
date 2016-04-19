import React from "react";
//import "gsap";
var $ = require('jquery');

export default class IndexPage extends React.Component {
    componentDidMount() {
        var animated_bar = $('.animated-bar');
        var loading_msg = $('.index-loading-message');
        var logo = $('.index-logo');
        var video = $('.video-container');

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

        ;
    }

    render() {
        return (
            <section key='IndexPage' class='animated-content'>
                <nav class="index-navigation">
                    <ul>
                        <li><a href="http://google.com">Films</a></li>
                        <li><a href="http://google.com">About</a></li>
                        <li><a href="http://google.com">Contacts</a></li>
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