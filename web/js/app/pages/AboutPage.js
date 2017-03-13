import React from "react";
//import "gsap";
var $ = require('jquery');

import config from '../config';
import TransitionStore from '../stores/TransitionStore';
import * as TransitionActions from '../actions/TransitionActions';
import { asset, createNotReadyYetFunction } from "../funcitons";
import AlphaTextBox from "./components/AlphaTextBox";
import NavigationMenu from "./components/NavigationMenu";
import SiteMap from "./components/SiteMap";
import AlphaBox from "./components/AlphaBox";
import AlphaBoxDangerHtml from "./components/AlphaBoxDangerHtml";
import BracketTextBox from "./components/BracketTextBox";
import ImageRotator from "./components/ImageRotator";
import TitleColoredTable from "./IndexPage/TitleColoredTable";
import ShortProjectModel from "../models/ShortProjectModel";
import MoviePage from './MoviePage';
import EmailForm from './MoviePage/EmailForm';

const STATUS_INIT = "page_init";
const STATUS_LOADING = "page_loading";
const STATUS_LOADED = "page_loaded";
const STATUS_ERROR = "page_error";

export default class AboutPage extends React.Component {
    constructor() {
        super();

        this.state = {
            dataState: STATUS_INIT,
            data: null
        };
    }

    componentWillMount() {
        $.ajax({
            url: config.SITE_NAME + 'api/page/about',
            dataType: 'json',
            success: (data) => {
                console.debug(data);
                this.setState({dataState: STATUS_LOADED, data: data});
            }
        });
    }

    componentWillUnmount() {

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
        var tl = new TimelineLite();
        tl.add('clear-stage', 0)
            .add('leave-stage', 0.5)
            .add('enter-stage', 1.5);

        switch ( tr.type ) {
            case "INDEX-ABOUT":
            case "CONTACTS-ABOUT":
            case "WORKS-ABOUT":
            case "IMPRESSUM-ABOUT":
                tr.prev_page.leaveToDifferentTitlePage(tl);
                this.enterFromDifferentTitlePage(tl);
                break;
        }

        tl.to(window,0,{onComplete:()=>{
            if (callback)
                callback();
        }})
    }

    introAnimation(callback) {
        TweenLite.from($("#AboutPage"), 1, {opacity: 0, delay: 2, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    enterFromDifferentTitlePage(tl) {
        var $this = $('#AboutPage');

        var $img = $('#AboutPage .contact-bg-image');
        var $title = $('#AboutPage .title-header');
        var $dsc = $('#AboutPage .title-content');
        var $img = $('#AboutPage .contact-bg-image');
        var $nav = $('#AboutPage .title-navigation');

        tl.from($img, 1, {y: "-=100%", ease: Power4.easeInOut}, 'leave-stage');

        tl.from($title, 1, {opacity: 0}, 'enter-stage')
            .from($dsc, 1, {opacity: 0}, 'enter-stage');

        tl.set($nav, {opacity:0}, 'clear-stage');
        tl.set($nav, {opacity:1}, 'enter-stage');
    }

    leaveToDifferentTitlePage(tl) {
        var $this = $('#AboutPage');

        $this.css('z-index', 9999);

        var $title = $('#AboutPage .title-header');
        var $dsc = $('#AboutPage .title-content');
        var $img = $('#AboutPage .contact-bg-image');
        var $color = $('#AboutPage .table-bg-color');
        var $nav = $('#AboutPage .title-navigation');

        tl.to($title, 0.5, {opacity: 0}, 'clear-stage')
            .to($dsc, 0.5, {opacity: 0}, 'clear-stage');

        tl.to($img, 1, {y: "+=100%", ease: Power4.easeInOut}, 'leave-stage')
            .to($color, 0.4, {opacity: 0, delay: 0.6}, 'leave-stage');

        tl.set($nav, {opacity:0}, 'enter-stage');
    }

    render() {
        var page_name = "About",
            info_header = "Ingo Scheel - Dipl. Designer Kamera (FH)",
            info_text = "";

        if (this.state.dataState === STATUS_LOADED) {
            var d = this.state.data;

            page_name = d.page_name;
            info_header = d.info_header;
            info_text = d.info_text;
        }

        return (
            <section id='AboutPage' class='title-container about-page'>

                <SiteMap current_page={this} page_name={SiteMap.PAGE_ABOUT} lang={this.props.lang} />

                <div className="contact-bg-image"></div>

                <TitleColoredTable className="title-project-dsc" color="#D7D4BE" direction="">
                    <tbody>
                        <tr>
                            <td class="title-navigation">
                                <p class="footer-in-header tablet-only">
                                    ++ <b>Ingo Scheel</b> I Kameramann  <br/>
                                    <span class="footer-in-header__margin-block"></span>DOP I visual concepts ++
                                </p>
                                <NavigationMenu current_page={this} page_name={NavigationMenu.PAGE_ABOUT}/>
                            </td>
                        </tr>
                        <tr>
                            <td class="title-content">
                                <h2>{info_header}</h2>
                                <p>{info_text}</p>
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
                    <AlphaBox>
                        <span class="movie-title contact-title">{page_name}</span>
                    </AlphaBox>
                </div>

                <div className="scroll-message">
                </div>

            </section>
        );
    }
}
