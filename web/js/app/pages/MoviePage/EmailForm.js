import React from "react";

import {notReadyYet} from '../../funcitons.js';

var $ = require('jquery');

export default class EmailForm extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        EmailForm.box_counter ++;

        this.id = "EmailForm" + EmailForm.box_counter;
    }

    get id() {
        return "#" + this._id;
    }

    set id(val) {
        this._id = val;
    }

    sendenClickListener(e) {
        e.preventDefault();

        notReadyYet("Sended Click");

        return false;
    }

    render() {
        return <form id={this._id} className={this.props.className}>
            <h1>LET’S TALK…</h1>

            <div class="custom-form-gruop">
                <label for="name">Name*</label>
                <input name="name" type="text" />
            </div>

            <div class="custom-form-gruop">
                <label for="email">E-Mail*</label>
                <input name="email" type="text" />
            </div>

            <div class="custom-form-gruop">
                <label for="message">Nachricht</label>
                <textarea name="message" id="UserMessage" rows="2"></textarea>
            </div>

            <div class="custom-form-gruop">
                <input type="submit" value="SENDEN" onClick={this.sendenClickListener.bind(this)}/>
            </div>

            <p>++ Ingo Scheel Kameramann I DOP für: Imagefilm I Werbung I Spielfilm I Dokumentarfilm I Köln ++</p>

        </form>;
    }
}