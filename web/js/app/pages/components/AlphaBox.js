import React from "react";

var $ = require('jquery');

export default class AlphaBox extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        AlphaBox.box_counter ++;

        this.id = "AlphaBox" + AlphaBox.box_counter;

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

    componentWillMount() {
        var children = this.props.children;

        this.setState({
            children: children
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if ( this.props.children == nextProps.children ) {
            return;
        }

        var $this = $(this.id);

        var children = nextProps.children;

        TweenLite.to($this, 1, {opacity: 0, onComplete: () => {

            this.setState({
                is_transition: true,
                children: children
            });

            TweenLite.to($this, 1, {opacity: 1, onComplete: () => {console.log("all completed")}})
        }});
    }

    render() {
        var text = this.state.children;

        return <div id={this._id} className={this.props.className} >
            {text}
        </div>;
    }
}