import React from "react";

import { asset, notReadyYet, createNotReadyYetFunction } from "../../funcitons";
import * as TransitionActions from "../../actions/TransitionActions";

var $ = require('jquery');

export default class SiteMap extends React.Component {
    static PAGE_INDEX = 'INDEX';
    static PAGE_WORKS = 'WORKS';
    static PAGE_ABOUT = 'ABOUT';
    static PAGE_CONTACTS = 'CONTACTS';
    static PAGE_IMPRESSUM = 'IMPRESSUM'

    constructor () {
        super();

        this.state = {
            page_name: null
        };
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

    closeButtonClickListener(e) {
        e.preventDefault();

        return false;
    }

    render() {
        var page_name = this.state.page_name || this.props.page_name;
        var lang = this.props.lang;

        return <div class='site-map'>
            <div className="close-btn-container">
                <img src={asset('img/button-close.png')} alt="" class="close-btn" onClick={this.closeButtonClickListener.bind(this)}/>
            </div>

            <div class="lang-menu">
                <span class={lang === 'DE' ? 'active' : ''}><a href="#">DE</a></span>
                <span> - </span>
                <span class={lang === 'EN' ? 'active' : ''}><a href="#">EN</a></span>
            </div>

            <ul>
                <li><a href="#" class={page_name === SiteMap.PAGE_INDEX ? 'active' : ''} onClick={this.createClickFunctionForPage(SiteMap.PAGE_INDEX)}>NEWS</a></li>
                <li><a href="#" class={page_name === SiteMap.PAGE_WORKS ? 'active' : ''} onClick={this.createClickFunctionForPage(SiteMap.PAGE_WORKS)}>WORK</a></li>
                <li><a href="#" class={page_name === SiteMap.PAGE_ABOUT ? 'active' : ''} onClick={this.createClickFunctionForPage(SiteMap.PAGE_ABOUT)}>ABOUT</a></li>
                <li><a href="#" class={page_name === SiteMap.PAGE_CONTACTS ? 'active' : ''} onClick={this.createClickFunctionForPage(SiteMap.PAGE_CONTACTS)}>CONTACT</a></li>
                <li><a href="#" class={'small ' + (page_name === SiteMap.PAGE_CONTACTS ? 'active' : '')} onClick={this.createClickFunctionForPage(SiteMap.PAGE_CONTACTS)}>IMPRESSUM</a></li>
            </ul>

            <div class='description'>
                <p>Ingo Scheel   Kameramann I DOP</p>
                <p>visual concepts</p>
            </div>
        </div>;
    }
}