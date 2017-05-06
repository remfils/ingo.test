import React from "react";

import {notReadyYet} from '../../funcitons.js';
import config from '../../config';

var $ = require('jquery');

const POST_URL = 'api/send-email';

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

        if (!this.validate())
            return false;
  
        var post_data = $('.email-form').serialize();
        console.debug('sendenClickListener: sending ', post_data);

        $.ajax({
            url: config.SITE_NAME + POST_URL,
            dataType: 'json',
            data: post_data,
            method: 'POST',
            success: (response) => {
                if (response.messageIsSent) {
                    this.setState({form_state: EmailForm.STATE_MESSAGE_IS_SENT});
                }
            },
            error: (err) => {
                this.setState({form_state: EmailForm.STATE_MESSAGE_SEND_FAILED});
                console.debug('ERROR:  ', err);
            }
        });

        return false;
    }

    validate() {
        var $form = $('.email-form');
        var name_value  = $form.find('*[name="name"]').val();
        var email_value = $form.find('*[name="email"]').val();
        var message_value = $form.find('*[name="message"]').val();
    
        if (!name_value || !email_value || !message_value){
            this.setState({form_state: EmailForm.STATE_MESSAGE_SEND_FAILED});
            return false;
        }

        var email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email_re.test(email_value)) {
            this.setState({form_state: EmailForm.STATE_MESSAGE_SEND_FAILED});
            return false;
        }
        
        return true;
    }

    render() {
        var senden_text = 'SENDEN';
        var response_msg = '';

        console.debug(this.state.form_state);

        if (this.state.form_state === EmailForm.STATE_MESSAGE_IS_SENDING) {
            senden_text = 'SENDEN...';
        }

        if (this.state.form_state === EmailForm.STATE_MESSAGE_SEND_FAILED) {
          response_msg = <span class="email-reponse-message"><strong>ERROR</strong></span>;
        }

      if (this.state.form_state === EmailForm.STATE_MESSAGE_IS_SENT) {
        if (window.lang === 'de') {
          response_msg = <span class="email-response-message">
            <strong>VIELEN DANK! </strong>
            Wir haben Ihre Nachricht erhalten.
            </span>;
        }
        else {
          response_msg = <span class="email-response-message">
            <strong>THANK YOU! </strong>
            We have received your message.
            </span>;
        }
        }

        return <form id={this._id} className={"email-form " + this.props.className}>
            <h1>LET'S TALK</h1>

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

{response_msg}
            </div>

            <p>++ Ingo Scheel Kameramann I DOP für: Imagefilm I Werbung I Spielfilm I Dokumentarfilm I Köln ++</p>

        </form>;
    }
}
