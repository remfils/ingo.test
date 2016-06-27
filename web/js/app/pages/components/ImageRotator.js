import React from "react";

var $ = require('jquery');

export default class ImageRotator extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        this.image_front = "";
        this.image_back = "";
        this.image_next = "";
        this.image_prev = "";

        ImageRotator.box_counter ++;
        this.id = "ImageRotator" + ImageRotator.box_counter;

        this.are_components_set = false;

        this.state = {
            is_transition_finished: true
        };
    }

    get id() {
        return "#" + this._id;
    }

    set id(val) {
        this._id = val;
    }

    componentWillUpdate(nextProps, nextState) {
        if  ( this.are_components_set ) {
            var coordinate_change = nextProps.direction == "right" ? "+=100%" : "-=100%";
            TweenLite.to($(this.id + " > .background-image"), 2, {x: coordinate_change, onComplete: () => {
                this.image_next = "";
                TweenLite.set($(this.id + " > .background-image"), {clearProps: "all"});

                this.are_components_set = false;

                this.setState({current_image: this.image_front});
            }});
        }
        else {
            this.image_front = nextProps.img_front;
            this.image_back = nextProps.img_back;
            this.image_next = nextProps.img_next;
            this.image_last = nextProps.img_last;

            this.are_components_set = true;
        }
    }

    render() {
        console.log("ImageRotator rendered");

        var packUrl = function( url ) {
            return "url(" + url + ")";
        }

        var style_img_last = { backgroundImage: packUrl(this.image_last) };
        var style_img_back = { backgroundImage: packUrl(this.image_back) };
        var style_img_front = { backgroundImage: packUrl(this.image_front) };
        var style_img_next = { backgroundImage: packUrl(this.image_next) };

        console.log("ImageRotator: ", style_img_next, style_img_back, style_img_front);

        return <div id={this._id} className={this.props.className} >
            <div id="TitleBackgroundImage1" class="background-image img-last" style={style_img_last} ></div>
            <div id="TitleBackgroundImage2" class="background-image img-back" style={style_img_back} ></div>
            <div id="TitleBackgroundImage3" class="background-image img-front" style={style_img_front} onClick={this.props.onClick}></div>
            <div id="TitleBackgroundImage4" class="background-image img-next" style={style_img_next} ></div>
        </div>;
    }
}