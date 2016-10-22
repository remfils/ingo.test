import React from "react";

import * as ResizeActions from '../../actions/ResizeActions';

var $ = require('jquery');

const HEADER_MIN_WIDTH = 770;
const HEADER_LEFT_MARGIN = 120;
const BG_IMAGE_WIDTH = 989;
const BG_IMAGE_HEIGHT = 904;

export default class TitleColoredTable extends React.Component {
    static box_counter = 0;

    constructor(props) {
        super(props);

        this.color = "#ffffff";

        TitleColoredTable.box_counter ++;

        this.id = "TitleColoredTable" + TitleColoredTable.box_counter;

        this.resizeListener = this.resizeListener.bind(this);

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
        $(window).on('resize', this.resizeListener);

        this.setState({color: this.props.color});
    }

    resizeListener() {
        setTimeout(this.updateTableWidth.bind(this),10);
    }

    componentWillUnmount() {
        $(window).off('resize', this.resizeListener);
    }

    componentDidMount() {
        this.updateTableWidth();
    }

    updateTableWidth() {
        var image_width = window.innerHeight * BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT;

        console.debug("updateTableWidth: happened! ", image_width, window.innerWidth - HEADER_MIN_WIDTH - HEADER_LEFT_MARGIN);

        if ( image_width < window.innerWidth - HEADER_MIN_WIDTH - HEADER_LEFT_MARGIN) {
            var delta = window.innerWidth - HEADER_MIN_WIDTH - HEADER_LEFT_MARGIN - image_width;

            $(".colored-table-header").width(HEADER_MIN_WIDTH + delta);

            ResizeActions.resizeTableHeaderAction(HEADER_MIN_WIDTH + delta);
        }
        else {
            var colored_table_width = $(".colored-table-header").width();

            if ( colored_table_width > HEADER_MIN_WIDTH ) {
                $(".colored-table-header").width(HEADER_MIN_WIDTH);

                ResizeActions.resizeTableHeaderAction(HEADER_MIN_WIDTH);
            }
            else {
                ResizeActions.resizeTableHeaderAction(colored_table_width);
            }
        }
    }

    componentDidMount() {
        this.updateTableWidth();
    }

    componentWillUpdate( nextProps, nextState ) {
        var next_color = nextProps.color;

        if ( this.props.color == next_color ) {
            return;
        }

        $("#TableBackgroundColor").css('background-color', next_color);

        var $curtain = $(".colored-table-header .color-table-fg");
        $curtain.css({
            backgroundColor: this.props.color,
            width: "100%"
        });

        if ( nextProps.direction == "right" ) {
            $curtain.removeClass("left")
                .addClass("right");
        }
        else {
            $curtain.removeClass("right")
                .addClass("left");
        }

        TweenLite.to($curtain, 1, {width: 0, ease: Power3.easeInOut});
    }

    render() {
        var table_style = { backgroundColor: this.props.color };

        return <div id="TableHeader" className={"colored-table-header " + this.props.className}>
            <div class='color-table-fg'></div>
            <div style={table_style} class="table-bg-color"></div>
            <table id={this._id} >
                { this.props.children }
            </table>
        </div>;
    }
}