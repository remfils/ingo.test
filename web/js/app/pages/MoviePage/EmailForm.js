import React from "react";

import {notReadyYet} from '../../funcitons.js';
import config from '../../config';

var $ = require('jquery');

const POST_URL = 'api/email';

export default class EmailForm extends React.Component {
    static box_counter = 0;

    static STATE_INIT = 'FORM_STATE_INIT';
    static STATE_MESSAGE_IS_SENDING = 'FORM_STATE_MESSAGE_IS_SENDING';
    static STATE_MESSAGE_SEND_FAILED = 'FORM_STATE_MESSAGE_SEND_FAILED';
    static STATE_MESSAGE_IS_SENT = 'FORM_STATE_MESSAGE_IS_SENT';

    constructor() {
        super();

        EmailForm.box_counter ++;

        this.state = {
            form_state: EmailForm.STATE_INIT
        };

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

        this.setState({
            form_state: EmailForm.STATE_MESSAGE_IS_SENDING
        });

        var post_data = $('.email-form').serialize();

        console.debug('sendenClickListener: sending ', post_data);

        $.ajax({
            url: config.SITE_NAME + POST_URL,
            dataType: 'json',
            data: post_data,
            success: (response) => {
                if (response.messageIsSent) {
                    this.setState({form_state: EmailForm.STATE_MESSAGE_IS_SENT});
                }
            },
            error: (err) => {
                this.setState({form_state: EmailForm.STATE_MESSAGE_SEND_FAILED});
                console.log('ERROR:  ' + err);
            }
        });

        return false;
    }

    render() {
        var senden_text = 'SENDEN';
        var response_msg = '';

        console.debug(this.state.form_state);

        if (this.state.form_state === EmailForm.STATE_MESSAGE_IS_SENDING) {
            senden_text = 'SENDEN...';
        }

        if (this.state.form_state === EmailForm.STATE_MESSAGE_SEND_FAILED) {
            response_msg = <h2>sending message failed</h2>;
        }

        if (this.state.form_state === EmailForm.STATE_MESSAGE_IS_SENT) {
            response_msg = <h2>message is sent</h2>;
        }

        return <form id={this._id} className={"email-form " + this.props.className}>
            <h1>LET'S TALK</h1>

            {response_msg}

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
                <input type="submit" value={senden_text} onClick={this.sendenClickListener.bind(this)}/>
            </div>

            <p>++ Ingo Scheel Kameramann I DOP für: Imagefilm I Werbung I Spielfilm I Dokumentarfilm I Köln ++</p>

        </form>;
    }
}