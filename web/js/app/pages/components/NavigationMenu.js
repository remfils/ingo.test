import React from "react";

import { asset, notReadyYet, createNotReadyYetFunction } from "../../funcitons";
import * as TransitionActions from "../../actions/TransitionActions";

var $ = require('jquery');

export default class NavigationMenu extends React.Component {

    static PAGE_INDEX = 'INDEX';
    static PAGE_WORK = 'WORK';
    static PAGE_ABOUT = 'ABOUT';
    static PAGE_CONTACTS = 'CONTACTS';

    newsClickListener(e) {
        e.preventDefault();

        TransitionActions.fromContactToIndexTransition(this.props.current_page);

        return false;
    }

    createClickFunctionForPage(page_name) {
        var self = this;

        return function(e) {
            e.preventDefault();

            if (page_name == self.props.page_name)
                return false;

            TransitionActions.createTitleTransition(self.props.page_name, page_name, self.props.current_page);

            return false;
        }
    }

    contactClickListener(e) {
        e.preventDefault();

        TransitionActions.fromIndexToContactTransition(this.props.current_page);

        return false;
    }

    titleMenuClickListener(e) {
        e.preventDefault();

        notReadyYet('Menu');

        return false;
    }

    render() {
        return <div class='title-menu'>
                <ul>
                    <li><a href="#" class={this.props.page_name == NavigationMenu.PAGE_INDEX ? 'active' : ''} onClick={this.createClickFunctionForPage(NavigationMenu.PAGE_INDEX)}>news</a></li>
                    <li><a href="#" class={this.props.page_name == NavigationMenu.PAGE_WORK ? 'active' : ''} onClick={createNotReadyYetFunction("work")}>work</a></li>
                    <li><a href="#" class={this.props.page_name == NavigationMenu.PAGE_ABOUT ? 'active' : ''} onClick={createNotReadyYetFunction("about")}>about</a></li>
                    <li><a href="#" class={this.props.page_name == NavigationMenu.PAGE_CONTACTS ? 'active' : ''} onClick={this.createClickFunctionForPage(NavigationMenu.PAGE_CONTACTS)}>contacts</a></li>
                </ul>
                <span class='btn-menu' onClick={this.titleMenuClickListener.bind(this)}><img src={asset('img/button-menu.png')} alt=""/></span>
            </div>;
    }
}