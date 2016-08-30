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

    resizePreviewIframe(event) {
        var $iframe = $(this.id);

        $iframe.css({
            width: '100%',
            height: '60%'
        })

        var ratio = window.innerHeight / window.innerWidth;
        if (ratio < 0.5) {
            var w = 1092 * $iframe.height() / 609;
            $iframe.width(w);

            var p = ($('.btn-mehr-container').width() - w) / 2;

            $('.btn-mehr-container').css({
                'padding-left': p,
                'padding-right': p
            });
        }
        else {
            $iframe.height( 609 * $iframe.width() / 1092);

            $('.btn-mehr-container').css({
                'padding-left': 0,
                'padding-right': 0
            });
        }

        console.debug(ratio, 1092 * $iframe.height() / 609);
    }

    componentWillUpdate(nextProps, nextState) {
        if ( this.props.url == nextProps.url ) {
            return;
        }

        var $this = $(this.id);

        var url = nextProps.url;

        setTimeout(() => {
            this.setState({
                is_transition: true,
                url: url
            });

            this.resizePreviewIframe(null);

            TweenLite.to($this, 1, {
                opacity: 1,
                delay: 2
            })
        }, 2000);
    }

    render() {
        console.debug("Render(PreviewFrame)");
        var preview_url = this.state.url;

        return <iframe
            id={this._id}
            className={this.props.className}
            height="60%"
            src={preview_url}
            frameBorder="0"
            webkitallowfullscreen
            mozallowfullscreen
            allowfullscreen>
        </iframe>;
    }
}