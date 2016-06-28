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
            is_transition: false,
            current_color: ""
        };

        this.current_color = "";
        this.next_color = "";
    }

    get id() {
        return "#" + this._id;
    }

    set id(val) {
        this._id = val;
    }

    componentWillUpdate( nextProps, nextState ) {
        var next_color = nextProps.color;
        if ( !this.current_color ) {
            this.current_color = nextProps.color;
        }
        else if ( this.current_color != next_color ) {
            this.next_color = next_color;

            $("#TableForegroundColor")
                .css("width", "100%")
                .removeClass("left")
                .addClass("right");

            TweenLite.to($("#TableForegroundColor"), 1, {width: 0, onComplete: () => {
                this.current_color = next_color;
                this.setState(current_color, next_color);
                this.next_color = "";
            }});
        }
    }

    render() {
        var table_style = { background: this.color };

        var current_bg_color = { backgroundColor: this.current_color };
        var next_bg_color = {};

        if ( this.next_color ) {
            next_bg_color = { backgroundColor: this.next_color };
        }

        return <div className={this.props.className}>
            <div id="TableBackgroundColor" style={next_bg_color}></div>
            <div id="TableForegroundColor" style={current_bg_color}></div>
            <table id={this._id} >
                { this.props.children }
            </table>
        </div>;
    }
}