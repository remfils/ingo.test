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
        if ( nextState.is_transition_finished ) {
            nextState.is_transition_finished = false;
            return;
        }

        if ( this.props.img_front ) {
            console.log("componentWillUpdate");
            this.image_next = nextProps.img_next;

            TweenLite.to($(this.id + " > .background-image"), 2, {x: "+=100%", onComplete: () => {
                this.image_next = "";
                TweenLite.set($(this.id + " > .background-image"), {clearProps: "all"});
                this.setState({is_transition_finished: true})
            }});
        }
    }

    render() {
        console.log("ImageRotator rendered");

        if ( !this.image_next ) {
            this.image_front = this.props.img_front;
            this.image_back = this.props.img_back;
            this.image_next = this.props.img_next;
        }

        var packUrl = function( url ) {
            return "url(" + url + ")";
        }

        var style_img_back = { backgroundImage: packUrl(this.image_back) };
        var style_img_front = { backgroundImage: packUrl(this.image_front) };
        var style_img_next = { backgroundImage: packUrl(this.image_next) };

        console.log("ImageRotator: ", style_img_next, style_img_back, style_img_front);

        return <div id={this._id} className={this.props.className} >
            <div id="TitleBackgroundImage1" class="background-image img-back" style={style_img_back} ></div>
            <div id="TitleBackgroundImage2" class="background-image img-front" style={style_img_front} onClick={this.props.onClick}></div>
            <div id="TitleBackgroundImage3" class="background-image img-next" style={style_img_next} ></div>
        </div>;
    }
}