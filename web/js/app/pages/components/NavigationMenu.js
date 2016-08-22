import React from "react";

import { createNotReadyYetFunction } from "../../funcitons";
import * as TransitionActions from "../../actions/TransitionActions";

var $ = require('jquery');

export default class NavigationMenu extends React.Component {

    contactClickListener(e) {
        e.preventDefault();

        TransitionActions.fromIndexToContactTransition(this.props.current_page);

        return false;
    }

    render() {
        return <ul>
            <li><a href="#" onClick={createNotReadyYetFunction("news")}>news</a></li>
            <li><a href="#" onClick={createNotReadyYetFunction("work")}>work</a></li>
            <li><a href="#" onClick={createNotReadyYetFunction("about")}>about</a></li>
            <li><a href="#" onClick={this.contactClickListener.bind(this)}>contacts</a></li>
        </ul>;
    }
}