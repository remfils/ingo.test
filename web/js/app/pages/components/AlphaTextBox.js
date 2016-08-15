import React from "react";

var $ = require('jquery');

export default class AlphaTextBox extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        AlphaTextBox.box_counter ++;

        this.id = "AlphaTextBox" + AlphaTextBox.box_counter;
    }

    get id() {
        return "#" + this._id;
    }

    set id(val) {
        this._id = val;
    }

    componentWillMount() {
        this.setState({
            text: this.props.text
        });
    }

    componentShouldUpdate(nextProps, nextState) {
        if (this.props.text == nextProps.text) {
            return false;
        }

        return super.componentShouldUpdate(nextProps, nextState);
    }

    componentWillUpdate(nextProps, nextState) {
        var $this = $(this.id);

        var text = nextProps.text;

        TweenLite.to($this, 1, {opacity: 0, onComplete: () => {

            this.setState({text: text});

            TweenLite.to($this, 1, {opacity: 1, onComplete: () => {console.log("all completed")}})
        }});
    }

    render() {
        var text = this.state.text;

        return <div id={this._id} className={this.props.className} >
            {text}
        </div>;
    }
}