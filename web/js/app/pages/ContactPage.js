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

export default class ContactPage extends React.Component {
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
            case "INDEX-CONTACTS":
            case "ABOUT-CONTACTS":
            case "WORKS-CONTACTS":
            case "IMPRESSUM-CONTACTS":
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
        TweenLite.from($("#ContactPage"), 1, {opacity: 0, delay: 2, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    enterFromDifferentTitlePage(tl) {
        var $this = $('#ContactPage');

        var $contact = $('#ContactPage .title-header');
        var $info = $('#ContactPage .contact-info');
        var $form = $('#ContactPage .contact-form');
        var $img = $('#ContactPage .contact-bg-image');
        var $nav = $('#ContactPage .title-navigation');

        tl.from($img, 1, {y: '-=100%', ease: Power4.easeInOut}, 'leave-stage');

        tl.from($contact, 1, {opacity: 0}, 'enter-stage')
            .from($info, 1, {opacity: 0}, 'enter-stage')
            .from($form, 1, {opacity: 0}, 'enter-stage');

        tl.set($nav, {opacity:0}, 'clear-stage');
        tl.set($nav, {opacity:1}, 'enter-stage');
    }

    leaveToDifferentTitlePage(callback) {
        var tl = new TimelineLite();
        var $this = $('#ContactPage');

        $this.css('z-index', 9999);

        var $title = $('#ContactPage .contact-title');
        var $info = $('#ContactPage .contact-info');
        var $form = $('#ContactPage .contact-form');
        var $img = $('#ContactPage .contact-bg-image');
        var $color = $('#ContactPage .table-bg-color');
        var $nav = $('#ContactPage .title-navigation');

        tl.to($title, 0.5, {opacity: 0}, 'clear-stage')
            .to($info, 0.5, {opacity: 0}, 'clear-stage')
            .to($form, 0.5, {opacity: 0}, 'clear-stage');

        tl.to($img, 1, {y: '+=100%', ease: Power4.easeInOut}, 'leave-stage')
            .to($color, 0.4, {opacity: 0, delay: 0.6}, 'leave-stage');

        tl.set($nav, {opacity:0}, 'enter-stage');
    }

    render() {

        return (
            <section id='ContactPage' class='title-container'>

                <SiteMap current_page={this} page_name={SiteMap.PAGE_CONTACTS} lang={this.props.lang} />

                <div className="contact-bg-image"></div>

                <TitleColoredTable className="title-project-dsc" color="#D1D3D0" direction="">
                    <tbody>
                        <tr>
                            <td class="title-navigation">
                                <NavigationMenu current_page={this} page_name={NavigationMenu.PAGE_CONTACTS}/>
                            </td>
                        </tr>
                        <tr>
                            <td class="title-content">
                                <EmailForm class="contact-form"/>
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
                        <span class="movie-title contact-title">Contact</span>
                    </AlphaBox>

                    <div className="contact-info">
                        <p><strong>Ingo Scheel</strong>  Kameramann  I  DOP   I  visual concepts</p>
                        <p>Thielenstraße 13  I  50825 Köln</p>
                        <p>Tel: 0163 8765 082  I  E-Mail: ingo.scheel@yahoo.de</p>
                    </div>
                </div>

                <div className="scroll-message">
                </div>

            </section>
        );
    }
}