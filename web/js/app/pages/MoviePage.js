import React from 'react';
var $ = require('jquery');

import TransitionStore from '../stores/TransitionStore';
import SmallDescription from './MoviePage/SmallDescription';
import FullDescription from './MoviePage/FullDescription';
import Description from './MoviePage/Description';
import * as TransitionActions from "../actions/TransitionActions";
import config from '../config';

export default class MoviePage extends React.Component {
    constructor() {
        super();

        this.SWITCH_DURATION = 1.2;
        this.SWITCH_EASE = Expo.easeOut;
        this.SWITCH_A_DELAY = -this.SWITCH_DURATION * 2.8 / 3;
        this.SWITCH_B_DELAY = -this.SWITCH_DURATION * 2.3 / 3;

        this.state = {
            small_description: null,
            full_description: null,
            description: null
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        var tl = this.props.transition.shared_timeline;

        var movie_id = "#Movie" + this.props.movie.id;

        var cover = $(movie_id + " .movie-curtain")[0];
        cover.style['background-color'] = this.props.movie.color;

        var logo = $( movie_id + ' .project-main-image')[0];
        logo.style['background'] = 'url(' + this.props.movie.logo + ')';

        var movie_title = $(movie_id + ' .project-title h1')[0];

        var $this = $(movie_id)[0];

        var img = new Image();
        img.src = this.props.logo;

        switch ( this.props.transition.type ) {
            case "INDEX-MOVIE":
                if ( config.DEBUG ) {
                    this.props.app.switchPagesAfterTransition();
                    this.setState({description: <Description movie={this.props.movie}/>});
                    TweenLite.to(movie_id + ' .movie-title-section', 0, { backgroundColor: this.props.movie.color });
                    return;
                }
                TweenLite.set($this, {top: '100%'});

                var time_line = new TimelineLite();

                this.props.transition.prev_page.leaveToMovies(time_line);
                TweenLite.set(movie_id + ' .movie-title-section', { backgroundColor: this.props.movie.color });

                time_line.to($this, 1, {delay:-0.5, top: '0', onComplete: () => {
                    this.props.app.switchPagesAfterTransition();
                    this.setState({description: <Description movie={this.props.movie}/>});
                }});
                break;
            case "MOVIE-MOVIE_RIGHT":
                var time_line = new TimelineLite();

                var logo = $("#Movie" + this.props.movie.id + " .project-main-image")[0];
                var cover = $("#Movie" + this.props.movie.id + " .movie-curtain")[0];
                cover.classList.add('right');
                logo.style['z-index'] = 100;

                this.props.transition.prev_page.leaveToMovie(time_line, true);

                TweenLite.from(movie_title, 1, {delay: 0.1, opacity: '0'});

                TweenLite.set(movie_id + ' .movie-title-section', {
                    backgroundColor: this.props.transition.prev_page.props.movie.color
                });

                TweenLite.to(movie_id + ' .movie-title-section', 1, { backgroundColor: this.props.movie.color });

                // TweenLite.to(movie_id + ' .movie-title-section', 0.5, { delay: 0.5, backgroundColor: this.props.movie.color });

                time_line.to(cover, this.SWITCH_DURATION, { delay: this.SWITCH_A_DELAY, width: "100%", ease: this.SWITCH_EASE})
                    .to('.movie-title-section', 1, { delay: -this.SWITCH_DURATION, backgroundColor: this.props.movie.color })
                    .from(logo, this.SWITCH_DURATION, { delay: this.SWITCH_B_DELAY , x: '100%', ease: this.SWITCH_EASE, onComplete: () => {
                        console.log("dscription is set");
                        this.setState({description: <Description movie={this.props.movie} />});
                        cover.classList.remove('right');
                        cover.style['width'] = 0;
                        this.props.transition.callback();
                    }});
                break;
            case "MOVIE-MOVIE_LEFT":
                var time_line = new TimelineLite();

                var logo = $("#Movie" + this.props.movie.id + " .project-main-image")[0];
                var cover = $("#Movie" + this.props.movie.id + " .movie-curtain")[0];
                cover.classList.add('left');
                logo.style['z-index'] = 100;

                this.props.transition.prev_page.leaveToMovie(time_line, false);

                TweenLite.from(movie_title, 1, {delay: 0.1, opacity: '0'});
                TweenLite.set(movie_id + ' .movie-title-section', {
                    backgroundColor: this.props.transition.prev_page.props.movie.color
                });
                TweenLite.to(movie_id + ' .movie-title-section', 0.5, { delay: 0.5, backgroundColor: this.props.movie.color });

                time_line.to(cover, this.SWITCH_DURATION, { delay: this.SWITCH_A_DELAY, width: "100%", ease: this.SWITCH_EASE})
                    .from(logo, this.SWITCH_DURATION, { delay: this.SWITCH_B_DELAY , x: '-100%', ease: this.SWITCH_EASE, onComplete: () => {
                        this.setState({description: <Description movie={this.props.movie}/>});
                        cover.classList.remove('left');
                        cover.style['width'] = 0;
                        this.props.transition.callback();
                    }});
                break;
        }
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

        TransitionActions.fromMovieToMovie(false, this,  {
            next_movie,
            callback: ()=>{
                TweenLite.set(movie_title, {x: 0});
                cover.style['width'] = 0;
                this.props.app.switchPagesAfterTransition();
            }});

        /*TransitionActions.fromMovieToMovie(false, tl,  {
            next_movie,
            callback: ()=>{
                TweenLite.set(movie_title, {x: 0});
                cover.style['width'] = 0;
                this.props.app.switchPagesAfterTransition();
            }});*/

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

        var movie_title = $(movie_id + ' .project-title h1')[0];

        var logo = $(movie_id + ' .project-main-image')[0];
        logo.style['z-index'] = 0;

        var tl = new TimelineLite();

        TransitionActions.fromMovieToMovie(true, this,  {
            next_movie,
            callback: ()=>{
                TweenLite.set(movie_title, {x: 0});
                cover.style['width'] = 0;
                this.props.app.switchPagesAfterTransition();
            }});

        return false;
    }

    leaveToMovie(time_line, is_right) {
        var m_id = this.props.movie.id,
            movie_id = "#Movie" + m_id,
            movie_title = $(movie_id + ' .project-title h1')[0],
            cover = $(movie_id + " .movie-curtain")[0];

        cover.classList.add( is_right ? 'right' : 'left');

        TweenLite.to(movie_title, 0.4, {x: "-200%"});

        TweenLite.to(movie_id + ' .movie-title-section', 0.5, { backgroundColor: "rgba(255,255,255,0)" });

        time_line
            .to(cover, this.SWITCH_DURATION * 1.2, {width: "100%", ease: this.SWITCH_EASE});

        return time_line;
    }

    render() {
        var window_scroll = document.body.scrollTop;

        var small_description = this.state.small_description || null;
        var full_description = <FullDescription movie={this.props.movie}/>;

        var description = this.state.description;

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

                { description }

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