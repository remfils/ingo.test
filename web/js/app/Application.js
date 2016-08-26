import React from 'react';

import IndexPage from './pages/IndexPage';
import MoviePage from './pages/MoviePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import WorksPage from './pages/WorksPage';
import TransitionStore from './stores/TransitionStore';
import { asset, createCountdownCallback } from './funcitons';
import config from './config';

import ShortProjectModel from './models/ShortProjectModel';

var $ = require('jquery');

const URL_INDEX = "";
const URL_MOVIE = "movie/";
const URL_CONTACTS = "contacts";
const URL_ABOUT = "about";
const URL_WORKS = "works";

export default class Application extends React.Component {
    constructor() {
        super();

        this.flip = true;

        this.movies = [];

        this.state = {
            pages: []
        };
    }

    componentWillMount() {
        TransitionStore.on("leave", this.leavePageListener.bind(this));

        $.ajax({
            url: config.SITE_NAME + 'api/all-movies',
            dataType: 'json',
            success: (data) => {
                this.movies = data.map((item, index) => {
                    var content = new ShortProjectModel();

                    content.parseJsonData(item);
                    content.page_name = index + 1;

                    return content;
                });

                if (this.props.onAjaxLoaded)
                    this.props.onAjaxLoaded();

                this.route();
            },
            error: (err) => {
                console.log('ERROR:  ' + err);
            }
        });


    }

    route() {
        var domain = config.SITE_NAME;
        var url = document.URL;

        if ( url == domain + URL_INDEX ) {

            this.pushPage(
                <IndexPage movies={this.movies} />
            );
        }
        else if ( url.indexOf(URL_MOVIE) !== -1 ) {
            var movie_index = url.indexOf(URL_MOVIE) + URL_MOVIE.length;

            var id = url.slice(movie_index);
            var index = 0;

            var i = this.movies.length;
            while (i--) {
                if (this.movies[i].id === id) {
                    index = i;
                    break;
                }
            }

            this.pushPage(
                <MoviePage
                    app={this}
                    current_movie_index={index}
                    movies={this.movies} />
            );
        }
        else if (url.indexOf(URL_CONTACTS) !== -1) {
            if (this.props.onAjaxLoaded)
                this.props.onAjaxLoaded();

            this.pushPage(<ContactPage />);
        }
        else if (url.indexOf(URL_ABOUT) !== -1) {
            if (this.props.onAjaxLoaded)
                this.props.onAjaxLoaded();

            this.pushPage(<AboutPage />);
        }
        else if (url.indexOf(URL_WORKS) !== -1) {
            if (this.props.onAjaxLoaded)
                this.props.onAjaxLoaded();

            this.pushPage(<WorksPage movies={this.movies} />);
        }
    }

    setUrl(url) {
        window.history.pushState({}, '', url);
    }

    pushPage(page) {
        var pages = [].concat(this.state.pages);
        pages.push(page);

        this.setState({
            pages: pages
        });
    }

    shiftPage() {
        var pages = [].concat(this.state.pages);
        pages[pages.length-2] = null;

        this.setState({
            pages: pages
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

        var page = <div></div>;

        transition.callback = this.shiftPage.bind(this);

        switch ( transition.type ) {
            case "INDEX-MOVIE":
                var prev_page = transition.prev_page;
                var content = prev_page.content;
                var current_content = prev_page.state.current_content;

                var movies = [];
                var current_movie_index = content.indexOf(current_content);

                console.log("DEBUG(leavePageListener): movies", content);

                var movie = movies[0];

                this.setUrl('/movie/' + current_content.id);

                page = <MoviePage
                    app={this}
                    current_movie_index={current_movie_index}
                    movies={this.movies}
                    transition={transition}/>;

                break;
            case "WORKS-MOVIE":
                var current_movie_index = transition.movie_index;

                this.setUrl('/movie/' + this.movies[current_movie_index].id);

                page = <MoviePage
                    app={this}
                    current_movie_index={current_movie_index}
                    movies={this.movies}
                    transition={transition}/>;
                break;
            case "MOVIE-INDEX":
                var prev_page = transition.prev_page;
                var movies = prev_page.short_models;

                this.setUrl('/');

                page = <IndexPage
                    movies={this.movies}
                    current_content_index={prev_page.current_movie_index}
                    transition={transition}/>;
                break;
            case "INDEX-CONTACTS":
            case "ABOUT-CONTACTS":
            case "WORKS-CONTACTS":
                this.setUrl('/contacts');
                page = <ContactPage transition={transition} />;
                break;
            case "CONTACTS-INDEX":
            case "ABOUT-INDEX":
            case "WORKS-INDEX":
                this.setUrl('/');
                page = <IndexPage movies={this.movies} transition={transition} />;
                break;
            case "INDEX-ABOUT":
            case "CONTACTS-ABOUT":
            case "WORKS-ABOUT":
                this.setUrl('/about');
                page = <AboutPage transition={transition} />;
                break;
            case "INDEX-WORKS":
            case "CONTACTS-WORKS":
            case "ABOUT-WORKS":
            case "MOVIE-WORKS":
                this.setUrl('/works');
                page = <WorksPage movies={this.movies} transition={transition} />;
                break;
        }

        this.pushPage(page);
    }

    render() {
        console.debug("DEBUG(App.Render): ", this.state.pages);

        return (
            <main>
                { this.state.pages }
            </main>
            );
    }
}