import React from 'react';
var $ = require('jquery');

import TransitionStore from '../stores/TransitionStore';
import SmallDescription from './MoviePage/SmallDescription';
import FullDescription from './MoviePage/FullDescription';

export default class MoviePage extends React.Component {
    componentDidMount() {
        var tl = this.props.sharedTimeline;

        this.state = {
            small_description: null,
            large_description: null
        };

        var $this = $("#Movie" + this.props.movieId)[0];

        switch ( this.props.from ) {
            case TransitionStore.INDEX_PAGE:
                TweenLite.set($this, {top: '100%'});
                tl.to($this, 1, {delay:-0.5, top: '0'});
                break;
            case TransitionStore.MOVIE_PAGE_RIGHT:
                console.log('RIGHT');
                TweenLite.set($this, {left: '100%'});
                tl.to($this, 1, {delay:-0.5, left: '0'});
                break;
            case TransitionStore.MOVIE_PAGE_LEFT:
                console.log('LEFT');
                TweenLite.set($this, {left: '100%'});
                tl.to($this, 1, {delay:-0.5, left: '0'});
                break;

        }
    }

    componentWillMount() {
        this.setState({small_description: <SmallDescription projectName="This is test project" />});
    }

    prevMovieClick(event) {
        event.preventDefault();

        var $this = $("#Movie" + this.props.movieId);

        var tl = new TimelineLite();

        tl.to($this, 1, {x: "100%", onComplete: ()=>{
            $this.style["display"] = "none";
        }});

        return false;
    }

    nextMovieClick(event) {
        event.preventDefault();

        var movie_id = this.props.movieId;

        var $this = $("#Movie" + movie_id)[0];
        var cover = document.createElement('div');
        cover.classList.add('movie-curtain');
        cover.style['right'] = 0;
        $this.appendChild(cover);


        var tl = new TimelineLite();

        tl.to(cover, 1, {width: "100%", onComplete: ()=>{
            $this.style["display"] = "none";
        }});

        TransitionStore.makeTransition(
            TransitionStore.MOVIE_PAGE_RIGHT,
            TransitionStore.MOVIE_PAGE_RIGHT,
            tl,
            {to_movie_id: 2}
        );

        return false;
    }

    render() {
        var small_description = this.state.small_description || "component dsc is not set";
        var full_description = <FullDescription />;

        var name = this.props.projectName;
        console.log(name);

        var next_click = this.props.onNextMovieClick;
        var prev_click = this.props.onPrevMovieClick;

        var id = "Movie" + this.props.movieId;

        return (
            <div id={id} class="content">

                <section class="project-title">
                    <div class="project-main-image"></div>

                    <div class="default-side-padding movie-title-section">
                        <h1>{name}</h1>
                        <div class="movies-nav">
                            <a href="http://ya.ru" onClick={this.prevMovieClick.bind(this)} class="arrow right">⟵</a>
                            <a href="http://ya.ru" onClick={this.nextMovieClick.bind(this)} class="arrow left">⟶</a>
                        </div>
                    </div>
                </section>

                { small_description }

                { full_description }

                <footer class="default-side-padding project-footer">
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                    <a href="#goTop">Contact</a>
                </footer>

            </div>
            );
    }
}