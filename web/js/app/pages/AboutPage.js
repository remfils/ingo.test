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

        switch ( tr.type ) {
            case "INDEX-ABOUT":
            case "CONTACTS-ABOUT":
                tr.prev_page.leaveToDifferentTitlePage(callback);
                this.enterFromDifferentTitlePage(callback);
                break;
        }
    }

    introAnimation(callback) {
        TweenLite.from($("#AboutPage"), 1, {opacity: 0, delay: 2, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    enterFromDifferentTitlePage(callback) {
        var tl = new TimelineLite();
        var $this = $('#AboutPage');

        tl.from($this, 1, {opacity: 0, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    leaveToDifferentTitlePage(callback) {
        var tl = new TimelineLite();
        var $this = $('#AboutPage');

        tl.to($this, 1, {opacity: 0, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    render() {

        return (
            <section id='AboutPage' class='title-container about-page'>

                <div className="contact-bg-image"></div>

                <TitleColoredTable className="title-project-dsc" color="#D1D3D0" direction="">
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