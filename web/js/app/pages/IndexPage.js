import React from "react";
//import "gsap";
var $ = require('jquery');

import config from '../config';
import TransitionStore from '../stores/TransitionStore';
import * as TransitionActions from '../actions/TransitionActions';
import { asset, createNotReadyYetFunction, notReadyYet, lockScroll, unlockScroll } from "../funcitons";
import AlphaTextBox from "./components/AlphaTextBox";
import SiteMap from "./components/SiteMap";
import NavigationMenu from "./components/NavigationMenu";
import AlphaBox from "./components/AlphaBox";
import AlphaBoxDangerHtml from "./components/AlphaBoxDangerHtml";
import BracketTextBox from "./components/BracketTextBox";
import ImageRotator from "./components/ImageRotator";
import TitleColoredTable from "./IndexPage/TitleColoredTable";
import ShortProjectModel from "../models/ShortProjectModel";
import MoviePage from './MoviePage';

const MAX_SCROLL_COUNTER_VALUE = 3;

export default class IndexPage extends React.Component {
    constructor() {
        super();
        this.state = {
            current_content: null,
            isMenuDisplayed: false
        };

        this.is_scroll_message_shown = true;

        this.is_transition = false;

        this.content = [];
        this.current_content = {};
        this.current_content_index = 0;

        this.scrollListener = this.scrollListener.bind(this);

        this.scroll_timer = null;
        this.scroll_counter = 0;
    }

    get current_content_index() {
        return this._cci;
    }

    set current_content_index(val) {
        if ( val < 0 ) {
            this._cci = this.content.length - 1;
        }
        else if ( val >= this.content.length ) {
            this._cci = 0;
        }
        else {
            this._cci = val;
        }
    }

    getContent( index ) {
        var l = this.content.length;
        if ( l == 0 ) {
            return null;
        }
        if ( index < 0 ) {
            index = l + index % l;
        }
        else if ( index >= l ) {
            index = index % l;
        }
        console.log("getContent: ", l,  index);
        return this.content[index];
    }

    componentWillMount() {
        lockScroll();

        if ( this.props.movies ) {
            this.content = this.props.movies;

            this.current_content_index = this.props.current_content_index || 0;

            this.setState({
                current_content: this.content[this.current_content_index]
            });
        }
        else {
            $.ajax({
                url: config.SITE_NAME + 'api/all-movies',
                dataType: 'json',
                success: (data) => {
                    this.content = data.map((item, index) => {
                        var content = new ShortProjectModel();

                        content.parseJsonData(item);
                        content.page_name = index + 1;

                        return content;
                    });

                    console.log("DEBUG: data loaded", data, this.content);

                    this.setState({
                        current_content: this.content[this.current_content_index]
                    });

                    TweenLite.set($("#IndexPage"), {opacity: 0});

                    if (this.props.onAjaxLoaded)
                        this.props.onAjaxLoaded(() => {
                            TweenLite.to($("#IndexPage"), 1, {opacity: 1});
                        });
                },
                error: (err) => {
                    console.log('ERROR:  ' + err);
                }
            });
        }

        $(window).on('mousewheel', this.scrollListener);
    }

    componentWillUnmount() {
        unlockScroll();
        console.debug('DEBUG(IndexPage.componentWillUnmount)');
        $(window).off('mousewheel');
    }

    componentDidMount() {
        this.hadleTransitionAnimations();
    }

    hadleTransitionAnimations() {
        var tr = this.props.transition;
        if ( !tr ) {
            this.introAnimation();
            return;
        }

        var callback = tr.callback;
        var prev_page = tr.prev_page;

        var tl = new TimelineLite();
        tl.add('clear-stage', 0)
            .add('leave-stage', 0.5)
            .add('enter-stage', 1.5);

        switch ( tr.type ) {
            case "MOVIE-INDEX":
                prev_page.leaveToIndexPage(tl);
                this.enterFromMoviePage(tl);
                break;
            case "CONTACTS-INDEX":
            case "ABOUT-INDEX":
            case "WORKS-INDEX":
            case "IMPRESSUM-INDEX":
                prev_page.leaveToDifferentTitlePage(tl);
                this.enterFromDifferentTitlePage(tl);
                break;
        }

        tl.to(window,0,{onComplete:()=>{
            if (callback)
                callback();
        }})
    }

    introAnimation(callback) {
        console.debug("introAnimation");

        TweenLite.from($("#IndexPage"), 1, {opacity: 0, delay: 2, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    enterFromMoviePage(tl) {
        var $current_image = $(".index-page-image-rotator .img-front"),
            $this = $('#IndexPage');

        var $brackets = $('#IndexPage .title-page-name');
        var $title = $('#IndexPage .title-header');
        var $scroll_msg = $('#IndexPage .scroll-message');
        var $movie_dsc = $('#IndexPage .movie-short-description');

        tl.from($this, 1, {x: "-=100%"}, 'leave-stage')
            .from($current_image, 1, {x: "-=100%", ease: Power2.easeInOut}, 'leave-stage+=0.5');

        tl.from($brackets, 0.5, {opacity: 0, clearProps: "all"}, 'enter-stage')
            .from($title, 0.5, {opacity: 0, clearProps: "all"}, 'enter-stage')
            .from($scroll_msg, 0.5, {opacity: 0, clearProps: "all"}, 'enter-stage')
            .from($movie_dsc, 0.5, {opacity: 0, clearProps: "all"}, 'enter-stage');
    }


    leaveToMoviePage(tl) {
        var $prev_image = $(".index-page-image-rotator .img-back"),
            $current_image = $(".index-page-image-rotator .img-front"),
            $table = $(".title-project-dsc");

        var $brackets = $('#IndexPage .title-page-name');
        var $title = $('#IndexPage .title-header');
        var $scroll_msg = $('#IndexPage .scroll-message');
        var $movie_dsc = $('#IndexPage .movie-short-description');

        tl.to($brackets, 0.5, {opacity: 0}, 'clear-stage')
            .to($title, 0.5, {opacity: 0}, 'clear-stage')
            .to($scroll_msg, 0.5, {opacity: 0}, 'clear-stage')
            .to($movie_dsc, 0.5, {opacity: 0}, 'clear-stage');

        tl.to($current_image, 1, {x: "-=100%", ease: Power2.easeOut}, 'leave-stage')
            .to($("#IndexPage"), 1, {x: "-=100%", ease: Power2.easeInOut}, 'leave-stage+=1');

        /*TweenLite.to( , 1, {left: "-=60%"} );
        TweenLite.to( , 1, {left: "0", height: "70%"} );
        TweenLite.to( $(".title-header"), 1, {opacity: 0, onComplete: () => {
            $("#IndexPage").css("display", "none");

            if (callback)
                callback();
        }} );
        TweenLite.set($("#IndexPage"), {"z-index": 0});*/
    }

    enterFromDifferentTitlePage(tl) {
        var $this = $('#IndexPage');

        var $brackets = $('#IndexPage .title-page-name');
        var $title = $('#IndexPage .title-header')
        var $scroll_msg = $('#IndexPage .scroll-message');
        var $table = $('#IndexPage .title-project-dsc');
        var $left_image = $('#IndexPage .img-back');
        var $right_image = $('#IndexPage .img-front');
        var $movie_dsc = $('#IndexPage .movie-short-description');
        var $nav = $('#IndexPage .title-navigation');

        tl.from($left_image, 1, {y: "+=100%", ease: Power4.easeInOut}, 'leave-stage')
            .from($right_image, 1, {y: "-=100%", ease: Power4.easeInOut}, 'leave-stage');

        tl.from($title, 0.5, {opacity: 0}, 'enter-stage')
            .from($brackets, 0.5, {opacity: 0}, 'enter-stage')
            .from($scroll_msg, 0.5, {opacity: 0}, 'enter-stage')
            .from($movie_dsc, 0.5, {opacity: 0}, 'enter-stage');

        tl.set($nav, {opacity:0}, 'clear-stage');
        tl.set($nav, {opacity:1}, 'enter-stage');
    }

    leaveToDifferentTitlePage(tl) {
        var $this = $('#IndexPage');

        $this.css('z-index', 9999);

        var $brackets = $('#IndexPage .title-page-name');
        var $title = $('#IndexPage .title-header')
        var $scroll_msg = $('#IndexPage .scroll-message');
        var $table = $('#IndexPage .title-project-dsc');
        var $left_image = $('#IndexPage .img-back');
        var $right_image = $('#IndexPage .img-front');
        var $movie_dsc = $('#IndexPage .movie-short-description');
        var $color = $('#IndexPage .table-bg-color');
        var $nav = $('#IndexPage .title-navigation');

        tl.to($title, 0.5, {opacity: 0}, 'clear-stage')
            .to($brackets, 0.5, {opacity: 0}, 'clear-stage')
            .to($scroll_msg, 0.5, {opacity: 0}, 'clear-stage')
            .to($movie_dsc, 0.5, {opacity: 0}, 'clear-stage');

        tl.to($left_image, 1, {y: "+=100%", ease: Power4.easeInOut}, 'leave-stage')
            .to($right_image, 1, {y: "-=100%", ease: Power4.easeInOut}, 'leave-stage')
            .to($color, 1, {opacity: 0}, 'leave-stage');

        tl.set($nav, {opacity:0}, 'enter-stage');
    }

    getMouseScrollDirection(e) {
        var delta = 0;

        var o_e = e.originalEvent;

        if (e.type === 'DOMMouseScroll') {
            e.originalEvent.detail * -40;
        }
        else {
            console.log("SCROLL: ", o_e.wheelDelta, o_e.detail, o_e.deltaY, o_e.deltaX);
            delta = -o_e.wheelDelta || -o_e.deltaY || o_e.deltaX;
        }

        return delta > 0 ? -1 : 1;
    }

    scrollListener(e) {
        /*if ( this.is_scroll_message_shown ) {
            this.is_scroll_message_shown = false;

            var $scrl_msg = $(".scroll-message");

            TweenLite.to($scrl_msg, 1, {bottom: "-3em", opacity: 0, onComplete: () => {
                $scrl_msg.hide();
            }});
        }*/

        e.preventDefault();

        if ( this.is_transition ) {
            return;
        }

        clearTimeout(this.scroll_timer);

        var dir = this.getMouseScrollDirection(e);
        var self = this;
        this.scroll_counter += dir;
        this.scroll_timer = setTimeout(function(){
            self.scroll_counter = 0;
        }, 100);

        if(this.scroll_counter >= MAX_SCROLL_COUNTER_VALUE) {
            console.debug("SCROLL(nextMovie)");
            this.nextMovie();
        }
        else if ( this.scroll_counter <= -MAX_SCROLL_COUNTER_VALUE) {
            console.debug("SCROLL(prevMovie)");
            this.prevMovie();
        }
    }

    nextMovie() {
        this.is_transition = true;

        this.current_content_index++;

        this.setState({
            current_content: this.content[this.current_content_index],
            movement_direction: "right"
        });

        setTimeout(()=>{
            this.is_transition = false;
        }, 2000);
    }

    toggleArrowIfNessecery() {
        var $arrow = $('.img-next-arrow');

        if (this.current_content_index === this.content.length - 1) {
            if ($arrow.is(":visible")) {
                TweenLite.fromTo($arrow, 0.3, {opacity: 1}, {opacity: 0, onComplete: ()=>{
                    $arrow.hide();
                }})
            }
        }
        else {
            if (!$arrow.is(":visible")) {
                $arrow.show();
                TweenLite.fromTo($arrow, 0.3, {opacity: 0}, {opacity: 1})
            }
        }
    }

    prevMovie() {
        this.is_transition = true;

        this.current_content_index--;

        this.setState({
            current_content: this.content[this.current_content_index],
            movement_direction: "left"
        });

        setTimeout(()=>{
            this.is_transition = false;
        }, 2000);
    }

    nextArrowButtonClickListener(event) {
        event.preventDefault();

        if ( this.is_transition ) {
            return;
        }

        this.nextMovie();

        return false;
    }

    menuClickListener(event) {
        event.preventDefault();

        this.setState({
            isMenuDisplayed: true
        })

        return false;
    }

    currentMovieClickListener(event) {
        event.preventDefault();

        console.log("CLICK: ", this.current_content_index);

        var movies = [];
        this.content.forEach((item, index, array)=>{
            if ( item.content_type == "movie" ) {
                movies.push(item.model);
            }
        });

        TransitionActions.fromIndexToMovieTranstion(this, {movies: movies});
    }

    playButtonClickLister(event) {
        event.preventDefault();

        TransitionActions.fromIndexToMovieTranstion(this, {
            movies: this.content,
            command: MoviePage.CMD_SHOW_MOVIE
        });

        return false;
    }

    currentMovieTextClickListener(event) {
        event.preventDefault();

        TransitionActions.fromIndexToMovieTranstion(this, {
            movies: this.content,
            command: MoviePage.CMD_SHOW_TEXT
        });

        return false;
    }

    render() {
        console.log("RENDER(IndexPage): ");

        var self = this;

        if ( this.content.length == 0 ) {
            return <div></div>;
        }

        var content = this.getContent(this.current_content_index);
        var next_content = this.getContent(this.current_content_index + 1);
        var last_content = this.getContent(this.current_content_index + 2);
        var prev_content = this.getContent(this.current_content_index - 1);

        console.log("RENDER(IndexPage): contents", content, next_content, last_content, prev_content);

        var img_back_url = next_content.logo_short,
            img_current_url = content.logo_short,
            img_next = prev_content.logo_short,
            img_last = last_content.logo_short;

        console.log("RENDER(IndexPage): image urls", img_back_url, img_current_url, img_next, img_last);

        var color = content.color;

        var page_name = content.page_name;
        var large_name = content.name;
        var small_name = content.genre;

        var description_text = content.short_description;

        return (
            <section id='IndexPage' class='title-container'>
                <SiteMap current_page={this} page_name={SiteMap.PAGE_INDEX} lang={this.props.lang} />

                <ImageRotator class="index-page-image-rotator" movie_id={content.id} img_front={img_current_url} img_back={img_back_url} img_next={img_next} img_last={img_last} direction={this.state.movement_direction} />

                <TitleColoredTable className="title-project-dsc" color={color} direction={this.state.movement_direction}>
                    <tbody>
                        <tr>
                            <td class="title-navigation">
                                <p class="footer-in-header tablet-only">
                                    ++ <b>Ingo Scheel</b> I Kameramann  <br/>
                                    <span class="footer-in-header__margin-block"></span>DOP I visual concepts ++
                                </p>
                                <NavigationMenu current_page={this} page_name={NavigationMenu.PAGE_INDEX} menuClickListener={this.menuClickListener.bind(this)}/>
                            </td>
                        </tr>
                        <tr>
                            <td class="title-content">
                                <AlphaBox class="movie-short-description" onClick={this.currentMovieTextClickListener.bind(this)}>
                                    <p dangerouslySetInnerHTML={{__html: description_text}}></p>
                                </AlphaBox>
                            </td>
                        </tr>
                        <tr>
                            <td class="title-footer">
                                ++ Ingo Scheel Kameramann I DOP für: Imagefilm I Werbung I Spielfilm I Dokumentarfilm I Köln ++
                            </td>
                        </tr>
                    </tbody>
                </TitleColoredTable>


                <div class="title-header">
                    <div className="title-page-name">
                        <BracketTextBox text={page_name} />
                        <img src={asset("img/button-arrow-next.png")} class="img-next-arrow" onClick={this.nextArrowButtonClickListener.bind(this)} alt="" />
                    </div>
                    <AlphaBox>
                        <span class="movie-title">{large_name} </span>
                        <span class="movie-genre">{small_name}</span>
                        <img src={asset("img/button-film.png")} class="title-play-button" alt="" onClick={self.playButtonClickLister.bind(self)}/>
                        <img src={asset("img/button-film-2.png")} class="title-additional-play-button" alt="" onClick={self.playButtonClickLister.bind(self)}/>
                    </AlphaBox>
                </div>

                <div className="scroll-message">
                    <img src={asset("img/button-two-arrows.png")} alt="" />
                    <span>Scroll and click to discover</span>
                </div>

            </section>
        );
    }
}
