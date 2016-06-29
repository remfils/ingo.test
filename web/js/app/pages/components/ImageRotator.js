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

        this.animation_tween = Expo.easeInOut;

        this.image_offset = -1 * (window.innerHeight * 989 / 904 * 2 + ( window.innerWidth - 870 ));
    }

    get id() {
        return "#" + this._id;
    }

    set id(val) {
        this._id = val;
    }

    componentWillUpdate(nextProps, nextState) {
        if  ( this.are_components_set ) {
            // var coordinate_change = nextProps.direction == "right" ? "+=100%" : "-=100%";
            var coordinate_change = this.image_offset;
            coordinate_change += (nextProps.direction == "right" ? 1 : -1) * $(this.id + "> .background-image").innerWidth();

            TweenLite.to($(this.id), 1.5, {x: coordinate_change, ease: this.animation_tween, onComplete: () => {
                this.are_components_set = false;

                this.setState({current_image: this.image_front});
            }});
        }
        else {
            TweenLite.set($(this.id), {x: this.image_offset});

            this.image_front = nextProps.img_front;
            this.image_back = nextProps.img_back;
            this.image_next = nextProps.img_next;
            this.image_last = nextProps.img_last;

            this.are_components_set = true;
        }
    }

    render() {
        console.log("ImageRotator rendered");

        var src_img_last = this.image_last;
        var src_img_back = this.image_back;
        var src_img_front = this.image_front;
        var src_img_next = this.image_next;

        return <div id={this._id} className={this.props.className + " image-rotator"} >
            <img id="TitleBackgroundImage1" class="background-image img-last" src={src_img_last} ></img>
            <img id="TitleBackgroundImage2" class="background-image img-back" src={src_img_back} ></img>
            <img id="TitleBackgroundImage3" class="background-image img-front" src={src_img_front} onClick={this.props.onClick}></img>
            <img id="TitleBackgroundImage4" class="background-image img-next" src={src_img_next} ></img>
        </div>;
    }
}