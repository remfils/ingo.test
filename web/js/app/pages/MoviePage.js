import React from 'react';
import ScrollMagic from 'scrollmagic';
import 'imports?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
var $ = require('jquery');

import TransitionStore from '../stores/TransitionStore';
import SmallDescription from './MoviePage/SmallDescription';
import FullDescription from './MoviePage/FullDescription';
import Description from './MoviePage/Description';
import * as TransitionActions from "../actions/TransitionActions";
import { asset } from '../funcitons';
import config from '../config';
import MovieModel from '../models/MovieModel';
import ShortProjectModel from '../models/ShortProjectModel';
import ProjectModel from '../models/ProjectModel';

export default class MoviePage extends React.Component {
    constructor() {
        super();

        this.previewWindow = null;
        this.scroll_magic_scene = null;

        this.is_transition = false;
        this.is_movie_loaded = true;
        this.current_movie_index = 0;
        this.next_movie = null;

        this.short_models = [];

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

    get Model () {
        if (this.short_models.length === 0) {
            return null;
        }

        if (this.state.current_movie) {
            return this.state.current_movie;
        }

        return this.short_models[this.current_movie_index];
    }

    hadleTransitionAnimations() {
        var transition = this.props.transition;

        $("#MoviePage").css({"z-index": 99});
        
        transition.prev_page.leaveToMoviePage();

        switch ( transition.type ) {
            case "INDEX-MOVIE":
                this.enterFromIndexPage();
                break;
        }
    }

    enterFromIndexPage() {
        TweenLite.from($("#MoviePage"), 1, {y: "+=100%"});
    }

    componentWillMount() {
        if ( this.props.movies ) {
            console.log("DEBUG(MoviePage.componentWillMount): ", this.props.movies);

            this.short_models = this.props.movies;

            this.movies = this.props.movies;
            this.current_movie_index = this.props.current_movie_index;

            $.ajax({
                url: config.SITE_NAME + 'api/movie/' + this.Model.id,
                dataType: 'json',
                success: (data) => {
                    var prj = new ProjectModel()
                    prj.parseJsonData(data);

                    console.log("DEBUG(MoviePage.componentWillCnageState): ", prj);

                    this.setState({
                        current_movie: prj
                    });
                }
            })
        }
        else {
            $.ajax({
                url: config.SITE_NAME + 'api/all-movies',
                dataType: 'json',
                success: (data) => {
                    this.movies = data.map((item) => {
                        var movie = new MovieModel(item);
                        movie.logo = asset(movie.logo);
                        return movie;
                    });

                    var movie = this.movies[this.current_movie_index];
                    TweenLite.set('.movie-title-section', {backgroundColor: movie.color });
                    TweenLite.set('.project-sm-dsc', {backgroundColor: movie.color });

                    if ( this.props.transition ) {
                        this.arrangeTransition(this.props.transition);
                    }

                    this.loadMovieFromAPI(movie);
                },
                error: (err) => {
                    console.log('error ' + err);
                }
            });
        }
    }

    loadMovieFromAPI ( movie, callback ) {
        this.is_movie_loaded = false;

        this.setState({project_name: movie.name, project_year: movie.year});

        movie.getMoreData(() => {
            this.is_movie_loaded = true;

            if ( !this.is_transition ) {
                this.setState({
                    current_movie: movie,
                    description: <Description movie={movie} />
                });
                this.showMovieParts();
            }

            if ( callback ) {
                callback();
            }
        });
    }

    componentWillUnmount() {
        $(window).off('resize', this.resizePreviewIframe);
    }

    componentDidMount() {
        this.hadleTransitionAnimations();

        var movie = this.movies[this.current_movie_index];
        TweenLite.set('.movie-title-section', {backgroundColor: movie.color });
        TweenLite.set('.project-sm-dsc', {backgroundColor: movie.color });

        this.preview_iframe = $('.project-demo-video > iframe')[0];

        this.resizePreviewIframe();

        this.setScrollmagicScene();

        $(window).resize(this.resizePreviewIframe.bind(this));
    }

    arrangeTransition( transition ) {
        var time_line = new TimelineLite();

        switch ( transition.type ) {
            case "INDEX-MOVIE":
                transition.prev_page.leaveToMovies(time_line);
                this.enterFromIndex(time_line);
                break;
        }
    }

    resizePreviewIframe(event) {
        if ( this.preview_iframe ) {
            this.preview_iframe.height = 609 * this.preview_iframe.clientWidth / 1092;
        }
    }

    prevMovieClick(event) {
        event.preventDefault();

        if ( this.isTransitionLocked() || (this.current_movie_index - 1 < 0) ) {
            return false;
        }

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
        event.preventDefault()

        if ( this.isTransitionLocked() || (this.current_movie_index + 1 >= this.movies.length) ) {
            return false;
        }

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

    isTransitionLocked() {
        return this.is_transition
            || !this.is_movie_loaded;
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
                    this.setState({
                        current_movie: this.next_movie,
                        description: <Description movie={this.next_movie} />
                    });
                    this.showMovieParts();
                }
            }
        });

        var col = this.movies[this.current_movie_index].color;
        var $movie_title = $('.movie-title-section');

        var color_obj = {bgc: this.state.current_movie.color};
        TweenMax.to(color_obj, 1, {bgc: this.next_movie.color, onUpdate: (co) => {
            this.setScrollmagicScene(co.bgc);
        }, onUpdateParams: [color_obj]});

        var tl = new TimelineLite();
        tl.to('#cover1', this.SWITCH_DURATION * 1.2, {width: "100%", ease: this.SWITCH_EASE})
            .to("#cover2", this.SWITCH_DURATION, {delay: this.SWITCH_A_DELAY, width: "100%", ease: this.SWITCH_EASE})
            .from(".next-image", this.SWITCH_DURATION, {
                delay: this.SWITCH_B_DELAY,
                x: (is_left ? "-" : "") + "100%",
                ease: this.SWITCH_EASE,
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

    componentWillUpdate() {
        if ( !this.isTransitionLocked() ) {
            console.log("ScrollMagic happened!");
            this.setScrollmagicScene();
        }
    }

    setScrollmagicScene(bg_color) {
        if ( !bg_color ) {
            bg_color = this.movies[this.current_movie_index].color;
        }

        if ( !this.scroll_magic_scene ) {
            var controller = new ScrollMagic.Controller();

            this.scroll_magic_scene = new ScrollMagic.Scene({
                triggerElement: ".movie-title-section",
                duration: 1000
            });

            this.scroll_magic_scene.addTo(controller);
        }

        var tween = new TweenMax.allFromTo(['.movie-title-section', '.project-sm-dsc'], 1, {backgroundColor: bg_color}, {backgroundColor: "#ffffff"});
        this.scroll_magic_scene.setTween(tween);
    }

    render() {
        var movie_table;
        var movie = this.Model;

        if ( !movie ) {
            return <div></div>;
        }

        var is_short_model = movie instanceof ShortProjectModel;

        var movie_name = movie.name;
        var movie_year = movie.year;
        
        var current_logo_style = {backgroundImage: "url(" + movie.logo + ")"};

        var description = "";

        if ( movie.project_info_table ) {
            movie_table = movie.project_info_table.map((item) => {
                return <tr>
                    <td>{ item.field_name }:</td>
                    <td>{ item.field_value }</td>
                </tr>;
            });
        }

        if ( movie.description && movie.comments ) {
            description = <Description movie={movie} />;
        }

        return (
            <div id="MoviePage" class="content">

                <section class="project-title-section">
                    <div class="movie-curtain"></div>
                    <div class="project-main-image">
                        <div class="current-image" style={current_logo_style}></div>
                        <div id="cover1" class="movie-curtain"></div>
                        <div id="cover2" class="movie-curtain"></div>
                        <div class="next-image"></div>
                    </div>

                    <div class="default-side-padding movie-title-section">
                        <table class="movie-navigation">
                            <tr>
                                <td><h1 class="project-title">{ movie_name }<span class="project-year"> { movie_year }</span></h1></td>
                                <td class="cell-movies-nav">
                                    <div class="movies-nav">
                                        <a href="http://ya.ru" onClick={this.prevMovieClick.bind(this)} class="arrow right">⟵</a>
                                        <a href="http://ya.ru" onClick={this.nextMovieClick.bind(this)} class="arrow left">⟶</a>
                                    </div>
                                </td>
                            </tr>
                        </table>
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
                        <iframe height="60%" src={movie.preview_url} frameBorder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                        <div class="btn-mehr-container">
                            <a class="btn-mehr">MEHR ERFAHREN</a>
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