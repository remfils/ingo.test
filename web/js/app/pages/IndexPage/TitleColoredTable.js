import React from "react";

var $ = require('jquery');

export default class TitleColoredTable extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        this.color = "#ffffff";

        TitleColoredTable.box_counter ++;

        this.id = "TitleColoredTable" + TitleColoredTable.box_counter;

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

    componentWillUpdate( nextProps, nextState ) {
        var current_color = this.props.color;
        var next_color = nextProps.color;

        TweenLite.to($(this.id), 2, {backgroundColor: next_color});
    }

    render() {
        var table_style = { background: this.color };

        return <table id={this._id} className={this.props.className} style={ table_style }>
            { this.props.children }
        </table>;
    }
}