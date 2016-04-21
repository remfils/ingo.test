import React from 'react';
var $ = require('jquery');

import TransitionStore from '../stores/TransitionStore';
import SmallDescription from './MoviePage/SmallDescription';
import FullDescription from './MoviePage/FullDescription';

export default class MoviePage extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        if ( this.isOnPage ) return;

        var tl = this.props.sharedTimeline;

        var movie_id = "#Movie" + this.props.movieId;

        var logo = $( movie_id + ' .project-main-image')[0];
        logo.style['background'] = 'url(' + this.props.logo + ')';

        var movie_title = $(movie_id + ' .project-title h1')[0];

        this.state = {
            small_description: null,
            large_description: null
        };

        var $this = $("#Movie" + this.props.movieId)[0];

        switch ( this.props.from ) {
            case TransitionStore.INDEX_PAGE:
                TweenLite.set($this, {top: '100%'});
                tl.to($this, 1, {delay:-0.5, top: '0', onComplete: this.props.app.switchPagesAfterTransition.bind(this.props.app)});
                break;
            case TransitionStore.MOVIE_PAGE_RIGHT:
                var logo = $("#Movie" + this.props.movieId + " .project-main-image")[0];

                tl.from(logo, 1, {delay:-0.5, x: '100%', onComplete: this.props.app.switchPagesAfterTransition.bind(this.props.app)})
                    .from(movie_title, 1, {delay: -1.5, opacity: '0'});
                break;
            case TransitionStore.MOVIE_PAGE_LEFT:
                var logo = $("#Movie" + this.props.movieId + " .project-main-image")[0];

                tl.from(logo, 1, {delay:-0.5, x: '-100%', onComplete: this.props.app.switchPagesAfterTransition.bind(this.props.app)})
                    .from(movie_title, 1, {delay: -1.5, opacity: '0'});
                break;
        }
    }

    componentWillMount() {
        this.setState({small_description: <SmallDescription projectName="This is test project" />});
    }

    prevMovieClick(event) {
        event.preventDefault();

        var movie_id = "#Movie" + this.props.movieId;

        var $this = $(movie_id)[0];

        $this.style['z-index'] = 0;

        var cover = document.createElement('div');
        cover.classList.add('movie-curtain');
        cover.style['left'] = 0;

        var movie_title = $(movie_id + ' .project-title h1')[0];
        console.log(movie_title);

        var logo = $(movie_id + ' .project-main-image')[0];

        logo.appendChild(cover);

        var tl = new TimelineLite();

        tl.to(cover, 1, {width: "100%", onComplete: ()=>{
            $this.style["display"] = "none";
        }})
            .to(movie_title, 0.4, {delay: -1, x: "-200%"});

        TransitionStore.makeTransition(
            TransitionStore.MOVIE_PAGE_LEFT,
            TransitionStore.MOVIE_PAGE_LEFT,
            tl,
            {to_movie_id: 1}
        );

        return false;
    }

    nextMovieClick(event) {
        event.preventDefault();

        var movie_id = "#Movie" + this.props.movieId;

        var $this = $(movie_id)[0];

        $this.style['z-index'] = 0;

        var cover = document.createElement('div');
        cover.classList.add('movie-curtain');
        cover.style['right'] = 0;

        var movie_title = $(movie_id + ' .project-title h1')[0];
        console.log(movie_title);

        var logo = $(movie_id + ' .project-main-image')[0];

        logo.appendChild(cover);

        var tl = new TimelineLite();

        tl.to(cover, 1, {width: "100%", onComplete: ()=>{
            //$this.style["display"] = "none";
            /*logo.removeChild(cover);
            TweenLite.set(movie_title, {x: 0});*/
        }})
            .to(movie_title, 0.4, {delay: -1, x: "-200%"});

        TransitionStore.makeTransition(
            TransitionStore.MOVIE_PAGE_RIGHT,
            TransitionStore.MOVIE_PAGE_RIGHT,
            tl,
            {to_movie_id: 2}
        );

        return false;
    }

    render() {
        var window_scroll = document.body.scrollTop;

        var small_description = null;
        var full_description = null;

        var project_name = this.props.projectName;
        console.log(this.props);

        var next_click = this.props.onNextMovieClick;
        var prev_click = this.props.onPrevMovieClick;

        var id = "Movie" + this.props.movieId;

        return (
            <div id={id} class="content">

                <section class="project-title">
                    <div class="project-main-image">
                        <div className="movie-curtain"></div>
                    </div>

                    <div class="default-side-padding movie-title-section">
                        <h1 dangerouslySetInnerHTML={{__html: project_name}}></h1>
                        <div class="movies-nav">
                            <a href="http://ya.ru" onClick={this.prevMovieClick.bind(this)} class="arrow right">⟵</a>
                            <a href="http://ya.ru" onClick={this.nextMovieClick.bind(this)} class="arrow left">⟶</a>
                        </div>
                    </div>
                </section>

                { small_description }

                { full_description }

                <footer class="default-side-padding project-footer">
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                </footer>

            </div>
            );
    }
}