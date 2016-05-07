import React from 'react';
var $ = require('jquery');

import TransitionStore from '../stores/TransitionStore';
import SmallDescription from './MoviePage/SmallDescription';
import FullDescription from './MoviePage/FullDescription';
import Description from './MoviePage/Description';
import * as TransitionActions from "../actions/TransitionActions";
import { asset } from '../funcitons';
import config from '../config';

export default class MoviePage extends React.Component {
    constructor() {
        super();

        this.is_transition = false;
        this.is_movie_loaded = true;
        this.current_movie_index = 0;
        this.next_movie = null;

        this.SWITCH_DURATION = 1.2;
        this.SWITCH_EASE = Expo.easeOut;
        this.SWITCH_A_DELAY = -this.SWITCH_DURATION * 2.8 / 3;
        this.SWITCH_B_DELAY = -this.SWITCH_DURATION * 2.3 / 3;

        this.state = {
            project_name: "",
            project_year: "",
            current_movie: null,
            description: null
        }
    }

    componentWillMount() {
        $.ajax({
            url: config.SITE_NAME + 'api/all-movies',
            dataType: 'json',
            success: (data) => {
                this.movies = data.map((item) => {
                    var movie = new Movie(item);
                    movie.logo = asset(movie.logo);
                    return movie;
                });

                console.log(this.movies);
                var movie = this.movies[this.current_movie_index];
                TweenLite.set('.movie-title-section', {backgroundColor: movie.color });
                TweenLite.set('.project-sm-dsc', {backgroundColor: movie.color });

                this.loadMovieFromAPI(movie);
            },
            error: (err) => {
                console.log('error ' + err);
            }
        });
    }

    loadMovieFromAPI ( movie, callback ) {
        this.is_movie_loaded = false;

        this.setState({project_name: movie.name, project_year: movie.year});

        movie.getMoreData(() => {
            this.is_movie_loaded = true;

            if ( !this.is_transition ) {
                this.setState({current_movie: movie});
                this.showMovieParts();
            }

            if ( callback ) {
                callback();
            }
        });
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollListener.bind(this));
    }

    scrollListener(e) {
        console.log(e);
    }

    prevMovieClick(event) {
        event.preventDefault();

        var current_movie = this.movies[this.current_movie_index];

        this.current_movie_index--;
        var next_movie = this.next_movie = this.movies[this.current_movie_index];

        $('.movie-curtain').addClass('left');
        $('.next-image').addClass('left');

        $('.current-image').css('z-index', 1);
        $('#cover1').css('background', current_movie.color);
        $('#cover2').css('background', next_movie.color);
        $('.next-image').css({
            "background-image": "url(" + next_movie.logo + ")",
            "z-index": 10});

        this.transitionToNextMovie(true);

        return false;
    }

    nextMovieClick(event) {
        event.preventDefault();

        var current_movie = this.movies[this.current_movie_index];

        this.current_movie_index++;
        var next_movie = this.next_movie = this.movies[this.current_movie_index];

        $('.movie-curtain').addClass('right');

        $('.current-image').css('z-index', 1);
        $('#cover1').css('background', current_movie.color);
        $('#cover2').css('background', next_movie.color);
        $('.next-image').css({
            "background-image": "url(" + next_movie.logo + ")",
            "z-index": 10});

        this.transitionToNextMovie(false);

        return false;
    }

    transitionToNextMovie( is_left, callback ) {
        this.is_transition = true;

        var title_tl = new TimelineLite();
        title_tl.to('.project-title', 0.5, {
            opacity: 0,
            onComplete: () => {
                this.loadMovieFromAPI(this.movies[this.current_movie_index]);
            }
        });
        title_tl.to('.project-title', 0.5, {
            opacity: 1,
            onComplete: () => {
                this.is_transition = false;
                if ( this.is_movie_loaded ) {
                    this.setState({current_movie: this.next_movie});
                    this.showMovieParts();
                }
            }
        });

        TweenLite.to('.movie-title-section', 1, {backgroundColor: this.next_movie.color });
        TweenLite.to('.project-sm-dsc', 1, {backgroundColor: this.next_movie.color });

        var tl = new TimelineLite();
        tl.to('#cover1', 0.4, {width: "100%"})
            .to("#cover2", 0.4, {width: "100%"})
            .from(".next-image", 0.4, {
                x: (is_left ? "-" : "") + "100%",
                onComplete: () => {
                    $('.movie-curtain').removeClass('left')
                        .removeClass('right');

                    var $next_image = $('.next-image');
                    var $current_image = $('.current-image');

                    $next_image.removeClass('left')
                        .removeClass('right');

                    var bgi = $next_image.css('background-image');
                    $next_image.css('background-image', $current_image.css('background-image'));
                    $current_image.css('background-image', bgi);

                    $current_image.css('z-index', 10);
                    $next_image.css('z-index', 1);
                }
            })
            .set('#cover1', {width: "0"})
            .set('#cover2', {width: "0"});

        var tl = new TimelineLite();
        $($('.project-stats tr').get().reverse()).each((i, item) => {
            var interval = 0.7 / 4;
            tl.to(item, interval, { delay: - interval / 5, opacity: 0, x: "-100%", ease: Power3.easeIn});
        });
        tl.to(window, 0, {onComplete: () => {
            TweenLite.set('.project-stats tr', {x: "+=100%"});
        }});
    }

    showMovieParts() {
        var tl = new TimelineLite();
        $('.project-stats tr').each((i, item) => {
            var interval = 0.7 / 4;
            TweenLite.set(item, {opacity: 1});
            tl.from(item, interval, { delay: - interval / 5, opacity: 0, x: "100%", ease: Power3.easeOut });
        });
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
        var movie = this.state.current_movie;
        var current_logo_style = {backgroundImage: ''};
        var movie_table;

        if ( movie ) {
            current_logo_style.backgroundImage = "url(" + movie.logo + ")";

            movie_table = movie.project_info_table.map((item) => {
                return <tr>
                    <td>{ item.field_name }:</td>
                    <td>{ item.field_value }</td>
                </tr>;
            });
        }
        else {
            movie = new Movie({id: '',name:'',year:"",logo:""});
        }

        var id = "Movie" + 0;

        return (
            <div id={id} class="content">

                <section class="project-title-section">
                    <div class="movie-curtain"></div>
                    <div class="project-main-image">
                        <div class="current-image" style={current_logo_style}></div>
                        <div id="cover1" class="movie-curtain"></div>
                        <div id="cover2" class="movie-curtain"></div>
                        <div class="next-image"></div>
                    </div>

                    <div class="default-side-padding movie-title-section">
                        <h1 class="project-title">{this.state.project_name}<span class="project-year">{ this.state.project_year }</span></h1>
                        <div class="movies-nav">
                            <a href="http://ya.ru" onClick={this.prevMovieClick.bind(this)} class="arrow right">⟵</a>
                            <a href="http://ya.ru" onClick={this.nextMovieClick.bind(this)} class="arrow left">⟶</a>
                        </div>
                    </div>
                </section>

                <section class="default-side-padding project-sm-dsc">
                    <table class="col-30p project-stats">
                        <tr>
                            <th>Project:</th>
                            <th>{ movie.name }</th>
                        </tr>

                        {movie_table}

                    </table>

                    <div class="col-70p project-demo-video">
                        <iframe height="60%" src="https://player.vimeo.com/video/67123140?color=ffffff" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                        <div class="btn-mehr-container">
                            <a class="btn-mehr">MEHR ERFAHREN</a>
                        </div>
                    </div>
                </section>



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

class Movie {

    constructor(movie_data) {
        this.id = movie_data.id;
        this.name = movie_data.name;
        this.year = movie_data.year;
        this.logo = movie_data.logo;
        this.color = movie_data.color;
    }

    getMoreData(callback) {
        $.ajax({
            url: config.SITE_NAME + 'api/movie/' + this.id,
            dataType: 'json',
            success: (data) => {
                this.project_info_table = data.table;
                this.preview_url = data.preview_url;
                this.description = data.description;
                this.comments = data.comments;

                if ( callback ) {
                    callback();
                }
            },
            error: (err) => {
                console.log('error ' + err);
            }
        });
    }
}