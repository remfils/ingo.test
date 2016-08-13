import React from "react";

import ResizeStore from '../../stores/ResizeStore';

var $ = require('jquery');

const HEADER_MIN_WIDTH = 770;
const HEADER_LEFT_MARGIN = 120;
const BG_IMAGE_WIDTH = 989;
const BG_IMAGE_HEIGHT = 904;

export default class ImageRotator extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        this.image_front = "";
        this.image_back = "";
        this.image_next = "";
        this.image_prev = "";

        this.table_width = HEADER_MIN_WIDTH;

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

    componentWillMount() {
        ResizeStore.on("RESIZE_TABLE_HEADER", this.resizeStoreListener.bind(this));
    }

    resizeStoreListener() {
        this.table_width = ResizeStore.data.width;

        this.updateImagePositions();
    }

    updateImagePositions() {
        var image_width = window.innerHeight * BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT;

        $("#TitleBackgroundImage1").css("left", -image_width);
        $("#TitleBackgroundImage2").css("left", HEADER_LEFT_MARGIN - image_width);
        $("#TitleBackgroundImage3").css("left", HEADER_LEFT_MARGIN + this.table_width);
        $("#TitleBackgroundImage4").css("left", HEADER_LEFT_MARGIN + this.table_width + image_width);
    }

    componentWillUpdate(nextProps, nextState) {
        if  ( this.are_components_set ) {
            // var coordinate_change = nextProps.direction == "right" ? "+=100%" : "-=100%";
            var coordinate_change = this.image_offset;

            /*TweenLite.to($(this.id), 1.5, {x: coordinate_change, ease: this.animation_tween, onComplete: () => {
             this.are_components_set = false;

             this.setState({current_image: this.image_front});
             }});*/

            this.updateImagePositions();

            var image_width = window.innerHeight * BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT;

            if ( nextProps.direction == "right" ) {
                /* MOVING RIGHT */

                TweenLite.to($("#TitleBackgroundImage1"), 0.2, {left: HEADER_LEFT_MARGIN - image_width});
                TweenLite.to($("#TitleBackgroundImage2"), 0.3, {left: HEADER_LEFT_MARGIN + this.table_width - image_width, ease: Power2.easeIn, onComplete: () => {
                    TweenLite.to($("#TitleBackgroundImage2"), 1, {left: HEADER_LEFT_MARGIN + this.table_width, ease: Power2.easeOut});

                    TweenLite.to($("#TitleBackgroundImage3"), 1, {left: HEADER_LEFT_MARGIN + this.table_width + image_width, ease: Power2.easeOut, delay: 0.1, onComplete: () => {
                        this.are_components_set = false;

                        this.setState({current_image: this.image_front});
                    }});
                }});
            }
            else {
                /* MOVING LEFT */

                TweenLite.to($("#TitleBackgroundImage3"), 0.5, {left: HEADER_LEFT_MARGIN + this.table_width - image_width, ease: Power2.easeInOut, delay: 0.1, });
                TweenLite.to($("#TitleBackgroundImage4"), 0.5, {left: HEADER_LEFT_MARGIN + this.table_width, ease: Power2.easeInOut, onComplete: () => {
                    TweenLite.to($("#TitleBackgroundImage2"), 0.2, {left: -image_width, delay: 0.5, ease: Power2.easeOut});

                    TweenLite.to($("#TitleBackgroundImage3"), 0.7, {left: HEADER_LEFT_MARGIN - image_width, ease: Power2.easeOut, onComplete: () => {
                        this.are_components_set = false;

                        this.setState({current_image: this.image_front});
                    }});
                }});
            }
        }
        else {
            //TweenLite.set($(this.id), {x: this.image_offset});

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

        this.updateImagePositions();

        return <div id={this._id} className={this.props.className + " image-rotator"} >
            <img id="TitleBackgroundImage1" class="background-image" src={src_img_last} ></img>
            <img id="TitleBackgroundImage2" class="background-image" src={src_img_back} ></img>
            <img id="TitleBackgroundImage3" class="background-image" src={src_img_front} onClick={this.props.onClick}></img>
            <img id="TitleBackgroundImage4" class="background-image" src={src_img_next} ></img>







        </div>;
    }
}
