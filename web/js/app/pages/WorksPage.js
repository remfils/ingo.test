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
    constructor(props) {
        super(props);

        this.leftArrowClickListener = this.leftArrowClickListener.bind(this);
        this.rightArrowClickListener = this.rightArrowClickListener.bind(this);
        this.onAlphaBoxRedrawListener = this.onAlphaBoxRedrawListener.bind(this);

        this.current_page = 0;

        var displayed_movies = props.movies.slice(0,12);

        this.state = {
            displayed_movies: displayed_movies
        };
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
                if (tr.movie_index) {
                    this.current_page = page = tr.movie_index % 12;
                    var slice_index = this.current_page * 12;
                    this.setState({
                        displayed_movies: this.props.movies.slice(slice_index, slice_index + 12)
                    });
                }

                tr.prev_page.leaveToDifferentTitlePage(tl);
                this.enterFromDifferentTitlePage(tl);
                break;
            case "MOVIE-WORKS":
                tr.prev_page.leaveToIndexPage(tl);
                this.enterFromDifferentTitlePage(tl);
                break;
        }

        tl.to(window,0,{onComplete:()=>{
            if (callback)
                callback();
        }});
    }

    updateSizeOfImages() {
        var $movie_table = $('#WorksPage .movie-works-table');

        if ($movie_table.length) {
            var image_width = (window.innerWidth - $movie_table.offset().left - 200 - 25 * (CELLS_PER_ROW - 1)) / CELLS_PER_ROW;
            var image_height = (window.innerHeight - $('#WorksPage .title-header').offset().top * 2 - 25 * (CELLS_PER_ROW - 1)) / ROWS_PER_TABLE;
            $('.movie_cell > .movie_image')
                .width(image_width)
                .height(image_height);
        }
    }

    addHoverListeners() {
        var $logo_span = $('.movie_cell > .movie_image > span');

        TweenLite.set($logo_span, {opacity: 0});

        $('.movie-works-table').on('mouseover', '.movie_cell > .movie_image > span', (e)=>{
            if (e.target != e.currentTarget)
                return;

            console.debug('MOUSE OVER');

            TweenLite.killTweensOf(e.currentTarget);
            TweenLite.to(e.currentTarget, 0.5, {opacity: 0.85});
        });

        $('.movie-works-table').on('mouseout', '.movie_cell > .movie_image > span', (e)=>{
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
        var $control = $('#WorksPage .work-cotnrols');

        tl.from($nav, 0, {opacity:0}, 'enter-stage');

        $('#WorksPage .movie_cell').each((index, item) => {
            var delay = 0.1 * index;
            tl.from(item, 0.5, {opacity: 0, delay: delay, ease: Power4.easeInOut}, 'enter-stage');
        });

        tl.fromTo($control, 0.5, {opacity: 0}, {opacity: 1}, 'enter-stage');

        tl.set($nav, {opacity:0}, 'clear-stage');
        tl.set($nav, {opacity:1}, 'enter-stage');
    }

    leaveToDifferentTitlePage(tl) {
        var $this = $('#WorksPage');

        $this.css('z-index', 9999);

        var $nav = $('#WorksPage .title-navigation');
        var $movies = $('#WorksPage .movie_cell');
        var $color = $('#WorksPage .table-bg-color');
        var $control = $('#WorksPage .work-cotnrols');

        var movie_count = $movies.length;
        var interval = 1 / (0.1*movie_count+1);
        $movies.each((index, item)=>{
            var delay = interval * index * 0.1;
            tl.to(item, interval, {opacity: 0, delay}, 'clear-stage');
        });

        tl.to($control, 0.5, {opacity: 0}, 'clear-stage');

        tl.to($color, 1, {opacity: 0}, 'leave-stage');

        tl.set($nav, {opacity:0}, 'enter-stage');
    }

    leaveToWorks(tl) {
        var $this = $('#WorksPage');

        $this.css('z-index', 9999);

        var $nav = $('#WorksPage .title-navigation');
        var $movies = $('#WorksPage .movie_cell');
        var $color = $('#WorksPage .table-bg-color');
        var $footer = $('.title-footer');
        var $control = $('#WorksPage .work-cotnrols');

        var movie_count = $movies.length;
        var interval = 1 / (0.1*movie_count+1);
        $movies.each((index, item)=>{
            var delay = interval * index * 0.1;
            tl.to(item, interval, {opacity: 0, delay}, 'clear-stage');
        });

        tl.to($control, 0.5, {opacity: 0}, 'clear-stage');

        tl.to($color, 1, {opacity: 0}, 'leave-stage')
            .to($footer, 1, {opacity: 0}, 'leave-stage')
            .to($nav, 1, {opacity: 0}, 'leave-stage');
    }

    createProjectOnClickFunction(project_id) {
        var self = this;

        return function(e) {
            e.preventDefault();

            TransitionActions.fromWorksToMovie(self, project_id, {
                command: MoviePage.CMD_SHOW_MOVIE
            });

            return false;
        }
    }

    leftArrowClickListener(e) {
        e.preventDefault();

        if (this.current_page <= 0)
            return false;

        this.current_page --;

        var slice_index = this.current_page * 12;
        var displayed_movies = this.props.movies.slice(slice_index, slice_index + 12);

        if (displayed_movies && displayed_movies.length) {
            this.setState({
                displayed_movies
            });
        }

        return false;
    }

    rightArrowClickListener(e) {
        e.preventDefault();

        this.current_page ++;

        var slice_index = this.current_page * 12;
        var displayed_movies = this.props.movies.slice(slice_index, slice_index+12);

        if (displayed_movies && displayed_movies.length) {
            this.setState({
                displayed_movies
            });
        }
        else {
            this.current_page --;
        }

        return false;
    }

    onAlphaBoxRedrawListener() {
        this.updateSizeOfImages();

        var $logo_span = $('.movie_cell > .movie_image > span');

        TweenLite.set($logo_span, {opacity: 0});
    }

    render() {

        var tds = this.state.displayed_movies.map((item, index) => {
            //var span_style = {backgroundColor: hexToRgba(item.color, MOVIE_TITLE_ALPHA)};
            var span_style = {backgroundColor: item.color};
            var image_style = {backgroundImage: 'url(' + item.logo + ')'};
            var td_key = 'movie_cell_key_' + index;

            return <td key={td_key} className='movie_cell'>
                    <div class='movie_image' style={image_style}>
                        <span style={span_style} onClick={this.createProjectOnClickFunction(item.id)}>
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
            var tr_key = 'tr_movie_cell_key_' + i;
            row_array.push(tds[i-1]);

            console.debug(i, i % CELLS_PER_ROW === 0 , i !== 0);

            if (i % CELLS_PER_ROW === 0) {
                console.debug('PUSH!');
                rows.push(<tr key={tr_key}>{row_array}</tr>);
                row_array = [];
            }
        }

        if (row_array) {
            i++;
            var tr_key = 'tr_movie_cell_key_' + i;
            rows.push(<tr key={tr_key}>{row_array}</tr>);
        }

        return (
            <section id='WorksPage' class='title-container works-page'>

                <SiteMap current_page={this} page_name={SiteMap.PAGE_WORKS} lang={this.props.lang}/>

                <TitleColoredTable className="title-project-dsc" color="#CCE1EE" direction="">
                    <tbody>
                        <tr>
                            <td class="title-navigation">
                                <p class="footer-in-header tablet-only">
                                    ++ <b>Ingo Scheel</b> I Kameramann  <br/>
                                    <span class="footer-in-header__margin-block"></span>DOP I visual concepts ++
                                </p>
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
                    </tbody>
                </TitleColoredTable>


                <div class="title-header">
                    <AlphaBox onRedraw={this.onAlphaBoxRedrawListener}>
                        <table class='movie-works-table'>

                            <tbody>
                                {rows}
                                <tr>
                                    <td class="work-cotnrols" colSpan="4">
                                        <img class="fliped" onClick={this.leftArrowClickListener} src={asset('img/button-arrow-next.png')}/>
                                        <img onClick={this.rightArrowClickListener} src={asset('img/button-arrow-next.png')}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </AlphaBox>
                </div>

                <div className="scroll-message">
                </div>

            </section>
        );
    }
}
