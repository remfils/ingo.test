import React from "react";

var $ = require('jquery');

export default class SlidingTableRow extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        this.field_key = "";
        this.field_value = "";
        this.next_field_key = "";
        this.next_field_value = "";

        this.duration = 0;
        this.dellay = 0;

        SlidingTableRow.box_counter ++;

        this.id = "SlidingTableRow" + SlidingTableRow.box_counter;

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
        this.setState({
            field_key: this.props.field_key,
            field_value: this.props.field_val
        });

        this.duration = this.props.duration || 1;
        this.delay = this.props.delay || 0;
    }

    componentWillUpdate(nextProps, nextState) {
        var $this = $(this.id);

        var next_key = nextProps.field_key;
        var next_value = nextProps.field_val;

        console.debug("DEBUG(SlidingTableRow.componentWillUpdate): starting animation");

        TweenLite.to($this, this.duration, {
            opacity: 0, x: "-100%",
            ease: Power3.easeIn,
            delay: this.delay,
            onComplete: () => {
                this.setState({
                    field_key: next_key,
                    field_value: next_value
                });

                TweenLite.to($this, this.duration, {
                    delay: 0.1,
                    opacity: 0, x: "100%",
                    ease: Power3.easeOut,
                    onComplete: () => {
                        console.debug("DEBUG(SlidingTableRow): completed animation")
                    }})
            }});
    }

    render() {
        var key = this.state.field_key;
        var value = this.state.field_value;

        return <tr id={this._id} className={this.props.className} >
            <td>{ key }</td>
            <td>{ value }</td>
        </tr>;
    }
}
