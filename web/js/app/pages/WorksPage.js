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

export default class WorksPage extends React.Component {
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
            case "INDEX-WORKS":
            case "CONTACTS-WORKS":
            case "ABOUT-WORKS":
                tr.prev_page.leaveToDifferentTitlePage(callback);
                this.enterFromDifferentTitlePage(callback);
                break;
        }
    }

    introAnimation(callback) {
        TweenLite.from($("#WorksPage"), 1, {opacity: 0, delay: 2, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    enterFromDifferentTitlePage(callback) {
        var tl = new TimelineLite();
        var $this = $('#WorksPage');

        tl.from($this, 1, {opacity: 0, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    leaveToDifferentTitlePage(callback) {
        var tl = new TimelineLite();
        var $this = $('#WorksPage');

        tl.to($this, 1, {opacity: 0, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    render() {

        return (
            <section id='WorksPage' class='title-container works-page'>

                <div className="contact-bg-image"></div>

                <TitleColoredTable className="title-project-dsc" color="#CCE1EE" direction="">
                    <tr>
                        <td class="title-navigation">
                            <NavigationMenu current_page={this} page_name={NavigationMenu.PAGE_WORKS}/>
                        </td>
                    </tr>
                    <tr>
                        <td class="title-content">
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