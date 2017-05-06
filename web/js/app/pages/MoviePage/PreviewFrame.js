import React from "react";

var $ = require('jquery');

export default class PreviewFrame extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        PreviewFrame.box_counter ++;

        this.id = "PreviewFrame" + PreviewFrame.box_counter;

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

    componentWillMount() {
        var url = this.props.url;

        this.setState({
            url: url
        });

        $(window).on('resize', this.resizePreviewIframe.bind(this));
    }

  componentDidMount() {
    
  }

    resizePreviewIframe(event) {
        var $iframe = $(this.id);

        $iframe.css({
            width: '100%',
            height: '60%'
        });

        var frame_height = 609 * $iframe.width() / 1092;

        $iframe.height(frame_height);

        var margin_top = (window.innerHeight - frame_height - $('.btn-mehr-container').outerHeight()) / 4;

        $iframe.css('margin-top', margin_top + "px");
    }

    componentWillUpdate(nextProps, nextState) {
        if ( !nextProps.url || this.props.url == nextProps.url ) {
            return;
        }
        console.log("PREVIEW_URL: " +nextProps.url);

        var $this = $(this.id);

        var url = nextProps.url;

        setTimeout(() => {
            var frame = $(this.id)[0];
            frame.contentWindow.location.replace(url);

            this.resizePreviewIframe(null);

            TweenLite.to($this, 1, {
                opacity: 1,
                delay: 2
            });
        }, 2000);
    }
  
    render() {
        var frame;

        frame = <iframe
        id={this._id}
        className={this.props.className}
        height="60%"
        frameBorder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowFullScreen>
            </iframe>;

        return frame;
    }
}
