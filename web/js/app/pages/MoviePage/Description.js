import React from "react";

import { asset } from "../../funcitons";
import config from '../../config';

var $ = require('jquery');

export default class Description extends React.Component {
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
            url: config.SITE_NAME + 'api/movie/' + this.props.movie.id,
            dataType: 'json',
            success: (data) => {
                console.log('finished of downloading sm dsc: ' + data.table);

                this.setState({
                    project_info_table: data.table,
                    preview_url: data.preview_url,
                    description: data.description
                });
            },
            error: (err) => {
                console.log('error ' + err);
            }
        });
    }

    componentWillUnmount() {
        $(window).off('resize', this.resizePreviewIframe);
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

        console.log("test:::");

        var table = this.state.project_info_table.map((item) => {
            return <tr>
                <td>{ item.field_name }:</td>
                <td>{ item.field_value }</td>
            </tr>;
        });

        return (
            <div>
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

                <section class="default-side-padding project-dsc" style={style_description}>
                    <div class="description-container">
                        <div class="col-30p">
                            <h1>ZUM PROJEKT:</h1>
                            <h1><strong>{mov.name} {mov.year}</strong></h1>
                        </div>
                        <div class="col-70p">
                            <p>{this.state.description}</p>
                        </div>
                    </div>
                </section>

                <section className="default-side-padding more-info">

                    <div class="info-block">
                        <div class="col-30p info-text">
                            <p>„Braun Olympia“ 2012</p>
                            <p>Making of photo?s <br/> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
                        </div>
                        <div class="col-70p info-img">
                            <img src={ asset("img/movies/Ebene_136.png") } alt="Girl"/>
                        </div>
                    </div>

                    <div class="info-block">
                        <div class="col-30p info-text">
                            <p>„Braun Olympia“ 2012</p>
                            <p>Making of photo?s <br/> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
                        </div>
                        <div class="col-70p info-img">
                            <img src={ asset("img/movies/Ebene_136.png") } alt="Girl"/>
                        </div>
                    </div>

                </section>
            </div>
        );
    }
}