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

export default class ImpressumPage extends React.Component {
    constructor() {
        super();

        this.state = {
            dataState: STATUS_INIT,
            data: null
        };
    }

    componentWillMount() {

        $.ajax({
            url: config.SITE_NAME + 'api/page/impressum',
            dataType: 'json',
            success: (data) => {
                console.debug(data);
                this.setState({dataState: STATUS_LOADED, data: data});
            }
        });

        /*setTimeout(()=>{
            var data = {
                page_title: "Impressum",
                info_header: "Verantwortlich für den Inhalt dieser Seite:",
                info_title: "Ingo Scheel",
                info_label_first: "Thielenstraße 13  I  50825 Köln ",
                info_label_second: "Tel: 0163 8765 082  I  E-Mail: ingo.scheel@yahoo.de",
                info_text: "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 6 Abs.1 MDStV und § 8 Abs.1 TDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich."
            };
            this.setState({dataState: STATUS_LOADED, data: data});
        }, 1000);*/

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
            case "ABOUT-IMPRESSUM":
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
        var pageTitle = "Impressum",
            infoHeader = "Verantwortlich für den Inhalt dieser Seite:",
            infoTitle = "Ingo Scheel",
            infoLabelFirst = "Thielenstraße 13  I  50825 Köln ",
            infoLabelSecond = "Tel: 0163 8765 082  I  E-Mail: ingo.scheel@yahoo.de",
            infoText = "";

        if (this.state.dataState === STATUS_LOADED) {
            var d = this.state.data;

            pageTitle = d.page_title;
            infoHeader = d.info_header;
            infoTitle = d.info_title;
            infoLabelFirst = d.info_label_first;
            infoLabelSecond = d.info_label_second;
            infoText = d.info_text;
        }

        return (
            <section id='ImpressumPage' class='title-container impressum-page'>

                <SiteMap current_page={this} page_name={SiteMap.PAGE_IMPRESSUM} lang={this.props.lang} />

                <div className="contact-bg-image"></div>

                <TitleColoredTable className="title-project-dsc" color="#C7D8D2" direction="">
                    <tbody>
                        <tr>
                            <td class="title-navigation">
                                <NavigationMenu current_page={this} page_name={NavigationMenu.PAGE_IMPRESSUM} />
                            </td>
                        </tr>
                        <tr>
                            <td class="title-content">
                                <p><strong>{infoHeader}</strong></p>

                                <p class="ingo-info">
                                    <strong>{infoTitle}</strong> <br/>

                                    {infoLabelFirst}<br/>

                                    {infoLabelSecond}
                                </p>

                                <p class="ingo-description">
                                    {infoText}
                                </p>
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
                        <span class="movie-title contact-title">{pageTitle}</span>
                    </AlphaBox>
                </div>

                <div className="scroll-message">
                </div>

            </section>
        );
    }
}