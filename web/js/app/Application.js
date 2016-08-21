import React from 'react';

import IndexPage from './pages/IndexPage';
import MoviePage from './pages/MoviePage';
import TransitionStore from './stores/TransitionStore';
import { asset } from './funcitons';
import config from './config';

var $ = require('jquery');

const URL_INDEX = "";
const URL_MOVIE = "movie/";

export default class Application extends React.Component {
    constructor() {
        super();

        this.flip = true;

        this.movies = [];
    }

    componentWillMount() {
        TransitionStore.on("leave", this.leavePageListener.bind(this));

        var domain = config.SITE_NAME;
        var url = document.URL;

        console.log(domain, url);

        if ( url == domain + URL_INDEX ) {

            this.setState({
                first_page: <IndexPage onAjaxLoaded={this.props.onAjaxLoaded} />,
                second_page: null
            });
        }
        else if ( url.indexOf(URL_MOVIE) !== -1 ) {
            var movie_index = url.indexOf(URL_MOVIE) + URL_MOVIE.length;

            var index = url.slice(movie_index);

            this.setState({
                first_page: <MoviePage
                    app={this}
                    current_movie_index={index}
                    onAjaxLoaded={this.props.onAjaxLoaded} />,
                second_page: null
            });
        }
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

        var page = <div></div>;

        switch ( transition.type ) {
            case "INDEX-MOVIE":
                var prev_page = transition.prev_page;
                var content = prev_page.content;
                var current_content = prev_page.state.current_content;

                var movies = [];
                var current_movie_index = content.indexOf(current_content);

                console.log("DEBUG(leavePageListener): movies", content);

                var movie = movies[0];

                window.history.pushState({}, '', '/movie/' + current_content.id);

                page = <MoviePage
                    app={this}
                    current_movie_index={current_movie_index}
                    movies={content}
                    transition={transition}/>;

                break;
        }

        this.prepareNextPageForTransition(page);
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