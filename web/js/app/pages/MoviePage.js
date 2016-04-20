import React from 'react';
var $ = require('jquery');

export default class MoviePage extends React.Component {
    componentDidMount() {
        var tl = this.props.sharedTimeline;

        tl.to($('#MoviePage0'), 1, {y: '-100%'});
    }

    render() {
        //var movie_name = this.props.movie;

        return (
            <section id="MoviePage0" class="content">
                <div>
                    <h1>Hello</h1>
                </div>
            </section>
            );
    }
}