import React from "react";

import { createNotReadyYetFunction } from "../../funcitons";

var $ = require('jquery');

export default class NavigationMenu extends React.Component {
    render() {
        return <ul>
            <li><a href="#" onClick={createNotReadyYetFunction("news")}>news</a></li>
            <li><a href="#" onClick={createNotReadyYetFunction("work")}>work</a></li>
            <li><a href="#" onClick={createNotReadyYetFunction("about")}>about</a></li>
            <li><a href="#" onClick={createNotReadyYetFunction("contact")}>contacts</a></li>
        </ul>;
    }
}