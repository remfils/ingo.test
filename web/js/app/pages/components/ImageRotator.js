import React from "react";

import ResizeStore from '../../stores/ResizeStore';

var $ = require('jquery');

const HEADER_MIN_WIDTH = 770;
const HEADER_LEFT_MARGIN = 120;
const BG_IMAGE_WIDTH = 989;
const BG_IMAGE_HEIGHT = 904;

export default class ImageRotator extends React.Component {
    static box_counter = 0;

    constructor(props) {
        super(props);

        this.table_width = HEADER_MIN_WIDTH;

        ImageRotator.box_counter ++;
        this.id = "ImageRotator" + ImageRotator.box_counter;

        this.resizeStoreListener = this.resizeStoreListener.bind(this);

        this.state = {
            movie_id: props.movie_id,
            image_front: props.img_front,
            image_back: props.img_back,
            image_next: props.img_next,
            image_last: props.img_last
        };

        console.debug(props);
    }

    get id() {
        return "#" + this._id;
    }

    set id(val) {
        this._id = val;
    }

    $ (element) {
        if (this._$this)
            return $(this.id + " " + element);
        return $;
    }

    componentWillMount() {
        ResizeStore.on("RESIZE_TABLE_HEADER", this.resizeStoreListener);

        /*this.image_front = this.props.img_front;
        this.image_back = this.props.img_back;
        this.image_next = this.props.img_next;
        this.image_last = this.props.img_last;

        this.are_components_set = true;*/

        /*this.setState({
            image_front: this.props.image_front,
            image_back: this.props.image_back,
            image_next: this.props.image_next,
            image_last: this.props.image_last
        });*/
    }

    componentWillUnmount() {
        ResizeStore.removeListener("RESIZE_TABLE_HEADER", this.resizeStoreListener);

        console.debug("ResizeStore.listenerCount(RESIZE_TABLE_HEADER)", ResizeStore.listenerCount("RESIZE_TABLE_HEADER"));
    }

    resizeStoreListener() {
        this.table_width = ResizeStore.data.width || HEADER_MIN_WIDTH;

        console.debug("TABLE_WIDTH", this.table_width);

        this.updateImagePositions();
    }

    updateImagePositions() {
        var image_width = window.innerHeight * BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT;

        $('.img-last').css("left", -image_width);
        $('.img-back').css("left", HEADER_LEFT_MARGIN - image_width);
        $('.img-front').css("left", HEADER_LEFT_MARGIN + this.table_width);
        $('.img-next').css("left", HEADER_LEFT_MARGIN + this.table_width + image_width);
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.movie_id == nextProps.movie_id)
            return;

        var movie_id = nextProps.movie_id;
        var image_front = nextProps.img_front;
        var image_back = nextProps.img_back;
        var image_next = nextProps.img_next;
        var image_last = nextProps.img_last;

        //this.updateImagePositions();

        var image_width = window.innerHeight * BG_IMAGE_WIDTH / BG_IMAGE_HEIGHT;

        if ( nextProps.direction == "right" ) {
            /* MOVING RIGHT */

            TweenLite.to(this.$('.img-last'), 0.2, {left: HEADER_LEFT_MARGIN - image_width});
            TweenLite.to(this.$(".img-back"), 0.3, {left: HEADER_LEFT_MARGIN + this.table_width - image_width, ease: Power2.easeIn, onComplete: () => {
                TweenLite.to(this.$(".img-back"), 1, {left: HEADER_LEFT_MARGIN + this.table_width, ease: Power2.easeOut});

                TweenLite.to(this.$(".img-front"), 1, {left: HEADER_LEFT_MARGIN + this.table_width + image_width, ease: Power2.easeOut, delay: 0.1, onComplete: () => {
                    //this.are_components_set = false;

                    //this.setState({current_image: this.image_front});

                    this.setState({
                        image_front,
                        image_back,
                        image_next,
                        image_last
                    });
                }});
            }});
        }
        else {
            /* MOVING LEFT */

            TweenLite.to(this.$('.img-front'), 0.5, {left: HEADER_LEFT_MARGIN + this.table_width - image_width, ease: Power2.easeInOut, delay: 0.1, });
            TweenLite.to(this.$('.img-next'), 0.5, {left: HEADER_LEFT_MARGIN + this.table_width, ease: Power2.easeInOut, onComplete: () => {
                TweenLite.to(this.$(".img-back"), 0.2, {left: -image_width, delay: 0.5, ease: Power2.easeOut});

                TweenLite.to(this.$(".img-front"), 0.7, {left: HEADER_LEFT_MARGIN - image_width, ease: Power2.easeOut, onComplete: () => {
                    /*this.are_components_set = false;

                    this.setState({current_image: this.image_front});*/

                    this.setState({
                        image_front,
                        image_back,
                        image_next,
                        image_last
                    });
                }});
            }});
        }
    }

    componentDidMount() {
        this.updateImagePositions();

        this._$this = $(this.id);
    }

    componentDidUpdate() {
        this.updateImagePositions();
    }

    render() {
        var src_img_last = this.state.image_last;
        var src_img_back = this.state.image_back;
        var src_img_front = this.state.image_front;
        var src_img_next = this.state.image_next;

        var image_click_listener = this.props.onClick;

        console.debug("RENDER(ImageRotator)", src_img_last, src_img_back, src_img_front, src_img_next);

        return <div id={this._id} className={this.props.className + " image-rotator"} >
            <img class="background-image img-last" src={src_img_last} ></img>
            <img class="background-image img-back" src={src_img_back} ></img>
            <img class="background-image img-front" src={src_img_front} onClick={image_click_listener}></img>
            <img class="background-image img-next" src={src_img_next} ></img>
        </div>;
    }
}
