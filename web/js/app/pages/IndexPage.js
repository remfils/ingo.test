import React from "react";
//import "gsap";
var $ = require('jquery');

import config from '../config';
import TransitionStore from '../stores/TransitionStore';
import * as TransitionActions from '../actions/TransitionActions';
import { asset, createNotReadyYetFunction } from "../funcitons";
import AlphaTextBox from "./components/AlphaTextBox";
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
            current_content: null
        };

        this.is_scroll_message_shown = true;

        this.is_transition = false;

        this.content = [];
        this.current_content = {};
        this.current_content_index = 0;

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

        $(window).on('mousewheel DOMMouseScroll', this.scrollListener.bind(this));
    }

    componentWillUnmount() {
        console.debug('DEBUG(IndexPage.componentWillUnmount)');
        $(window).off('mousewheel DOMMouseScroll');
    }

    componentDidMount() {
        this.hadleTransitionAnimations();
    }

    hadleTransitionAnimations() {
        var tr = this.props.transition;
        if ( !tr )
            return;

        var callback = tr.callback;
        var prev_page = tr.prev_page;

        switch ( tr.type ) {
            case "MOVIE-INDEX":
                prev_page.leaveToIndexPage(tr.callback);
                this.enterFromMoviePage(tr.callback);
                break;
            case "CONTACT-INDEX":
                prev_page.leaveToDifferentTitlePage(callback);
                this.enterFromDifferentTitlePage(callback);
                break;
        }
    }

    enterFromMoviePage(callback) {
        var tl = new TimelineLite();

        var $current_image = $(".index-page-image-rotator .img-front"),
            $this = $('#IndexPage');

        tl.from($this, 1, {x: "-=100%"})
            .from($current_image, 1, {x: "-=100%", ease: Power2.easeInOut, onComplete:()=>{
                if(callback)
                    callback();
            }});
    }


    leaveToMoviePage(callback) {
        var tl = new TimelineLite();

        var $prev_image = $(".index-page-image-rotator .img-back"),
            $current_image = $(".index-page-image-rotator .img-front"),
            $table = $(".title-project-dsc");

        tl.to($current_image, 1, {x: "-=100%", ease: Power2.easeOut})
            .to($("#IndexPage"), 1, {x: "-=100%", ease: Power2.easeInOut, onComplete:()=>{
                $("#IndexPage").css("display", "none");

                if (callback)
                    callback();
            }});

        /*TweenLite.to( , 1, {left: "-=60%"} );
        TweenLite.to( , 1, {left: "0", height: "70%"} );
        TweenLite.to( $(".title-header"), 1, {opacity: 0, onComplete: () => {
            $("#IndexPage").css("display", "none");

            if (callback)
                callback();
        }} );
        TweenLite.set($("#IndexPage"), {"z-index": 0});*/
    }

    enterFromDifferentTitlePage(callback) {
        var tl = new TimelineLite();
        var $this = $('#IndexPage');

        tl.from($this, 1, {opacity: 0, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    leaveToDifferentTitlePage(callback) {
        var tl = new TimelineLite();
        var $this = $('#IndexPage');

        tl.to($this, 1, {opacity: 0, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    getMouseScrollDirection(e) {
        var delta = (e.type === 'DOMMouseScroll' ?
        e.originalEvent.detail * -40 :
            e.originalEvent.wheelDelta);

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
        }, 1000);
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

                <ImageRotator class="index-page-image-rotator" movie_id={content.id} img_front={img_current_url} img_back={img_back_url} img_next={img_next} img_last={img_last} direction={this.state.movement_direction} />

                <TitleColoredTable className="title-project-dsc" color={color} direction={this.state.movement_direction}>
                    <tr>
                        <td class="title-navigation">
                            <NavigationMenu current_page={this}/>
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
                </TitleColoredTable>


                <div class="title-header">
                    <div className="title-page-name">
                        <BracketTextBox text={page_name} />
                        <img src={asset("img/button-arrow-next.png")} class="img-next-arrow" onClick={this.nextArrowButtonClickListener.bind(this)} alt="" />
                    </div>
                    <AlphaBox onClick={self.currentMovieClickListener.bind(self)}>
                        <span class="movie-title">{large_name} </span>
                        <span class="movie-genre">{small_name}</span>
                        <img src={asset("img/button-film.png")} class="title-play-button" alt="" />
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