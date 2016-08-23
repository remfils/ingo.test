import React from "react";

import { createNotReadyYetFunction } from "../../funcitons";
import * as TransitionActions from "../../actions/TransitionActions";

var $ = require('jquery');

export default class NavigationMenu extends React.Component {

    newsClickListener(e) {
        e.preventDefault();

        TransitionActions.fromContactToIndexTransition(this.props.current_page);

        return false;
    }

    contactClickListener(e) {
        e.preventDefault();

        TransitionActions.fromIndexToContactTransition(this.props.current_page);

        return false;
    }

    render() {
        return <ul>
            <li><a href="#" onClick={this.newsClickListener.bind(this)}>news</a></li>
            <li><a href="#" onClick={createNotReadyYetFunction("work")}>work</a></li>
            <li><a href="#" onClick={createNotReadyYetFunction("about")}>about</a></li>
            <li><a href="#" onClick={this.contactClickListener.bind(this)}>contacts</a></li>
        </ul>;
    }
}