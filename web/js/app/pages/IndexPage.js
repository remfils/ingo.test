import React from "react";
//import "gsap";
var $ = require('jquery');

import config from '../config';
import TransitionStore from '../stores/TransitionStore';
import * as TransitionActions from '../actions/TransitionActions';
import { asset } from "../funcitons";
import AlphaTextBox from "./components/AlphaTextBox";
import AlphaBoxDangerHtml from "./components/AlphaBoxDangerHtml";
import BracketTextBox from "./components/BracketTextBox";
import ImageRotator from "./components/ImageRotator";
import TitleColoredTable from "./IndexPage/TitleColoredTable";
import ShortProjectModel from "../models/ShortProjectModel";

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
        var padIntegerWithZeros = function (num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        }

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

        $(window).on('mousewheel DOMMouseScroll', this.scrollListener.bind(this));
    }

    componentWillUnmount() {
        $(window).off('mousewheel DOMMouseScroll', this.scrollListener);
    }

    getMouseScrollDirection(e) {
        var delta = (e.type === 'DOMMouseScroll' ?
        e.originalEvent.detail * -40 :
            e.originalEvent.wheelDelta);

        return delta > 0 ? -1 : 1;
    }

    scrollListener(e) {
        if ( this.is_scroll_message_shown ) {
            this.is_scroll_message_shown = false;

            var $scrl_msg = $(".scroll-message");

            TweenLite.to($scrl_msg, 1, {bottom: "-3em", opacity: 0, onComplete: () => {
                $scrl_msg.hide();
            }});
        }

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
            this.nextMovie();
        }
        else if ( this.scroll_counter <= -MAX_SCROLL_COUNTER_VALUE) {
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

    leaveToMoviePage() {
        TweenLite.to( $(".title-project-dsc"), 1, {left: "-=60%"} );
        TweenLite.to( $(".img-front"), 1, {left: "0", height: "70%"} );
        TweenLite.to( $(".title-header"), 1, {opacity: 0, onComplete: () => {
            $("#IndexPage").css("display", "none");
        }} );
        TweenLite.set($("#IndexPage"), {"z-index": 0});
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

        var description_text = content.description;
        var cutat = description_text.lastIndexOf(' ',250);
        if(cutat!=-1)
            description_text = description_text.substring(0,cutat)+'(...)';

        return (
            <section id='IndexPage' class='title-container'>

                <ImageRotator onClick={self.currentMovieClickListener.bind(self)} class="index-page-image-rotator" img_front={img_current_url} img_back={img_back_url} img_next={img_next} img_last={img_last} direction={this.state.movement_direction} />

                <TitleColoredTable className="title-project-dsc" color={color} direction={this.state.movement_direction}>
                    <tr>
                        <td class="title-navigation">
                            <ul>
                                <li><a href="#">about</a></li>
                                <li><a href="#">work</a></li>
                                <li><a href="#">contacts</a></li>
                                <li><a href="#">impressum</a></li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td class="title-content">
                            <AlphaBoxDangerHtml class="movie-short-description">
                                {description_text}
                            </AlphaBoxDangerHtml>
                        </td>
                    </tr>
                    <tr>
                        <td class="title-footer">
                            ++ Ingo Scheel Kameramann I DOP für: Imagefilm I Werbung I Spielfilm I Dokumentarfilm I Köln ++
                        </td>
                    </tr>
                </TitleColoredTable>


                <div class="title-header">
                    <BracketTextBox className="title-page-name" text={page_name} />
                    <AlphaTextBox text={[<span class="movie-title">{large_name} </span>, <span class="movie-genre">{small_name}</span>]} />
                </div>

                <div className="scroll-message">
                    +++ Scroll and click to discover +++
                </div>

            </section>
        );
    }
}