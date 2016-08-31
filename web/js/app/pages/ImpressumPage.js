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

export default class ImpressumPage extends React.Component {
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
            case "INDEX-IMPRESSUM":
            case "CONTACTS-IMPRESSUM":
            case "WORKS-IMPRESSUM":
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
        TweenLite.from($("#ImpressumPage"), 1, {opacity: 0, delay: 2, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    enterFromDifferentTitlePage(tl) {
        var $this = $('#ImpressumPage');

        var $img = $('#ImpressumPage .contact-bg-image');
        var $title = $('#ImpressumPage .title-header');
        var $dsc = $('#ImpressumPage .title-content');
        var $img = $('#ImpressumPage .contact-bg-image');
        var $nav = $('#ImpressumPage .title-navigation');

        tl.from($img, 1, {y: "-=100%", ease: Power4.easeInOut}, 'leave-stage');

        tl.from($title, 1, {opacity: 0}, 'enter-stage')
            .from($dsc, 1, {opacity: 0}, 'enter-stage');

        tl.set($nav, {opacity:0}, 'clear-stage');
        tl.set($nav, {opacity:1}, 'enter-stage');
    }

    leaveToDifferentTitlePage(tl) {
        var $this = $('#ImpressumPage');

        $this.css('z-index', 9999);

        var $title = $('#ImpressumPage .title-header');
        var $dsc = $('#ImpressumPage .title-content');
        var $img = $('#ImpressumPage .contact-bg-image');
        var $color = $('#ImpressumPage .table-bg-color');
        var $nav = $('#ImpressumPage .title-navigation');

        tl.to($title, 0.5, {opacity: 0}, 'clear-stage')
            .to($dsc, 0.5, {opacity: 0}, 'clear-stage');

        tl.to($img, 1, {y: "+=100%", ease: Power4.easeInOut}, 'leave-stage')
            .to($color, 0.4, {opacity: 0, delay: 0.6}, 'leave-stage');

        tl.set($nav, {opacity:0}, 'enter-stage');
    }

    render() {

        return (
            <section id='ImpressumPage' class='title-container impressum-page'>

                <SiteMap current_page={this} page_name={SiteMap.PAGE_IMPRESSUM} lang={this.props.lang} />

                <div className="contact-bg-image"></div>

                <TitleColoredTable className="title-project-dsc" color="#C7D8D2" direction="">
                    <tr>
                        <td class="title-navigation">
                            <NavigationMenu current_page={this} page_name={NavigationMenu.PAGE_IMPRESSUM} />
                        </td>
                    </tr>
                    <tr>
                        <td class="title-content">
                            <p><strong>Verantwortlich für den Inhalt dieser Seite:</strong></p>

                            <p class="ingo-info">
                                <strong>Ingo Scheel</strong> <br/>

                                Thielenstraße 13  I  50825 Köln <br/>

                                Tel: 0163 8765 082  I  E-Mail: ingo.scheel@yahoo.de
                            </p>

                            <p class="ingo-description">
                                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.<br/>
                                Als Diensteanbieter sind wir gemäß § 6 Abs.1 MDStV und § 8 Abs.1 TDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
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
                        <span class="movie-title contact-title">Impressum</span>
                    </AlphaBox>
                </div>

                <div className="scroll-message">
                </div>

            </section>
        );
    }
}