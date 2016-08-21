import React from "react";

var $ = require('jquery');

export default class BracketTextBox extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        this.text_before = "";
        this.text = "";

        BracketTextBox.box_counter ++;

        this.id = "BracketTextBox" + BracketTextBox.box_counter;

        this.state = {
            is_transition: false
        };
    }

    get id() {
        return "#" + this._id;
    }

    set id(val) {
        this._id = val;
    }

    componentWillUpdate(nextProps, nextState) {
        var $bracket_text = $(this.id + " .in-bracket-text");

        this.text_before = this.props.text;
        this.text = nextProps.text;

        var text_width = $bracket_text.width();

        TweenLite.to($bracket_text, 1, {width: 0, onComplete: () => {
            this.text_before = "";

            this.setState({
                is_transition: true
            });

            TweenLite.set($bracket_text, {width: "auto"});

            TweenLite.from($bracket_text, 1, {width: 0, onComplete: () => {console.log("all completed")}})
        }});
    }

    render() {
        if ( !this.text ) {
            this.text = this.props.text;
        }

        var text = this.text;

        if ( this.text_before ) {
            text = this.text_before;
        }

        console.log(text);

        console.log("BracketTextBox rendered");

        return <span id={this._id} className={"bracket-text-box " + this.props.className} >
            [<span class="in-bracket-text">{text}</span>]
        </span>;
    }
}