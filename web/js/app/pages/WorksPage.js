import React from "react";
//import "gsap";
var $ = require('jquery');

import config from '../config';
import TransitionStore from '../stores/TransitionStore';
import * as TransitionActions from '../actions/TransitionActions';
import { asset, createNotReadyYetFunction, hexToRgba } from "../funcitons";
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

const CELLS_PER_ROW = 4;
const ROWS_PER_TABLE = 3;
const MOVIE_TITLE_ALPHA = 0.85;

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

        switch ( tr.type ) {
            case "INDEX-WORKS":
            case "CONTACTS-WORKS":
            case "ABOUT-WORKS":
                tr.prev_page.leaveToDifferentTitlePage(callback);
                this.enterFromDifferentTitlePage(callback);
                break;
            case "MOVIE-WORKS":
                tr.prev_page.leaveToIndexPage(callback);
                this.enterFromDifferentTitlePage(callback);
                break;
        }
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