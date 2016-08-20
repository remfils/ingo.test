import React from 'react';
import ScrollMagic from 'scrollmagic';
import 'imports?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';

var $ = require('jquery');

import AlphaBox from "./components/AlphaBox";
import SlidingTableRow from "./components/SlidingTableRow";
import MovieImageRotator from "./MoviePage/MovieImageRotator";
import MovieFieldsTable from "./MoviePage/MovieFieldsTable";
import FooterInfoBlock from "./MoviePage/FooterInfoBlock";
import EmailForm from "./MoviePage/EmailForm";

import TransitionStore from '../stores/TransitionStore';
import SmallDescription from './MoviePage/SmallDescription';
import FullDescription from './MoviePage/FullDescription';
import Description from './MoviePage/Description';
import PreviewFrame from './MoviePage/PreviewFrame';
import * as TransitionActions from "../actions/TransitionActions";
import { asset } from '../funcitons';
import config from '../config';
/*import MovieModel from '../models/MovieModel';*/
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
            description: null,
            movement_direction: "left"
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

        if (!transition) {
            return;
        }

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

            this.current_movie_index = this.props.current_movie_index;

            this.loadDataForCurrentMovie();
        }
        else {
            console.debug("DEBUG(MoviePage.componentWillMount): init load");

            $.ajax({
                url: config.SITE_NAME + 'api/all-movies',
                dataType: 'json',
                success: (data) => {
                    var movie_id = this.props.current_movie_index;

                    this.short_models = data.map((item, index) => {
                        var movie = new ShortProjectModel();
                        movie.parseJsonData(item);

                        if ( movie.id == movie_id ) {
                            this.current_movie_index = index;
                        }

                        return movie;
                    });

                    console.debug("DEBUG(MoviePage.componentWillMount): recived", this.short_models);

                    this.init();

                    this.loadDataForCurrentMovie();

                    TweenLite.set($("#MoviePage"), {opacity: 0});

                    if (this.props.onAjaxLoaded)
                        this.props.onAjaxLoaded(() => {
                            TweenLite.to($("#MoviePage"), 1, {opacity: 1});
                        });
                }
            });
        }
    }

    loadDataForCurrentMovie() {
        this.setState({current_movie: null});

        var movie = this.short_models[this.current_movie_index];

        console.debug("DEBUG(MoviePage.loadDataForCurrentMovie): loading movie ", movie);

        $.ajax({
            url: config.SITE_NAME + 'api/movie/' + movie.id,
            dataType: 'json',
            success: (data) => {
                var prj = new ProjectModel()
                prj.parseJsonData(data);

                console.debug("DEBUG(MoviePage.loadDataForCurrentMovie): prj, data", prj, data);

                this.setState({
                    current_movie: prj
                });
            }
        });
    }

    componentWillUnmount() {
        $(window).off('resize', this.resizePreviewIframe);
    }

    componentDidMount() {
        this.hadleTransitionAnimations();

        this.init();
    }

    init() {
        var movie = this.Model;

        if (!movie)
            return;

        TweenLite.set('.movie-title-section', {backgroundColor: movie.color });
        TweenLite.set('.project-sm-dsc', {backgroundColor: movie.color });

        this.setScrollmagicScene(null, true);
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

    prevMovieClick(event) {
        event.preventDefault();

        if ( this.isTransitionLocked() || (this.current_movie_index - 1 < 0) ) {
            return false;
        }

        this.setState({movement_direction: "left"});

        this.current_movie_index--;

        this.transitionToNextMovie(true);

        return false;
    }

    nextMovieClick(event) {
        event.preventDefault()

        if ( this.isTransitionLocked() || (this.current_movie_index + 1 >= this.short_models.length) ) {
            return false;
        }

        this.setState({movement_direction: "right"});

        this.current_movie_index++;

        this.transitionToNextMovie(false);

        return false;
    }

    isTransitionLocked() {
        return this.is_transition
            || !this.is_movie_loaded;
    }

    transitionToNextMovie( is_left, callback ) {
        this.loadDataForCurrentMovie();

        window.history.pushState({}, '', '/movie/' + this.short_models[this.current_movie_index].id);
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

    componentDidUpdate() {
        this.setScrollmagicScene(null, true);
    }

    setScrollmagicScene(bg_color, isForced) {
        if ( !bg_color ) {
            bg_color = this.Model.color;
        }

        if ( isForced || !this.scroll_magic_scene ) {
            if (this.scroll_magic_scene) {
                this.scroll_magic_scene.destroy();
            }

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

        console.debug("RENDER(MoviePage): movie, direction", movie, this.state.movement_direction);

        if ( !movie ) {
            return <div></div>;
        }

        var movement_direction = this.state.movement_direction;

        var is_model_full = movie instanceof ProjectModel;

        var movie_name, movie_year;

        if (is_model_full) {
            movie_name = movie.name;
            movie_year = movie.year;
        }
        
        var current_logo_style = {backgroundImage: "url(" + movie.logo + ")"};

        if ( movie.project_info_table ) {
            console.log("RENDER(MoviePage): movie.project_info_table", movie.project_info_table);
            movie_table = movie.project_info_table.map((item) => {
                return <SlidingTableRow field_key={item['field_name']} field_val={item.field_value} />;
            });

            console.log("RENDER(MoviePage): movie_table", movie_table);
        }

        return (
            <div id="MoviePage" class="content">

                <div className="fixed-menu-row">
                    <a href="#" class="home-button">HOME</a>
                </div>

                <section class="project-title-section">
                    <div class="movie-curtain"></div>

                    <MovieImageRotator image_url={movie.logo} movie={movie} direction={movement_direction} />

                    <div class="default-side-padding movie-title-section">
                        <table class="movie-navigation">
                            <tr>
                                <td>
                                    <AlphaBox>
                                        <h1 class="project-title">{ movie_name } <span class="project-year">{ movie_year }</span></h1>
                                    </AlphaBox>
                                </td>
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
                    <MovieFieldsTable movie={movie} class="col-30p project-stats" />

                    <div class="col-70p project-demo-video">
                        <PreviewFrame url={movie.preview_url} class="preview-frame" />
                        <div class="btn-mehr-container">
                            <a class="btn-mehr pull-left">MEHR ERFAHREN</a>
                            <a href="#" className="btn-mehr pull-left">PROJEKTGALERIE</a>
                            <a href="#" className="btn-mehr pull-right">NÄCHSTES PROJEKT</a>
                        </div>
                    </div>
                </section>

                <Description movie={movie} />

                <footer class="default-side-padding project-footer">
                    <table>
                        <tr>
                            <td class="footer_info_cell">
                                <FooterInfoBlock class="footer-info"/>
                            </td>
                            <td class="footer_mail_cell">
                                <EmailForm class="footer-form"/>
                            </td>
                        </tr>
                    </table>
                </footer>

            </div>
            );
    }
}