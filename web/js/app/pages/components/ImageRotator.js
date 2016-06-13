import React from "react";

var $ = require('jquery');

export default class ImageRotator extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        this.image_front = "";
        this.image_back = "";
        this.image_next = "";
        
        this.next_images = [];
        this.current_images = [];

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
        if ( this.current_images.length < 0 ) {
            this.current_images = nextProps.images;
        }
        else if ( this.state.is_transition ) {
            console.log("AYYYYYYYYYYYYYYYEEEEEEEEEEEEEE");
            return;
        }
        else {
            console.log("componentWillUpdate: next_images are set");
            this.next_images = nextProps.images.slice();
            nextState.is_transition = true;
            
            TweenLite.to($(this.id + " > .background-image"), 2, {x: "+=100%", onComplete: () => {
                this.current_images = this.next_images.slice();
                TweenLite.set($(this.id + " > .background-image"), {clearProps: "all"});
                this.setState({is_transition: false})
            }});
        }
        /*if ( nextState.is_transition ) {
            nextState.is_transition = false;
            return;
        }

        if ( this.props.img_front ) {
            console.log("componentWillUpdate");
            this.image_next = nextProps.img_next;

            TweenLite.to($(this.id + " > .background-image"), 2, {x: "+=100%", onComplete: () => {
                this.image_next = "";
                TweenLite.set($(this.id + " > .background-image"), {clearProps: "all"});
                this.setState({is_transition: true})
            }});
        }*/
    }

    render() {
        var images_class_list = ["img-next2", "img-next", "img-current", "img-prev"];

        var packUrl = function( url ) {
            return "url(" + url + ")";
        }
        
        if ( !this.current_images.length ) {
            this.current_images = this.props.images;
        }
        
        if ( !this.state.is_transition ) {
            while ( this.next_images.length )
                this.next_images.pop();   
        }
        
        var image_divs = this.current_images.map((item, index) => {
            var div_style = {backgroundImage: packUrl(item)}
            return <div
                id={"TitleBackgroundImage" + this._id + "_" + index}
                class={"background-image " + images_class_list[index]}
                style={div_style}
            />;
        });

        return <div id={this._id} className={this.props.className} >
            { image_divs }
        </div>;
    }
}