import React from 'react';

import IndexPage from './pages/IndexPage';
import MoviePage from './pages/MoviePage';
import TransitionStore from './stores/TransitionStore'

export default class Application extends React.Component {
    constructor() {
        super();

        this.state = {};

        this.state.pages = [];
        this.state.pages.push(<IndexPage />);

        this.movies = [
            {id: 1, name:"INSULINE MEDICAL - INSUPAD <span class=\"project-year\">2001</span>", logo:""},
            {id: 2, name:"This is a test name", logo:""}
        ]
    }

    componentWillMount() {
        TransitionStore.on("leave", this.leavePageListener.bind(this));
    }

    gotoMovie(from, shared_timeline) {

    }

    leavePageListener() {
        var transition = TransitionStore.current_transition;

        console.log(transition);

        switch ( transition.to ) {
            case TransitionStore.MOVIE_PAGE:
            case TransitionStore.MOVIE_PAGE_RIGHT:
                var movie_id = transition.params.to_movie_id || "1";
                var name = this.movies.filter((obj)=>{obj.id == movie_id});

                var page = <MoviePage
                    key={movie_id}
                    movieId={movie_id}
                    projectName={name}
                    from={transition.from}
                    sharedTimeline={transition.sharedTimeline}/>;
                break;
        }

        this.state.pages.push(page);

        this.setState({pages: this.state.pages});
    }

    render() {
        return (
            <main>
                { this.state.pages }
            </main>
            );
    }
}