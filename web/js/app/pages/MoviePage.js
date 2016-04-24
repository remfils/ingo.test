import React from 'react';
var $ = require('jquery');

import TransitionStore from '../stores/TransitionStore';
import SmallDescription from './MoviePage/SmallDescription';
import FullDescription from './MoviePage/FullDescription';
import * as TransitionActions from "../actions/TransitionActions";
import config from '../config';

export default class MoviePage extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        var tl = this.props.transition.shared_timeline;

        var movie_id = "#Movie" + this.props.movie.id;

        var cover = $(movie_id + " .movie-curtain")[0];
        cover.style['background-color'] = this.props.movie.color;

        var logo = $( movie_id + ' .project-main-image')[0];
        logo.style['background'] = 'url(' + this.props.movie.logo + ')';

        var movie_title = $(movie_id + ' .project-title h1')[0];

        this.state = {
            small_description: null,
            large_description: null
        };

        var $this = $(movie_id)[0];

        switch ( this.props.transition.type ) {
            case "INDEX-MOVIE":
                if ( config.DEBUG ) {
                    this.props.app.switchPagesAfterTransition();
                    return;
                }
                TweenLite.set($this, {top: '100%'});
                tl.to($this, 1, {delay:-0.5, top: '0', onComplete: this.props.app.switchPagesAfterTransition.bind(this.props.app)});
                break;
            case "MOVIE-MOVIE_RIGHT":
                var logo = $("#Movie" + this.props.movie.id + " .project-main-image")[0];
                var cover = $("#Movie" + this.props.movie.id + " .movie-curtain")[0];
                cover.style['z-index'] = 0;
                cover.style['right'] = 0;
                logo.style['z-index'] = 99;

                tl.from(movie_title, 1, {delay: -1, opacity: '0'})
                    .to(cover, 1, {delay: -0.8, width: "100%", ease: Power2.easeIn})
                    .from(logo, 1, { delay: -0.5 ,x: '100%', ease: Power2.easeInOut, onComplete: this.props.transition.callback});
                /*asdfasdf*/
                break;
            case "MOVIE-MOVIE_LEFT":
                var logo = $("#Movie" + this.props.movie.id + " .project-main-image")[0];
                var cover = $("#Movie" + this.props.movie.id + " .movie-curtain")[0];
                cover.style['z-index'] = 0;
                cover.style['left'] = 0;
                logo.style['z-index'] = 99;

                tl.from(movie_title, 1, {delay: -1, opacity: '0'})
                    .to(cover, 1, {delay: -0.5, width: "100%"})
                    .from(logo, 1, { delay: -0.5 ,x: '-100%', onComplete: this.props.transition.callback});
                break;
        }

        $('main').scroll((e)=>{
            console.log(e);
        });
    }

    componentWillMount() {
        this.setState({small_description: <SmallDescription movie={this.props.movie} />});
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollListener.bind(this));
    }

    scrollListener(e) {
        console.log(e);
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
        cover.style['width'] = 0;
        cover.style['z-index'] = 99;
        cover.style['left'] = 0;
        cover.style['right'] = 'auto';

        var movie_title = $(movie_id + ' .project-title h1')[0];

        var logo = $(movie_id + ' .project-main-image')[0];
        logo.style['z-index'] = 0;

        var tl = new TimelineLite();

        tl.to(cover, 1, {width: "100%"})
            .to(movie_title, 0.4, {delay: -1, x: "-200%"});

        TransitionActions.fromMovieToMovie(false, tl,  {
            next_movie,
            callback: ()=>{
                TweenLite.set(movie_title, {x: 0});
                cover.style['width'] = 0;
                this.props.app.switchPagesAfterTransition();
            }});

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
        cover.style['width'] = 0;
        cover.style['z-index'] = 99;
        cover.style['right'] = 0;
        cover.style['left'] = 'auto';

        var movie_title = $(movie_id + ' .project-title h1')[0];

        var logo = $(movie_id + ' .project-main-image')[0];
        logo.style['z-index'] = 0;

        var tl = new TimelineLite();

        tl.to(movie_title, 0.4, { x: "-200%"})
            .to(cover, 1, {delay: -0.3, width: "100%", ease: Power2.easeIn});
/*asdfasdf*/
        TransitionActions.fromMovieToMovie(true, tl,  {
            next_movie,
            callback: ()=>{
                TweenLite.set(movie_title, {x: 0});
                cover.style['width'] = 0;
                this.props.app.switchPagesAfterTransition();
            }});

        return false;
    }

    render() {
        var window_scroll = document.body.scrollTop;

        var small_description = this.state.small_description || null;
        var full_description = <FullDescription movie={this.props.movie}/>;

        var project_name = this.props.movie.name;
        var project_year = this.props.movie.year;
        console.log(this.props);

        var id = "Movie" + this.props.movie.id;

        return (
            <div id={id} class="content">

                <section class="project-title">
                    <div className="movie-curtain"></div>
                    <div class="project-main-image"></div>

                    <div class="default-side-padding movie-title-section">
                        <h1>{ project_name } <span class="project-year">{project_year}</span></h1>
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