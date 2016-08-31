import React from "react";

import { asset, notReadyYet, createNotReadyYetFunction } from "../../funcitons";
import * as TransitionActions from "../../actions/TransitionActions";
import * as ClickActions from "../../actions/ClickActions";
import ClickStore from "../../stores/ClickStore";

var $ = require('jquery');

export default class SiteMap extends React.Component {
    static PAGE_INDEX = 'INDEX';
    static PAGE_WORKS = 'WORKS';
    static PAGE_ABOUT = 'ABOUT';
    static PAGE_CONTACTS = 'CONTACTS';
    static PAGE_IMPRESSUM = 'IMPRESSUM'

    static ITEM_COUNTER = 0;

    constructor (props) {
        super(props);

        SiteMap.ITEM_COUNTER++;

        this.id = "SiteMap" + SiteMap.ITEM_COUNTER;

        this.onMenuClickListener = this.onMenuClickListener.bind(this);

        this.state = {
            page_name: null
        };
    }

    get id () {
        return "#" + this._id;
    }

    set id (value) {
        this._id = value;
    }

    componentWillMount() {
        ClickStore.addListener(ClickStore.EVENT_CLICK_MENU, this.onMenuClickListener);
    }

    componentWillUnmount() {
        ClickStore.removeListener(ClickStore.EVENT_CLICK_MENU, this.onMenuClickListener);
    }

    onMenuClickListener() {
        this.showMenu();
    }

    componentDidMount() {
        this.$ = $(this.id).find;
        $(this.id).hide();
    }

    showMenu() {
        $(this.id).show();

        console.debug(this.id, " showMenu started!");

        this.updateCrossPosition();

        var tl = new TimelineLite();

        tl.to('.btn-menu', 0.4, {opacity: 0});

        tl.from($(this.id), 1, {opacity: 0, delay: -0.2})
            .from('.close-btn', 0.4, {opacity: 0, delay: -0.5});
    }

    updateCrossPosition() {
        var offset = $('.btn-menu').offset().left - $('.title-menu li').offset().left;
        $('.close-btn').css('margin-left', offset);
    }

    hideMenu(callback) {
        console.debug("hideMenu started!");

        var tl = new TimelineLite();

        tl.to('.close-btn', 0.4, {opacity: 0})
            .to($(this.id), 1, {opacity: 0, delay: -0.2})
            .to('.btn-menu', 0.4, {opacity: 1, delay: -0.5});

        tl.to(window, 0, {onComplete: () => {
            $(this.id).hide();

            if (callback)
                callback();
        }})
    }

    createClickFunctionForPage(page_name) {
        var self = this;

        return function(e) {
            e.preventDefault();

            if (page_name == self.props.page_name)
                return false;

            self.hideMenu(()=>{
                ClickActions.clickMenuItem(self.props.page_name, page_name);

                TransitionActions.createTitleTransition(self.props.page_name, page_name, self.props.current_page);
            });

            return false;
        }
    }

    closeButtonClickListener(e) {
        e.preventDefault();

        this.hideMenu();

        return false;
    }

    render() {
        var page_name = this.state.page_name || this.props.page_name;
        var lang = this.props.lang;

        console.debug(lang);

        return <div id={this._id} class='site-map'>
            <div className="close-btn-container">
                <img src={asset('img/button-close.png')} alt="" class="close-btn" onClick={this.closeButtonClickListener.bind(this)}/>
            </div>

            <div class="lang-menu">
                <span class={lang === 'de' ? 'active' : ''}><a href="/api/change-language/de">DE</a></span>
                <span> - </span>
                <span class={lang === 'en' ? 'active' : ''}><a href="/api/change-language/en">EN</a></span>
            </div>

            <ul>
                <li><a href="#" class={page_name === SiteMap.PAGE_INDEX ? 'active' : ''} onClick={this.createClickFunctionForPage(SiteMap.PAGE_INDEX)}>NEWS</a></li>
                <li><a href="#" class={page_name === SiteMap.PAGE_WORKS ? 'active' : ''} onClick={this.createClickFunctionForPage(SiteMap.PAGE_WORKS)}>WORK</a></li>
                <li><a href="#" class={page_name === SiteMap.PAGE_ABOUT ? 'active' : ''} onClick={this.createClickFunctionForPage(SiteMap.PAGE_ABOUT)}>ABOUT</a></li>
                <li><a href="#" class={page_name === SiteMap.PAGE_CONTACTS ? 'active' : ''} onClick={this.createClickFunctionForPage(SiteMap.PAGE_CONTACTS)}>CONTACT</a></li>
                <li><a href="#" class={page_name === SiteMap.PAGE_CONTACTS ? 'active' : ''} onClick={this.createClickFunctionForPage(SiteMap.PAGE_IMPRESSUM)}>IMPRESSUM</a></li>
            </ul>

            <div class='description'>
                <p><strong>Ingo Scheel</strong>   Kameramann I DOP</p>
                <p>visual concepts</p>
            </div>
        </div>;
    }
}