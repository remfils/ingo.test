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
import EmailForm from './MoviePage/EmailForm';

export default class AboutPage extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {

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

        return (
            <section id='AboutPage' class='title-container about-page'>

                <div className="contact-bg-image"></div>

                <TitleColoredTable className="title-project-dsc" color="#D7D4BE" direction="">
                    <tr>
                        <td class="title-navigation">
                            <NavigationMenu current_page={this} page_name={NavigationMenu.PAGE_ABOUT}/>
                        </td>
                    </tr>
                    <tr>
                        <td class="title-content">
                            <h2>Ingo Scheel - Dipl. Designer Kamera (FH)</h2>
                            <p>
                                Geboren 1975 in Geldern, beschäftigte ich mich schon im Alter von 14 Jahren mit der Fotografie. Jahre später, nach mehr- jähriger Tätigkeit als Beleuchter bei Filmproduktionen absolvierte ich den Kamerastudiengang an der Fachhochschule Dortmund mit dem
                                Abschluss als Diplomdesigner im Jahr 2008. Anschließend konnte ich zahlreiche Projekte als Lichtsetzender Kameramann für Filmproduktionen, Unternehmen und Freie Künstler umsetzen und freue mich auf neue Projekte.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="title-footer">
                            ++ Ingo Scheel Kameramann I DOP für: Imagefilm I Werbung I Spielfilm I Dokumentarfilm I Köln ++
                        </td>
                    </tr>
                </TitleColoredTable>


                <div class="title-header">
                    <AlphaBox>
                        <span class="movie-title contact-title">About</span>
                    </AlphaBox>
                </div>

                <div className="scroll-message">
                </div>

            </section>
        );
    }
}