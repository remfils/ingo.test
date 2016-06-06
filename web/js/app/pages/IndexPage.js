import React from "react";
//import "gsap";
var $ = require('jquery');

import config from '../config';
import TransitionStore from '../stores/TransitionStore';
import * as TransitionActions from '../actions/TransitionActions';
import { asset } from "../funcitons";
import AlphaTextBox from "./components/AlphaTextBox";

export default class IndexPage extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        var animated_bar = $('.animated-bar');
        var loading_msg = $('.index-loading-message');
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

                console.log(this.content);

                /*this.setState({
                    current_content: this.content[0]
                });*/
            },
            error: (err) => {
                console.log('error ' + err);
            }
        });
    }

    render() {
        var content = /*this.state.current_content |*/ new IndexContent();

        if ( !this.state.current_content ) {
            content.page_name = "test";
            content.description = "Bürstner war ein besonderes Projekt."
                + "Die Aufgabe: Einen emotionalen Imagefilm für das Reisemobilunternehmen herzustellen."
                + "Dafür sind wir nach Südfrankreich gefahren und haben dort vor einer großartigen Landschaft eine anstrengende aber auch (...)";

            content.large_name = "The Large Name";
            content.small_name = "Something Smaller";
            content.img_back = "img/movies/Frame_Poldi-4.png";
            content.img_front = "img/movies/Frame_Poldi-4.png";
            content.color = "#ffffff";
        }

        var img_1_url = content.img_back,
            img_2_url = content.img_front,
            img_3_url = "img/movies/Frame_Poldi-4.png";

        var page_name = content.page_name;
        var large_name = content.large_name;
        var small_name = content.small_name;

        var description_text = content.description;

        return (
            <section id='IndexPage' class='title-container'>
                <img id="TitleBackgroundImage1" class="background-image" src={img_1_url} alt="alt image text" />

                <img id="TitleBackgroundImage2" class="background-image" src={img_2_url} alt="alt image text" />

                <img id="TitleBackgroundImage3" class="background-image" src={img_3_url} alt="alt image text" />

                <table class="title-project-dsc">
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
                            ++ Ingo Scheel Kameramann I DOP für:  Imagefilm I Werbung I Spielfilm I Dokumentarfilm I Köln ++
                        </td>
                    </tr>
                </table>

                <div class="title-header">
                    <span class="page-name">[{page_name}]</span>
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
        this.description = "";
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