import React from "react";

var $ = require('jquery');

export default class ColoredSection extends React.Component {
    static box_counter = 0;

    constructor(props) {
        super(props);

        this.color = "#ffffff";

        ColoredSection.box_counter ++;

        this.id = "ColoredSection" + ColoredSection.box_counter;

        this.state = {
            is_transition: false,
            current_color: ""
        };

        this.current_color = "";
    }

    get id() {
        return "#" + this._id;
    }

    set id(val) {
        this._id = val;
    }

    componentWillMount() {

    }

    componentDidMount() {
        console.log("ColoredSection mount: color=", this.props.color, this.id);
        TweenLite.set($(this.id), {backgroundColor: this.props.color});
    }

    componentWillUpdate( nextProps, nextState ) {
        var next_color = nextProps.color;

        if ( this.props.color == next_color ) {
            return;
        }

        TweenLite.fromTo($(this.id), 1,
            {backgroundColor: this.props.color},
            {backgroundColor: next_color});
    }

    render() {

        return <section id={this._id} key={this._id} {...this.props}>
            {this.props.children}
        </section>;
    }
}