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
        this.field_key = this.props.field_key;
        this.field_value = this.props.field_val;

        this.duration = this.props.duration || 1;
        this.dellay = this.props.dellay || 0;
    }

    componentWillUpdate(nextProps, nextState) {
        var $this = $(this.id);

        this.field_key = this.props.field_key;
        this.field_value = this.props.field_val;

        this.next_field_key = nextProps.field_key;
        this.next_field_value = nextProps.field_val;

        TweenLite.to($this, this.duration / 2, {
            opacity: 0, x: "-100%",
            ease: Power3.easeIn,
            dellay: this.dellay,
            onComplete: () => {
                this.text_before = "";

                this.setState({
                    is_transition: true
                });

                TweenLite.to($this, 1, {
                    opacity: 0, x: "100%",
                    ease: Power3.easeOut,
                    onComplete: () => {
                        console.log("DEBUG(SlidingTableRow): completed animation")
                    }})
            }});
    }

    render() {
        var key = this.field_key;
        var value = this.field_value;

        return <tr id={this._id} className={this.props.className} >
            <td>{ key }</td>
            <td>{ value }</td>
        </tr>;
    }
}
