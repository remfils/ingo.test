import React from 'react';
var $ = require('jquery');

import TransitionStore from '../stores/TransitionStore';
import SmallDescription from './MoviePage/SmallDescription';
import FullDescription from './MoviePage/FullDescription';
import config from '../config';

export default class MoviePage extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        if ( this.isOnPage ) return;

        var tl = this.props.sharedTimeline;

        var movie_id = "#Movie" + this.props.movie.id;

        var cover = $(movie_id + " .movie-curtain")[0];
        cover.style['background-color'] = this.props.movie.color;

        var logo = $( movie_id + ' .project-main-image')[0];
        logo.style['background'] = 'url(' + this.props.logo + ')';

        var movie_title = $(movie_id + ' .project-title h1')[0];

        this.state = {
            small_description: null,
            large_description: null
        };

        var $this = $("#Movie" + this.props.movie.id)[0];

        switch ( this.props.from ) {
            case TransitionStore.INDEX_PAGE:
                if ( config.DEBUG ) {
                    this.props.app.switchPagesAfterTransition();
                    return;
                }
                TweenLite.set($this, {top: '100%'});
                tl.to($this, 1, {delay:-0.5, top: '0', onComplete: this.props.app.switchPagesAfterTransition.bind(this.props.app)});
                break;
            case TransitionStore.MOVIE_PAGE_RIGHT:
                var logo = $("#Movie" + this.props.movie.id + " .project-main-image")[0];

                tl.from(logo, 1, {delay:-1, x: '100%'})
                    .from(movie_title, 1, {delay: -1.5, opacity: '0'});
                break;
            case TransitionStore.MOVIE_PAGE_LEFT:
                var logo = $("#Movie" + this.props.movie.id + " .project-main-image")[0];

                tl.from(logo, 1, {delay:-1, x: '-100%', onComplete: this.props.app.switchPagesAfterTransition.bind(this.props.app)})
                    .from(movie_title, 1, {delay: -1.5, opacity: '0'});
                break;
        }
    }

    componentWillMount() {
        this.setState({small_description: <SmallDescription projectName="This is test project" />});
    }

    prevMovieClick(event) {
        event.preventDefault();

        var m_id = this.props.movie.id;
        var movie_id = "#Movie" + m_id;

        var movies = this.props.app.movies;
        var next_movie =  movies.filter((item) => {return item.id < m_id}).pop();
        console.log(next_movie);

        if ( !next_movie ) {
            return false;
        }
        var $this = $(movie_id)[0];

        $this.style['z-index'] = 0;

        var cover = $(movie_id + " .movie-curtain")[0];
        //cover.style['z-index'] = 99;
        cover.style['left'] = 0;

        var movie_title = $(movie_id + ' .project-title h1')[0];

        var logo = $(movie_id + ' .project-main-image')[0];

        var tl = new TimelineLite();

        tl.to(cover, 1, {width: "100%", onComplete: ()=>{
            TweenLite.set(movie_title, {x: 0});
            cover.style['width'] = 0;
        }})
            .to(movie_title, 0.4, {delay: -1, x: "-200%"})
            .to(cover, 1, {});

        TransitionStore.makeTransition(
            TransitionStore.MOVIE_PAGE_LEFT,
            TransitionStore.MOVIE_PAGE_LEFT,
            tl,
            {next_movie: next_movie}
        );

        return false;
    }

    nextMovieClick(event) {
        event.preventDefault();

        var m_id = this.props.movie.id;
        var movie_id = "#Movie" + m_id;

        var movies = this.props.app.movies;
        var next_movie =  movies.filter((item) => {return item.id > m_id})[0];
        console.log(next_movie);

        if ( !next_movie ) {
            return false;
        }

        var $this = $(movie_id)[0];

        $this.style['z-index'] = 0;

        var cover = $(movie_id + " .movie-curtain")[0];
        cover.style['z-index'] = 99;
        cover.style['right'] = 0;

        var movie_title = $(movie_id + ' .project-title h1')[0];

        var logo = $(movie_id + ' .project-main-image')[0];

        var tl = new TimelineLite();

        tl.to(cover, 1, {width: "100%"})
            .to(movie_title, 0.4, {delay: -1, x: "-200%"});

        TransitionStore.makeTransition(
            TransitionStore.MOVIE_PAGE_RIGHT,
            TransitionStore.MOVIE_PAGE_RIGHT,
            tl,
            {
                next_movie: next_movie,
                callback: ()=>{
                    TweenLite.set(movie_title, {x: 0});
                    cover.style['width'] = 0;
                    this.props.app.switchPagesAfterTransition();
                }
            }
        );

        return false;
    }

    render() {
        var window_scroll = document.body.scrollTop;

        var small_description = null;
        var full_description = null;

        var project_name = this.props.movie.name;
        console.log(this.props);

        var next_click = this.props.onNextMovieClick;
        var prev_click = this.props.onPrevMovieClick;

        var id = "Movie" + this.props.movie.id;

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