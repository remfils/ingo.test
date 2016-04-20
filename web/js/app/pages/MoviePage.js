import React from 'react';
var $ = require('jquery');

import SmallDesctiption from './MoviePage/SmallDescription';

export default class MoviePage extends React.Component {
    componentDidMount() {
        var tl = this.props.sharedTimeline;

        this.state = {
            small_description: null,
            large_description: null
        };

        tl.to($('#MoviePage0'), 1, {delay:-1, y: '-100%'});
    }

    componentWillMount() {
        this.setState({small_description: <SmallDesctiption projectName="This is test project" />});
    }

    render() {
        var small_description = this.state.small_description || "component dsc is not set";

        return (
            <section id="MoviePage0" class="content">
                <div>
                    { small_description }
                </div>
            </section>
            );
    }
}