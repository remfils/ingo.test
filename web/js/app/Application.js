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

        this.movies = [];
    }

    componentWillMount() {
        TransitionStore.on("leave", this.leavePageListener.bind(this));
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
                var current_movie_index = 0;

                console.log("leavePageListener:", content);

                for ( var i in content ) {
                    var c = content[i];
                    if ( c.content_type == "movie" ) {
                        if ( c == current_content ) {
                            current_movie_index = movies.length;
                        }
                        movies.push(c.model);
                    }

                }

                console.log("leavePageListener:", movies);

                var movie = movies[0];

                page = <MoviePage
                    app={this}
                    current_movie_index={current_movie_index}
                    movies={movies}
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