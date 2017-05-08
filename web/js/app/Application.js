import React from 'react';

import IndexPage from './pages/IndexPage';
import MoviePage from './pages/MoviePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import WorksPage from './pages/WorksPage';
import ImpressumPage from './pages/ImpressumPage';
import TransitionStore from './stores/TransitionStore';
import { asset, createCountdownCallback, changeUrl, prev_url } from './funcitons';
import {createTransition, backTransition} from './actions/TransitionActions';
import config from './config';

import ShortProjectModel from './models/ShortProjectModel';

var $ = require('jquery');

const URL_INDEX = "";
const URL_MOVIE = "movie/";
const URL_CONTACTS = "contacts";
const URL_ABOUT = "about";
const URL_WORKS = "works";
const URL_IMPRESSUM = "impressum";

export default class Application extends React.Component {
    constructor() {
        super();

        this.flip = true;

        this.movies = [];

        this.is_transition = false;

        this.state = {
            pages: []
        };

        this.history = [];
        this.history.push(window.location.toString());

        this.back_route_queue = [];
        
        $(window).on('popstate', this.onPopStateListener.bind(this));
    }

    onPopStateListener(e) {
        if (prev_url === current_url)
            return;
        
        var current_url = window.location.toString();

        var route_obj = this.urlToTransitionEventPart(current_url);

        if (this.is_transition) {
            this.back_route_queue.push(route_obj);
            return;
        }

        backTransition(route_obj.route, {
            route_params: route_obj.route_rest
        });

    }

    urlToTransitionEventPart(url) {
        var route, route_rest;
        var url = url.split('/');
        url.splice(0, 3);

        if (!url[0]) {
            route = "INDEX";
        }
        else {
            route = url[0].toUpperCase();

            if (url.length > 1) {
                route_rest = url;
            }
        }

        return { route, route_rest };
    }

    shiftBackQueue() {
        if (this.back_route_queue.length === 0)
            return;
        
        var route_obj = this.back_route_queue.shift();

        backTransition(route_obj.route, {
            route_params: route_obj.route_rest
        });
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

    generatePageKey() {
        return 'Page_' + (new Date()).getTime();
    }

    route() {
        var domain = config.SITE_NAME;
        var url = document.URL;
        var page_key = this.generatePageKey();


        if ( url == domain + URL_INDEX ) {

            this.pushPage(
                <IndexPage key={page_key} movies={this.movies} lang={this.props.lang} />
            );
        }
        else if ( url.indexOf(URL_MOVIE) !== -1 ) {
            var movie_index = url.indexOf(URL_MOVIE) + URL_MOVIE.length;

            var id = url.slice(movie_index);
            var index = 0;

            var i = this.movies.length;
            while (i--) {
                if (this.movies[i].url === id) {
                    index = i;
                    break;
                }
            }

            this.pushPage(
                <MoviePage
                    key={page_key}
                    app={this}
                    lang={this.props.lang}
                    current_movie_index={index}
                    movies={this.movies} />
            );
        }
        else if (url.indexOf(URL_CONTACTS) !== -1) {
            if (this.props.onAjaxLoaded)
                this.props.onAjaxLoaded();

            this.pushPage(<ContactPage key={page_key} lang={this.props.lang} />);
        }
        else if (url.indexOf(URL_ABOUT) !== -1) {
            if (this.props.onAjaxLoaded)
                this.props.onAjaxLoaded();

            this.pushPage(<AboutPage key={page_key} lang={this.props.lang} />);
        }
        else if (url.indexOf(URL_WORKS) !== -1) {
            if (this.props.onAjaxLoaded)
                this.props.onAjaxLoaded();

            this.pushPage(<WorksPage key={page_key} movies={this.movies} lang={this.props.lang} />);
        }
        else if (url.indexOf(URL_IMPRESSUM) !== -1) {
            if (this.props.onAjaxLoaded)
                this.props.onAjaxLoaded();

            this.pushPage(<ImpressumPage key={page_key} lang={this.props.lang}/>);
        }
    }

    setUrl(url) {
        url = url.substr(1);
        changeUrl(url);
        this.history.push(window.location.toString());

        console.log("SET_URL: ", this.history)
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
        if (this.is_transition)
            return;

        var page_key = this.generatePageKey();

        this.is_transition = true;

        var transition = TransitionStore.current_transition;

        console.log(transition);

        var page = <div></div>;

        transition.callback = () => {
            this.is_transition = false;
            this.shiftPage();

            this.shiftBackQueue();
        };

        switch ( transition.type ) {
            case "INDEX-MOVIE":
                var prev_page = transition.prev_page;
                var content = prev_page.content;
                var current_content = prev_page.state.current_content;

                var movies = [];
                var current_movie_index = content.indexOf(current_content);

                console.log("DEBUG(leavePageListener): movies", content);

                var movie = movies[0];

                if (!transition.back)
                    this.setUrl('/movie/' + current_content.url);

                page = <MoviePage
                    key={page_key}
                    app={this}
                    lang={this.props.lang}
                    current_movie_index={current_movie_index}
                    movies={this.movies}
                    transition={transition}/>;

                break;
            case "WORKS-MOVIE":
                var movie_id = transition.movie_id;
                var movies = this.movies;
                var i = movies.length;
                while (i--) {
                    if (movies[i].id === movie_id) {
                        break;
                    }
                }
                var current_movie_index = i;

                if (!transition.back)
                    this.setUrl('/movie/' + this.movies[current_movie_index].url);

                page = <MoviePage
                    key={page_key}
                    app={this}
                    lang={this.props.lang}
                    current_movie_index={current_movie_index}
                    movies={this.movies}
                    transition={transition}/>;
                break;
            case "MOVIE-INDEX":
                var prev_page = transition.prev_page;
                var movies = prev_page.short_models;

                if (!transition.back)
                    this.setUrl('/');

                page = <IndexPage
                key={page_key}
                lang={this.props.lang}
                movies={this.movies}
                current_content_index={prev_page.current_movie_index}
                transition={transition}/>;
                break;
            case "INDEX-CONTACTS":
            case "ABOUT-CONTACTS":
            case "WORKS-CONTACTS":
            case "IMPRESSUM-CONTACTS":
                if (!transition.back)
                    this.setUrl('/contacts');
                page = <ContactPage key={page_key} transition={transition} lang={this.props.lang}/>;
                break;
            case "CONTACTS-INDEX":
            case "ABOUT-INDEX":
            case "WORKS-INDEX":
            case "IMPRESSUM-INDEX":
                if (!transition.back)
                    this.setUrl('/');
                page = <IndexPage key={page_key} movies={this.movies} transition={transition} lang={this.props.lang} />;
                break;
            case "INDEX-ABOUT":
            case "CONTACTS-ABOUT":
            case "WORKS-ABOUT":
            case "IMPRESSUM-ABOUT":
                if (!transition.back)
                    this.setUrl('/about');
                
                page = <AboutPage key={page_key} transition={transition} lang={this.props.lang} />;
                break;
            case "INDEX-WORKS":
            case "CONTACTS-WORKS":
            case "ABOUT-WORKS":
            case "MOVIE-WORKS":
            case "IMPRESSUM-WORKS":
                if (!transition.back)
                    this.setUrl('/works');
                
                page = <WorksPage key={page_key} movies={this.movies} transition={transition} lang={this.props.lang} />;
                break;
            case "INDEX-IMPRESSUM":
            case "CONTACTS-IMPRESSUM":
            case "ABOUT-IMPRESSUM":
            case "WORKS-IMPRESSUM":
                if (!transition.back)
                    this.setUrl('/impressum');
                
                page = <ImpressumPage key={page_key} transition={transition} lang={this.props.lang} />;
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
