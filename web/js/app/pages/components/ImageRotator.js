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
            this.image_next = nextProps.img_front;

            TweenLite.to($(this.id + " > .background-image"), 2, {x: "-=100%", onComplete: () => {
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
        }

        return <div id={this._id} className={this.props.className} >
            <img id="TitleBackgroundImage1" class="background-image img-back" src={this.image_back} alt="alt image text" />
            <img id="TitleBackgroundImage2" class="background-image img-front" src={this.image_front} alt="alt image text" onClick={this.props.onClick}/>
            <img id="TitleBackgroundImage3" class="background-image img-next" src={this.image_next} alt="alt image text" />
        </div>;
    }
}