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
import MovieModel from "../models/MovieModel";

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

    getContent( index ) {
        var l = this.content.length;
        if ( l == 0 ) {
            return null;
        }
        if ( index < 0 ) {
            index = l + index % l;
        }
        else if ( index >= l ) {
            index = index % l;
        }
        return this.content[index];
    }

    componentWillMount() {
        console.log(config.SITE_NAME + 'api/all-movies');
        var movie_counter = 1;

        var padIntegerWithZeros = function (num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        }

        $.ajax({
            url: config.SITE_NAME + 'api/all-movies',
            dataType: 'json',
            success: (data) => {
                this.content = data.map((item) => {
                    var movie = new MovieModel(item);

                    var content = new IndexContent();
                    content.page_name = padIntegerWithZeros(movie_counter++, 2);
                    content.setFromMovieModel(movie);
                    return content;
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

    currentMovieClickListener() {
        event.preventDefault();

        console.log("currentMovieClickListener: ", this.current_content_index);

        var movies = [];
        this.content.forEach((item, index, array)=>{
            if ( item.content_type == "movie" ) {
                movies.push(item.model);

            }
        });

        TransitionActions.fromIndexToMovieTranstion(this, {movies: movies});
    }

    render() {
        var content = this.state.current_content || new IndexContent();
        var prev_content = this.getContent(this.current_content_index - 1) || new IndexContent();

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

        console.log("PREV:", prev_content);

        var img_1_url = prev_content.getLogo() || "",
            img_2_url = content.getLogo(),
            img_3_url = "img/movies/Frame_Poldi-4.png";

        var color = content.getColor();

        var page_name = content.page_name;
        var large_name = content.getLargeName();
        var small_name = content.getSmallName();

        var description_text = content.getDescription();

        return (
            <section id='IndexPage' class='title-container'>

                <ImageRotator img_front={img_2_url} img_back={img_1_url} onClick={this.currentMovieClickListener.bind(this)} />

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
        this.logo = "";
        this.color = "#ffffff";
        this.content_type = "raw";
        this.model = null;
    }

    setFromMovieModel(model) {
        this.model = model;
        this.content_type = "movie";
    }

    getLargeName() {
        switch(this.content_type) {
            case "movie":
                return this.model.name;
                break;
            default:
                return this.large_name;
        }
    }

    getSmallName() {
        switch(this.content_type) {
            case "movie":
                return this.model.genre;
                break;
            default:
                return this.small_name;
        }
    }

    getColor() {
        switch(this.content_type) {
            case "movie":
                return this.model.color;
                break;
            default:
                return this.color;
        }
    }

    getDescription() {
        switch(this.content_type) {
            case "movie":
                return this.model.description;
                break;
            default:
                return this.description;
        }
    }

    getLogo() {
        switch(this.content_type) {
            case "movie":
                return this.model.logo;
                break;
            default:
                return this.logo;
        }
    }

    parseAllMoviesData(data) {
        //this.page_name = this.padIntegerWithZeros(data.movie_count, 2);
        this.large_name = data.name;
        this.small_name = data.genre;
        //this.img_front = asset(data.logo);
        this.logo = asset(data.logo);
        this.color = data.color;
        this.content_type = "movie";
    }
}