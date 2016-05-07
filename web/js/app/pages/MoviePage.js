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

        this.SWITCH_DURATION = 1.2;
        this.SWITCH_EASE = Expo.easeOut;
        this.SWITCH_A_DELAY = -this.SWITCH_DURATION * 2.8 / 3;
        this.SWITCH_B_DELAY = -this.SWITCH_DURATION * 2.3 / 3;

        this.state = {
            current_movie: null,
            description: null
        }
    }

    componentWillMount() {
        $.ajax({
            url: config.SITE_NAME + 'api/all-movies',
            dataType: 'json',
            success: (data) => {
                data.forEach((item) => {
                    item.logo = asset(item.logo);
                });

                this.movies = data.map((item)=>{
                    return new Movie(item);
                });

                console.log(this.movies);

                this.loadMovieFromAPI(this.movies[0]);
            },
            error: (err) => {
                console.log('error ' + err);
            }
        });
    }

    loadMovieFromAPI ( movie ) {
        movie.getMoreData(() => {
            this.setState({current_movie: movie});
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



        return false;
    }

    nextMovieClick(event) {
        event.preventDefault();

        this.leaveToNextMovie();

        return false;
    }

    leaveToNextMovie() {
        TweenLite.to('.project-title', 1, {opacity: 0});

        var tl = new TimelineLite();
        $('.project-stats tr').each((i, item) => {
            var interval = 0.7 / 4;
            tl.to(item, interval, {delay: interval * (i-1), opacity: 0});
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
        var movie_table;

        if ( movie ) {
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
                    <div className="movie-curtain"></div>
                    <div class="project-main-image"></div>

                    <div class="default-side-padding movie-title-section">
                        <h1 class="project-title">{ movie.name } <span class="project-year">{ movie.year }</span></h1>
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