import React from "react";

import { asset, notReadyYet, createNotReadyYetFunction } from "../../funcitons";
import * as TransitionActions from "../../actions/TransitionActions";
import * as ClickActions from "../../actions/ClickActions";
import ClickStore from "../../stores/ClickStore";

var $ = require('jquery');

export default class NavigationMenu extends React.Component {

    static PAGE_INDEX = 'INDEX';
    static PAGE_WORKS = 'WORKS';
    static PAGE_ABOUT = 'ABOUT';
    static PAGE_CONTACTS = 'CONTACTS';
    static PAGE_IMPRESSUM = 'IMPRESSUM';

    constructor (props) {
        super(props);

        this.clickMenuItemListener = this.clickMenuItemListener.bind(this);

        this.state = {
            page_name: null
        };
    }

    componentWillMount() {
        ClickStore.on(ClickStore.EVENT_CLICK_MENU_ITEM, this.clickMenuItemListener);
    }

    componentWillUnmount() {
        ClickStore.removeListener(ClickStore.EVENT_CLICK_MENU_ITEM, this.clickMenuItemListener);
    }

    clickMenuItemListener(data) {
        if (!data)
            return;

        this.setState({
            page_name: data.to
        });
    }

    createClickFunctionForPage(page_name) {
        var self = this;

        return function(e) {
            e.preventDefault();

            if (page_name == self.props.page_name)
                return false;

            self.setState({page_name});

            TransitionActions.createTitleTransition(self.props.page_name, page_name, self.props.current_page);

            return false;
        }
    }

    titleMenuClickListener(e) {
        e.preventDefault();

        ClickActions.clickTitleMenu();

        return false;
    }

    render() {
        var page_name = this.state.page_name || this.props.page_name;

        return <div class='title-menu'>
                <ul>
                    <li><a href="#" class={page_name === NavigationMenu.PAGE_INDEX ? 'active' : ''} onClick={this.createClickFunctionForPage(NavigationMenu.PAGE_INDEX)}>news</a></li>
                    <li><a href="#" class={page_name === NavigationMenu.PAGE_WORKS ? 'active' : ''} onClick={this.createClickFunctionForPage(NavigationMenu.PAGE_WORKS)}>work</a></li>
                    <li><a href="#" class={page_name === NavigationMenu.PAGE_ABOUT ? 'active' : ''} onClick={this.createClickFunctionForPage(NavigationMenu.PAGE_ABOUT)}>about</a></li>
                    <li><a href="#" class={page_name === NavigationMenu.PAGE_CONTACTS ? 'active' : ''} onClick={this.createClickFunctionForPage(NavigationMenu.PAGE_CONTACTS)}>contact</a></li>
                </ul>
                <span class='btn-menu'><img src={asset('img/button-menu.png')} alt="" onClick={this.titleMenuClickListener.bind(this)}/></span>
            </div>;
    }
}
