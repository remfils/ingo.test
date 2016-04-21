import React from 'react';

import IndexPage from './pages/IndexPage';
import MoviePage from './pages/MoviePage';
import TransitionStore from './stores/TransitionStore'

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

        this.movies = [
            {id: 1, name:"INSULINE MEDICAL - INSUPAD <span class=\"project-year\">2001</span>", logo:"img/movies/InsuPad-6.png"},
            {id: 2, name:"This is a test name", logo:"img/movies/Frame_Renault-5.png"}
        ]
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

        switch ( transition.to ) {
            case TransitionStore.MOVIE_PAGE:
            case TransitionStore.MOVIE_PAGE_RIGHT:
                var movie_id = transition.params.to_movie_id || "1";
                var movie = this.movies.filter((obj)=>{return obj.id == movie_id})[0];

                var page = <MoviePage
                    app={this}
                    movieId={movie_id}
                    projectName={movie.name}
                    logo={movie.logo}
                    from={transition.from}
                    sharedTimeline={transition.sharedTimeline}/>;
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