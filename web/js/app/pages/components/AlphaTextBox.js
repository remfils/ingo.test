import React from "react";

var $ = require('jquery');

export default class AlphaTextBox extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        this.text_before = "";
        this.text = "";

        AlphaTextBox.box_counter ++;

        this.id = "AlphaTextBox" + AlphaTextBox.box_counter;

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
        var $this = $(this.id);

        this.text_before = this.props.text;
        this.text = nextProps.text;

        TweenLite.to($this, 1, {opacity: 0, onComplete: () => {
            this.text_before = "";

            this.setState({
                is_transition: true
            });

            TweenLite.to($this, 1, {opacity: 1, onComplete: () => {console.log("all completed")}})
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

        console.log("AlphaTextBox rendered");

        return <div id={this._id} className={this.props.className} >
            {text}
        </div>;
    }
}