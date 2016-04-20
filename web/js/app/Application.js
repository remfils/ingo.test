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
    }

    componentWillMount() {
        TransitionStore.on("leave", this.leavePageListener.bind(this));
    }

    leavePageListener() {
        var transition = TransitionStore.current_transition;
        console.log(transition);
        if ( transition.to == TransitionStore.MOVIE_PAGE) {
            var page = <MoviePage from={transition.from} sharedTimeline={transition.sharedTimeline}/>
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