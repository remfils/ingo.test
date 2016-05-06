import React from "react";

import { asset } from "../../funcitons";
import config from '../../config';

var $ = require('jquery');

export default class Description extends React.Component {
    constructor() {
        super();

        this.is_listening = false;

        this.state = {
            project_info_table: [],
            preview_url: '',
            comments: []
        };

        this.preview_iframe = null;
    }

    addEventListeners() {
        if ( !this.is_listening ) {
            this.is_listening = true;
            $(window).resize(this.resizePreviewIframe.bind(this));
        }
    }

    removeEventListeners() {
        $(window).off('resize', this.resizePreviewIframe);
    }

    componentWillUnmount() {
        this.removeEventListeners();
    }

    componentDidMount() {
        console.log('start of downloading sm dsc');

        this.preview_iframe = $('.project-demo-video > iframe')[0];

        this.resizePreviewIframe();

        $.ajax({
            url: config.SITE_NAME + 'api/movie/' + this.props.movie.id,
            dataType: 'json',
            success: (data) => {
                console.log('finished of downloading sm dsc: ' + data.table);

                this.setState({
                    project_info_table: data.table,
                    preview_url: data.preview_url,
                    description: data.description,
                    comments: data.comments
                });
            },
            error: (err) => {
                console.log('error ' + err);
            }
        });
    }

    componentDidUpdate() {
        this.preview_iframe = $('.project-demo-video > iframe')[0];

        this.resizePreviewIframe();
    }


    resizePreviewIframe() {
        if ( this.preview_iframe ) {
            this.preview_iframe.height = 609 * this.preview_iframe.clientWidth / 1092;
        }
    }

    render() {
        var mov = this.props.movie;

        var name = mov.name;
        var style_description = {"background-color": mov.color};

        var description_html = {__html: this.state.description };

        var table = this.state.project_info_table.map((item) => {
            return <tr>
                <td>{ item.field_name }:</td>
                <td>{ item.field_value }</td>
            </tr>;
        });

        var comments = this.state.comments.map((item) => {
            var text_html = {__html: item.text };

            return <div class="info-block">
                <div class="col-30p info-text" dangerouslySetInnerHTML={text_html} />
                <div class="col-70p info-img">
                    <img src={ asset(item.image_url) } alt="Girl"/>
                </div>
            </div>
        });

        this.addEventListeners();

        this.resizePreviewIframe();

        return (
            <div>
                <section class="default-side-padding project-sm-dsc" style={style_description}>
                    <table class="col-30p project-stats">
                        <tr>
                            <th>Project:</th>
                            <th>{ mov.name }</th>
                        </tr>

                        {table}

                    </table>

                    <div class="col-70p project-demo-video">
                        <iframe height="60%" src="https://player.vimeo.com/video/67123140?color=ffffff" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                        <div class="btn-mehr-container">
                            <a class="btn-mehr">MEHR ERFAHREN</a>
                        </div>
                    </div>
                </section>

                <section class="default-side-padding project-dsc">
                    <div class="description-container">
                        <div class="col-30p">
                            <h1>ZUM PROJEKT:</h1>
                            <h1><strong>{mov.name} {mov.year}</strong></h1>
                        </div>
                        
                        <div class="col-70p" dangerouslySetInnerHTML={description_html}></div>
                    </div>
                </section>

                <section className="default-side-padding more-info">

                    { comments }

                </section>
            </div>
        );
    }
}