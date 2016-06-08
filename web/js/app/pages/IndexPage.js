import React from "react";
//import "gsap";
var $ = require('jquery');

import config from '../config';
import TransitionStore from '../stores/TransitionStore';
import * as TransitionActions from '../actions/TransitionActions';
import { asset } from "../funcitons";
import AlphaTextBox from "./components/AlphaTextBox";
import BracketTextBox from "./components/BracketTextBox";
import ImageRotator from "./components/ImageRotator";
import TitleColoredTable from "./IndexPage/TitleColoredTable";

export default class IndexPage extends React.Component {
    constructor() {
        super();
        this.state = {
            current_content: null
        };

        this.is_transition = false;

        this.content = [];
        this.current_content = {};
        this.current_content_index = 0;
    }

    get current_content_index() {
        return this._cci;
    }

    set current_content_index(val) {
        if ( val < 0 ) {
            this._cci = this.content.length;
        }
        else if ( val >= this.content.length ) {
            this._cci = 0;
        }
        else {
            this._cci = val;
        }
    }

    componentWillMount() {
        console.log(config.SITE_NAME + 'api/all-movies');
        var movie_counter = 1;

        $.ajax({
            url: config.SITE_NAME + 'api/all-movies',
            dataType: 'json',
            success: (data) => {
                this.content = data.map((item) => {
                    item.movie_count = movie_counter++;

                    var movie = new IndexContent();
                    movie.parseAllMoviesData(item);
                    return movie;
                });

                console.log(data, this.content);

                this.setState({
                    current_content: this.content[this.current_content_index]
                });
            },
            error: (err) => {
                console.log('error ' + err);
            }
        });

        $(window).on('mousewheel DOMMouseScroll', this.scrollListener.bind(this));
    }

    componentWillUnmount() {
        $(window).off('mousewheel DOMMouseScroll', this.scrollListener.bind(this));
    }

    scrollListener(e) {
        var direction = function () {

            var delta = (e.type === 'DOMMouseScroll' ?
            e.originalEvent.detail * -40 :
                e.originalEvent.wheelDelta);

            return delta > 0 ? 0 : 1;
        };

        if ( this.is_transition ) {
            return;
        }

        if(direction() === 1) {
            this.nextMovie();
        }
        if(direction() === 0) {
            this.prevMovie();
        }
    }

    nextMovie() {
        this.is_transition = true;

        this.current_content_index++;

        this.setState({
            current_content: this.content[this.current_content_index]
        });

        setTimeout(()=>{
            this.is_transition = false;
        }, 1000);
    }

    prevMovie() {
        this.is_transition = true;

        this.current_content_index--;

        this.setState({
            current_content: this.content[this.current_content_index]
        });

        setTimeout(()=>{
            this.is_transition = false;
        }, 2000);
    }

    render() {
        console.log(this.state.current_content);

        var content = this.state.current_content || new IndexContent();

        if ( !this.state.current_content ) {
            content.page_name = "test";
            content.description = "BГјrstner war ein besonderes Projekt."
                + "Die Aufgabe: Einen emotionalen Imagefilm fГјr das Reisemobilunternehmen herzustellen."
                + "DafГјr sind wir nach SГјdfrankreich gefahren und haben dort vor einer groГџartigen Landschaft eine anstrengende aber auch (...)";

            content.large_name = "The Large Name";
            content.small_name = "Something Smaller";
            content.img_back = "img/movies/Frame_Poldi-4.png";
            content.img_front = "img/movies/Frame_Poldi-4.png";
            content.color = "#ffffff";
        }

        var img_1_url = content.img_back,
            img_2_url = content.img_front,
            img_3_url = "img/movies/Frame_Poldi-4.png";

        var color = content.color;

        var page_name = content.page_name;
        var large_name = content.large_name;
        var small_name = content.small_name;

        var description_text = content.description;

        return (
            <section id='IndexPage' class='title-container'>

                <ImageRotator img_front={img_1_url} img_back={img_2_url} />

                <TitleColoredTable className="title-project-dsc" color={color}>
                    <tr>
                        <td class="title-navigation">
                            <ul>
                                <li><a href="#" onClick="alert('about')">about</a></li>
                                <li><a href="#" onClick="alert('work')">work</a></li>
                                <li><a href="#" onClick="alert('contacts')">contacts</a></li>
                                <li><a href="#" onClick="alert('impressum')">impressum</a></li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td class="title-content">
                            <AlphaTextBox class="movie-short-description" text={description_text} />
                        </td>
                    </tr>
                    <tr>
                        <td class="title-footer">
                            ++ Ingo Scheel Kameramann I DOP fГјr:  Imagefilm I Werbung I Spielfilm I Dokumentarfilm I KГ¶ln ++
                        </td>
                    </tr>
                </TitleColoredTable>


                <div class="title-header">
                    <BracketTextBox className="page-name" text={page_name} />
                    <span class="movie-title">{large_name}</span>
                    <span class="movie-genre">{small_name}</span>
                </div>

                <div className="scroll-message">
                    +++ Scroll and click to discover +++
                </div>

            </section>
        );
    }
}

class IndexContent {
    constructor() {
        this.page_name = "";
        this.description = "THIS IS DSC";
        this.large_name = "";
        this.small_name = "";
        this.img_back = "";
        this.img_front = "";
        this.color = "#ffffff";
    }

    parseAllMoviesData(data) {
        this.page_name = this.padIntegerWithZeros(data.movie_count, 2);
        this.large_name = data.name;
        this.small_name = data.genre;
        this.img_front = asset(data.logo);
        this.color = data.color;
    }

    padIntegerWithZeros(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }
}