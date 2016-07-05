import React from "react";

var $ = require('jquery');

const HEADER_MIN_WIDTH = 770;
const HEADER_LEFT_MARGIN = 120;
const BG_IMAGE_WIDTH = 989;
const BG_IMAGE_HEIGHT = 904;

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


    componentWillMount() {
        $(window).on("resize", this.updateTableWidth.bind(this));
    }

    updateTableWidth() {
        var image_width = window.innerHeight * BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT;

        console.log("updateTableWidth: happened! ", image_width, window.innerWidth - HEADER_MIN_WIDTH - HEADER_LEFT_MARGIN);

        if ( image_width < window.innerWidth - HEADER_MIN_WIDTH - HEADER_LEFT_MARGIN) {
            var delta = window.innerWidth - HEADER_MIN_WIDTH - HEADER_LEFT_MARGIN - image_width;

            $("#TableHeader").width(HEADER_MIN_WIDTH + delta);
        }
    }

    componentDidMount() {
        this.updateTableWidth();
    }

    componentWillUpdate( nextProps, nextState ) {
        var next_color = nextProps.color;
        if ( !this.current_color ) {
            this.current_color = nextProps.color;
        }
        else if ( this.current_color != next_color ) {
            this.next_color = next_color;

            var $curtain = $("#TableForegroundColor");
            $curtain.css("width", "100%");

            if ( nextProps.direction == "right" ) {
                $curtain.removeClass("left")
                    .addClass("right");
            }
            else {
                $curtain.removeClass("right")
                    .addClass("left");
            }

            TweenLite.to($("#TableForegroundColor"), 1, {width: 0, ease: Power3.easeInOut, onComplete: () => {
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

        return <div id="TableHeader" className={this.props.className}>
            <div id="TableBackgroundColor" style={next_bg_color}></div>
            <div id="TableForegroundColor" style={current_bg_color}></div>
            <table id={this._id} >
                { this.props.children }
            </table>
        </div>;
    }
}