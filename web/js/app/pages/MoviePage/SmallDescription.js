import React from "react";

import config from '../../config';

var $ = require('jquery');

export default class SmallDescription extends React.Component {

    constructor() {
        super();

        this.state = {
            project_info_table: [],
            preview_url: ''
        };

        this.preview_iframe = null;
    }

    componentDidMount() {
        console.log('start of downloading sm dsc');

        this.preview_iframe = $('.project-demo-video > iframe')[0];

        $(window).resize(this.resizePreviewIframe.bind(this));

        this.resizePreviewIframe();

        $.ajax({
            url: config.SITE_NAME + 'api/movie/small/' + this.props.movie.id,
            dataType: 'json',
            success: (data) => {
                console.log('finished of downloading sm dsc: ' + data.table);

                this.setState({
                    project_info_table: data.table,
                    preview_url: data.preview
                });
            },
            error: (err) => {
                console.log('error ' + err);
            }
        });
    }

    componentWillUnmount() {
        $.off('resize', this.resizePreviewIframe);
    }

    resizePreviewIframe() {
        if ( this.preview_iframe ) {
            this.preview_iframe.height = 609 * this.preview_iframe.clientWidth / 1092;
        }
    }

    render() {
        var mov = this.props.movie;

        var data_table = this.state.project_info_table;
        var table = [];

        for ( var key in data_table ) {
            table.push(
                <tr>
                    <td>{ key }:</td>
                    <td>{ data_table[key] }</td>
                </tr>
            );
        }

        return (
            <section class="default-side-padding project-sm-dsc">
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
        );
    }
}
