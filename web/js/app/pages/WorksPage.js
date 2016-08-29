import React from "react";
//import "gsap";
var $ = require('jquery');

import config from '../config';
import TransitionStore from '../stores/TransitionStore';
import * as TransitionActions from '../actions/TransitionActions';
import { asset, createNotReadyYetFunction, hexToRgba } from "../funcitons";
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

const CELLS_PER_ROW = 4;
const ROWS_PER_TABLE = 3;
const MOVIE_TITLE_ALPHA = 0.85;

export default class WorksPage extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        $(window).on('resize', this.updateSizeOfImages.bind(this))
    }

    componentWillUnmount() {
        $(window).off('resize');
    }

    componentDidMount() {
        this.hadleTransitionAnimations();
        this.updateSizeOfImages();
        this.addHoverListeners();
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
            case "INDEX-WORKS":
            case "CONTACTS-WORKS":
            case "ABOUT-WORKS":
            case "IMPRESSUM-WORKS":
                tr.prev_page.leaveToDifferentTitlePage(tl);
                this.enterFromDifferentTitlePage(tl);
                break;
            case "MOVIE-WORKS":
                tr.prev_page.leaveToIndexPage(callback);
                this.enterFromDifferentTitlePage(callback);
                break;
        }

        tl.to(window,0,{onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    updateSizeOfImages() {
        var image_width = (window.innerWidth - $('#WorksPage .movie-works-table').offset().left - 200 - 25 * (CELLS_PER_ROW - 1)) / CELLS_PER_ROW;
        var image_height = (window.innerHeight - $('#WorksPage .title-header').offset().top * 2 - 25 * (CELLS_PER_ROW - 1)) / ROWS_PER_TABLE;
        $('.movie_cell > .movie_image')
            .width(image_width)
            .height(image_height);
    }

    addHoverListeners() {
        var $logo_span = $('.movie_cell > .movie_image > span');

        TweenLite.set($logo_span, {opacity: 0});

        $logo_span.on('mouseover', (e)=>{
            if (e.target != e.currentTarget)
                return;

            console.debug('MOUSE OVER');

            TweenLite.killTweensOf(e.currentTarget);
            TweenLite.to(e.currentTarget, 0.5, {opacity: 0.85});
        });

        $logo_span.on('mouseout', (e)=>{
            if (e.target != e.currentTarget)
                return;

            console.debug('MOUSE OUT');

            TweenLite.killTweensOf(e.currentTarget);
            TweenLite.to(e.currentTarget, 0.5, {opacity: 0});
        });
    }

    introAnimation(callback) {
        TweenLite.from($("#WorksPage"), 1, {opacity: 0, delay: 2, onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    enterFromDifferentTitlePage(tl) {
        var $nav = $('#WorksPage .title-navigation');

        tl.from($nav, 0, {opacity:0}, 'enter-stage');

        $('#WorksPage .movie_cell').each((index, item) => {
            var delay = 0.1 * index;
            tl.from(item, 0.5, {opacity: 0, delay: delay, ease: Power4.easeInOut}, 'enter-stage');
        });

        tl.set($nav, {opacity:0}, 'clear-stage');
        tl.set($nav, {opacity:1}, 'enter-stage');
    }

    leaveToDifferentTitlePage(tl) {
        var $this = $('#WorksPage');

        $this.css('z-index', 9999);

        var $nav = $('#WorksPage .title-navigation');
        var $movies = $('#WorksPage .movie_cell');
        var $color = $('#WorksPage .table-bg-color');

        var movie_count = $movies.length;
        var interval = 1 / (0.1*movie_count+1);
        $movies.each((index, item)=>{
            var delay = interval * index * 0.1;
            tl.to(item, interval, {opacity: 0, delay}, 'clear-stage');
        })

        tl.to($color, 1, {opacity: 0}, 'leave-stage');

        tl.set($nav, {opacity:0}, 'enter-stage');
    }

    createProjectOnClickFunction(project_id) {
        var self = this;

        return function(e) {
            e.preventDefault();

            TransitionActions.fromWorksToMovie(self, project_id);

            return false;
        }
    }

    render() {

        var tds = this.props.movies.map((item, index) => {
            //var span_style = {backgroundColor: hexToRgba(item.color, MOVIE_TITLE_ALPHA)};
            var span_style = {backgroundColor: item.color};
            var image_style = {backgroundImage: 'url(' + item.logo + ')'};

            return <td className='movie_cell'>
                    <div class='movie_image' style={image_style}>
                        <span style={span_style} onClick={this.createProjectOnClickFunction(index)}>
                            <h2>{item.name}</h2><br/>
                            <h3>{item.genre}</h3>
                        </span>
                    </div>
                </td>;
        });

        var m_len = tds.length;
        var row_array = [];
        var rows = [];
        for ( var i=1; i<=m_len; i++) {
            row_array.push(tds[i-1]);

            console.debug(i, i % CELLS_PER_ROW === 0 , i !== 0);

            if (i % CELLS_PER_ROW === 0) {
                console.debug('PUSH!');
                rows.push(<tr>{row_array}</tr>);
                row_array = [];
            }
        }

        if (row_array)
            rows.push(<tr>{row_array}</tr>);

        return (
            <section id='WorksPage' class='title-container works-page'>

                <SiteMap current_page={this} page_name={SiteMap.PAGE_WORKS} />

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
                        <table class='movie-works-table'>
                            {rows}
                        </table>
                    </AlphaBox>
                </div>

                <div className="scroll-message">
                </div>

            </section>
        );
    }
}