import React from 'react';

import IndexPage from './pages/IndexPage';
import MoviePage from './pages/MoviePage';
import TransitionStore from './stores/TransitionStore';
import { asset } from './funcitons';
import config from './config';

var $ = require('jquery');

export default class Application extends React.Component {
    constructor() {
        super();

        this.flip = true;

        this.state = {
            first_page: <IndexPage />,
            second_page: null
        };

        this.state.pages = [];
        this.state.pages.push(<IndexPage />);

        this.movies = [];

        /*this.movies = [
            {
                id: 1,
                name:"INSULINE MEDICAL - INSUPAD",
                year: "2001",
                logo: asset("img/movies/InsuPad-6.png"),
                color: "#cbfdcb"
            },
            {
                id: 2,
                name:"Renault Twizzy Brand Campaign",
                year: "2012",
                logo: asset("img/movies/Frame_Renault-5.png"),
                color: "#ccf6e2"
            }
        ]*/
    }

    componentWillMount() {
        TransitionStore.on("leave", this.leavePageListener.bind(this));

        $.ajax({
            url: config.SITE_NAME + 'api/all-movies',
            dataType: 'json',
            success: (data) => {
                console.log('finished of downloading movies: ' + data.table);
                data.forEach((item) => {
                    item.logo = asset(item.logo);
                });

                console.log(data);

                this.movies = data;
            },
            error: (err) => {
                console.log('error ' + err);
            }
        });
    }

    gotoMovie(from, shared_timeline) {

    }

    prepareNextPageForTransition(page) {
        console.log("prepare");

        if ( this.flip ) {
            this.setState({second_page: page});
        }
        else {
            this.setState({first_page: page});
        }
    }

    switchPagesAfterTransition() {
        console.log("switch");
        if ( this.flip ) {
            this.setState({ first_page: null });
        }
        else {
            this.setState({ second_page: null });
        }

        this.flip = !this.flip;
    }

    leavePageListener() {
        var transition = TransitionStore.current_transition;

        console.log(transition);

        switch ( transition.type ) {
            case "INDEX-MOVIE":
            case "MOVIE-MOVIE_LEFT":
            case "MOVIE-MOVIE_RIGHT":
                var movie = transition.next_movie || this.movies[0];

                var page = <MoviePage
                    app={this}
                    movie={movie}
                    transition={transition}/>;
                break;
                break;

        }

        this.prepareNextPageForTransition(page);

        /*this.state.pages.push(page);

        this.setState({pages: this.state.pages});*/
    }

    render() {
        return (
            <main>
                { this.state.first_page }
                { this.state.second_page }
            </main>
            );
    }
}