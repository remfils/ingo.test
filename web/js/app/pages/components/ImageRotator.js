import React from "react";

var $ = require('jquery');

export default class ImageRotator extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        this.image_front = "";
        this.image_back = "";
        this.image_next = "";

        ImageRotator.box_counter ++;
        this.id = "ImageRotator" + ImageRotator.box_counter;

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

    componentWillUpdate(nextProps, nextState) {
        /*this.image_front = this.props.image;
        this.image_next = nextProps.image;*/

        /*var $img_back = $(this.id + " > .img-back");

        TweenLite.to($bracket_text, 1, {width: 0, onComplete: () => {
            this.text_before = "";

            this.setState({
                is_transition: true
            });

            TweenLite.set($bracket_text, {width: "auto"});

            TweenLite.from($bracket_text, 1, {width: 0, onComplete: () => {console.log("all completed")}})
        }});*/
    }

    render() {
        console.log("ImageRotator rendered");

        var images = [];

        var img_front_url = this.props.img_front;
        var img_back_url = this.props.img_back;

        if ( img_back_url ) {
            images.push(<img id="TitleBackgroundImage1" class="background-image img-back" src={img_back_url} alt="alt image text" />);
        }

        if ( img_front_url ) {
            images.push(<img id="TitleBackgroundImage2" class="background-image img-front" src={img_front_url} alt="alt image text" />);
        }

        return <div id={this._id} className={this.props.className} >
            {images}
        </div>;
    }
}