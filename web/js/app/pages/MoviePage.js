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
import { asset, notReadyYet, changeUrl } from '../funcitons';
import config from '../config';
/*import MovieModel from '../models/MovieModel';*/
import ShortProjectModel from '../models/ShortProjectModel';
import ProjectModel from '../models/ProjectModel';

export default class MoviePage extends React.Component {
    static CMD_SHOW_TEXT = "SHOW_TEXT";
    static CMD_SHOW_MOVIE = "SHOW_MOVIE";

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
            movement_direction: "left",
            prev_full_movie: null
        }

        this.backClickListener = this.backClickListener.bind(this);
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

        if ( !transition ) {
            this.introAnimation();
            return;
        }

        $("#MoviePage").css({"z-index": 99});

        var callback = transition.callback;

        var tl = new TimelineLite();
        tl.add('clear-stage', 0)
            .add('leave-stage', 0.5)
            .add('enter-stage', 1.5);

        switch ( transition.type ) {
            case "INDEX-MOVIE":
                transition.prev_page.leaveToMoviePage(tl);
                this.enterFromIndexPage(tl);
                break;
            case "WORKS-MOVIE":
                transition.prev_page.leaveToWorks(tl);
                this.enterFromIndexPage(tl);
                break;
        }

        tl.to(window,0,{onComplete:()=>{
            if (callback)
                callback();
        }})
    }

    introAnimation(callback) {
        TweenLite.from($("#MoviePage"), 1, {opacity: 0, delay: 1, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    enterFromIndexPage(tl) {
        var cmd = this.props.transition.command;

        tl.from($("#MoviePage"), 1, {y: "+=100%", clearProps: "y,opacity,transform"}, 'leave-stage')
            .from($("#MovieImageRotator"), 1, {y: "+=100%", onComplete: ()=>{
                if (cmd == MoviePage.CMD_SHOW_TEXT) {
                    this.scrollToDescription();
                }
                else if(cmd === MoviePage.CMD_SHOW_MOVIE) {
                    this.scrollToMovie();
                }
            }}, 'leave-stage+=1')
            .from($('.fixed-menu-row'), 0.5, {opacity: 0}, 'enter-stage');
    }

    leaveToIndexPage(tl) {
        var $this = $("#MoviePage");
        var $image = $("#MovieImageRotator");

        tl.to($image, 1, {y: "+=100%", ease: Power2.easeIn}, 'clear-stage');

        tl.to($this, 1, {y: "+=100%", ease: Power3.easeInOut}, 'leave-stage+=0.5');
    }

    scrollToDescription() {
        console.debug("DEBUG(scrollToDescription): ",$('#MovieDescription').offset().top);

        TweenLite.to($("html, body"), 1, {scrollTop: $('#MovieDescription').offset().top, ease: Power2.easeInOut});
    }

    scrollToMovie() {
        TweenLite.to($("html, body"), 1, {scrollTop: $('#MoviePage .project-sm-dsc').offset().top, ease: Power2.easeInOut});
    }

    componentWillMount() {
        TransitionStore.on('back_to', this.backClickListener);
        
        if ( this.props.movies ) {
            console.log("DEBUG(MoviePage.componentWillMount): ", this.props.movies);

            this.short_models = this.props.movies;

            this.current_movie_index = this.props.current_movie_index;

            this.is_movie_loaded = true;
            this.is_transition = false;

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
                        movie.page_name = index + 1;

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
        //this.setState({current_movie: null});

        var movie = this.short_models[this.current_movie_index];

        console.debug("DEBUG(MoviePage.loadDataForCurrentMovie): loading movie ", movie);

        $.ajax({
            url: config.SITE_NAME + 'api/movie/' + movie.url,
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

    backClickListener(params) {
        console.log("BACK_FROM:", params, " from: movie");

        switch (params.to_page) {
        case "INDEX":
            TransitionStore.removeListener('back_to', this.backClickListener);
            this.homeButtonClickListener(null);
            break;
        case "WORKS":
            TransitionStore.removeListener('back_to', this.backClickListener);
            TransitionActions.fromMovieToWorks(this, 1, {back: true});
            break;
        case "MOVIE":
            if (!params.route_params || params.route_params.length != 2) {
                return;
            }
            var prev_movie_url = params.route_params[1];
            var current_movie = this.Model;
            var prev_movie = this.short_models.filter((m) => {return m.url === prev_movie_url;})[0];
            var first_movie = this.short_models[0];
            var last_movie = this.short_models[this.short_models.length-1];
            console.log("BACK_FROM: ", last_movie);

            var is_right = parseInt(prev_movie.id) > parseInt(current_movie.id);

            if (current_movie.id === first_movie.id && prev_movie.id === last_movie.id)
                is_right = false;

            if (current_movie.id === last_movie.id && prev_movie.id === first_movie.id)
                is_right = true;
            
            
            if (is_right) {
                this.nextMovieClick(null, false);
            }
            else {
                this.prevMovieClick(null, false);
            }
            break;
        }
    }

    componentWillUnmount() {
        TransitionStore.removeListener('back_to', this.backClickListener);
        $(window).off('resize', this.resizePreviewIframe);
        this.scroll_magic_scene.destroy();
    }

    componentDidMount() {
        this.hadleTransitionAnimations();

        this.init();
    }

    componentWillUpdate() {
        if ( !this.isTransitionLocked() ) {
            console.log("ScrollMagic happened!");
            //this.setScrollmagicScene();
        }
    }

    componentDidUpdate() {
        this.setHomeButtonScrollMagicScene();
        //this.setScrollmagicScene(null, true);
    }

    init() {
        var movie = this.Model;

        if (!movie)
            return;

        TweenLite.set('.movie-title-section', {backgroundColor: movie.color });
        TweenLite.set('.project-sm-dsc', {backgroundColor: movie.color });

        this.setScrollmagicScene(null, true);
    }

    setHomeButtonScrollMagicScene() {
        var ctrl = new ScrollMagic.Controller();

        var $small_dsc = $('.project-sm-dsc');
        var duration = 0;
        if ($small_dsc.length != 0) {
            duration += $small_dsc.offset().top + $small_dsc.outerHeight(true) / 2;
        }
        duration +=  - $('.movie-title-section').offset().top;

        console.debug("DEBUG(setHomeButtonScrollMagicScene)", duration);

        var scene = new ScrollMagic.Scene({triggerElement: '.movie-title-section', duration: duration})
            .setClassToggle('#HomeButton', 'darker')
            .triggerHook(0.05)
            .addTo(ctrl);

        if ($('#MovieDescription').length === 0)
            return;

        var scene = new ScrollMagic.Scene({triggerElement: '#MovieDescription'})
            .setClassToggle('#HomeButton', 'darker')
            .triggerHook(0.05)
            .addTo(ctrl);
    }

    arrangeTransition( transition ) {
        var time_line = new TimelineLite();

        switch ( transition.type ) {
            case "INDEX-MOVIE":
                transition.prev_page.leaveToMovies(time_line);
                this.enterFromIndex(time_line);
                break;
            case "WORKS-MOVIE":
                transition.prev_page.leaveToDifferentTitlePage(time_line);
        }
    }

    homeButtonClickListener(e) {
        if (e)
            e.preventDefault();

        var scroll_top = $(window).scrollTop();

        if ( this.is_transition )
            return false;

        this.is_transition = true;

        console.log("homeButtonClickListener", scroll_top);

        if (scroll_top === 0) {
            TransitionActions.fromMovieToIndexTransition(this, {});
        }
        else {
            var time = scroll_top / window.innerHeight;
            TweenLite.to($('html,body'), time, {scrollTop: 0, onComplete: ()=>{
                TransitionActions.fromMovieToIndexTransition(this, {});
            }});
        }

        return false;
    }

    projectGalerieButtonClickListener(e) {
        if (e)
            e.preventDefault();

        TweenLite.to('html, body', 0.5, {scrollTop: 0, onComplete: ()=>{
            TransitionActions.fromMovieToWorks(this, this.current_movie_index);
        }})

        return false;
    }

    nachtesProjectButtonClickListener(e) {
        e.preventDefault();

        this.nextMovie();

        return false;
    }

    nextMovie(is_url_change=true) {
        if ( this.isTransitionLocked() ) {
            return false;
        }

        if (this.current_movie_index >= this.short_models.length -1) {
            this.current_movie_index = 0;
        }
        else {
            this.current_movie_index++;
        }

        this.setState({
            current_movie: null,
            movement_direction: "right",
            prev_full_movie: this.state.current_movie
        });

        this.transitionToNextMovie(false, is_url_change);
    }

    prevMovieClick(event, is_url_change=true) {
        if (event)
            event.preventDefault();

        if ( this.isTransitionLocked() ) {
            return false;
        }

        if (this.current_movie_index < 1) {
            this.current_movie_index = this.short_models.length - 1;
        }
        else {
            this.current_movie_index--;
        }

        this.setState({
            current_movie: null,
            movement_direction: "left"
        });

        this.transitionToNextMovie(true, is_url_change);

        this.updateArrowLinks();

        return false;
    }

    nextMovieClick(event, is_url_change=true) {
        if (event)
            event.preventDefault()

        this.nextMovie(is_url_change);

        this.updateArrowLinks();

        return false;
    }

    mehrButtonClickListener(e) {
        e.preventDefault();

        this.scrollToDescription();

        return false;
    }

    updateArrowLinks() {
      var $arrows = $('.cell-movies-nav > .movies-nav');
      var $next = $arrows.find('.left');
      var $prev = $arrows.find('.right');

      var prev_movie, next_movie;

      console.log('updateArrowLinks: current_index ', this.current_movie_index);

      if (this.current_movie_index == 0) {
        prev_movie = this.short_models[this.short_models.length-1];
      }
      else {
        prev_movie = this.short_models[this.current_movie_index-1];
      }

      if (this.current_movie_index == this.short_models.length - 1) {
        next_movie = this.short_models[0];
      }
      else {
        next_movie = this.short_models[this.current_movie_index+1];
      }

      $next.prop('href', next_movie.url);
      $prev.prop('href', prev_movie.url);
    }

    isTransitionLocked() {
        return this.is_transition
            || !this.is_movie_loaded;
    }

    transitionToNextMovie( is_left, is_url_change=true, callback ) {
        this.colorTransition();

        this.loadDataForCurrentMovie();

        if (is_url_change)
            changeUrl('movie/' + this.short_models[this.current_movie_index].url);
    }

    colorTransition() {
        var from_color = this.Model.color;
        var to_color = this.short_models[this.current_movie_index].color;

        var c = {color: from_color};

        TweenLite.to(c, 1, {color: to_color, onUpdate: ()=>{
            this.setScrollmagicScene(c.color);
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
        var movie_for_descripriton = movie;

        if ( !movie ) {
            return <div></div>;
        }

        var movement_direction = this.state.movement_direction;

        // var is_model_full = movie instanceof ProjectModel;

        if (!movie_for_descripriton.comments) {
            movie_for_descripriton = this.state.prev_full_movie || movie;
        }

        var movie_name, movie_year;

        if (movie.name && movie.year) {
            movie_name = movie.name;
            movie_year = movie.year;
        }

        var current_logo_style = {backgroundImage: "url(" + movie.logo + ")"};

        if ( movie.project_info_table ) {
            movie_table = movie.project_info_table.map((item, index) => {
                var field_key = 'field_' + index;
                return <SlidingTableRow key={field_key} field_key={item['field_name']} field_val={item.field_value} />;
            });
        }

        return (
            <div id="MoviePage" class="content">

                <div className="fixed-menu-row">
                    <a href="#" id="HomeButton" class="home-button" onClick={this.homeButtonClickListener.bind(this)}>HOME</a>
                </div>

                <section class="project-title-section">
                    <div class="movie-curtain"></div>

                    <MovieImageRotator id="MovieImageRotator" image_url={movie.logo} movie={movie} direction={movement_direction} />

                    <div class="default-side-padding movie-title-section">
                        <table class="movie-navigation">
                            <tbody>
                                <tr>
                                    <td>
                                        <AlphaBox>
                                            <h1 class="project-title">{ movie_name } <span class="project-year">{ movie_year }</span></h1>
                                        </AlphaBox>
                                    </td>
                                    <td class="cell-movies-nav">
                                        <div class="movies-nav">
                                            <a href="#" onClick={this.prevMovieClick.bind(this)} class="arrow right">⟵</a>
                                            <a href="#" onClick={this.nextMovieClick.bind(this)} class="arrow left">⟶</a>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="default-side-padding project-sm-dsc">
                    <MovieFieldsTable movie={movie} class="col-30p project-stats" />

                    <div class="col-70p project-demo-video clearfix">
                        <PreviewFrame url={movie.preview_url} class="preview-frame" />
                        <div class="btn-mehr-container">
                            <a class="btn-mehr pull-left" onClick={this.mehrButtonClickListener.bind(this)}>MEHR ERFAHREN</a>
                            <a href="#" className="btn-mehr pull-left" onClick={this.projectGalerieButtonClickListener.bind(this)}>PROJEKTGALERIE</a>
                            <a href="#" className="btn-mehr btn-mehr-arrows pull-right" onClick={this.nextMovieClick.bind(this)}>></a>
            <a href="#" className="btn-mehr btn-mehr-arrows pull-right" onClick={this.prevMovieClick.bind(this)}>{"<"}</a>
                        </div>
                    </div>
                </section>

                <Description id="MovieDescription" movie={movie_for_descripriton} />

                <footer class="default-side-padding project-footer">
                    <table>
                        <tbody>
                            <tr>
                                <td class="footer_info_cell">
                                    <FooterInfoBlock class="footer-info"/>
                                </td>
                                <td class="footer_mail_cell">
                                    <EmailForm class="footer-form"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </footer>

            </div>
            );
    }
}
