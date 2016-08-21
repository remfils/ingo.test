import React from "react";

import { asset } from "../../funcitons";
import config from '../../config';

var $ = require('jquery');

export default class Description extends React.Component {
    constructor() {
        super();
    }

    componentWillUnmount() {

    }

    componentDidMount() {

    }

    componentDidUpdate() {
    }


    resizePreviewIframe() {
        if ( this.preview_iframe ) {
            this.preview_iframe.height = 609 * this.preview_iframe.clientWidth / 1092;
        }
    }

    render() {
        console.log("description rerender");
        var movie = this.props.movie;

        console.log(movie, movie.comments);

        if ( !movie || !movie.comments ) {
            return <div>This is test</div>;
        }

        var description_html = {__html: movie.description };
        var description_style = {backgroundColor: movie.color};

        var comments = movie.comments.map((item) => {
            console.log("DESCRIPTION RENDER: ", item);
            var text_html = {__html: item.text };

            return <tr class="info-block">
                <td class="info-text" dangerouslySetInnerHTML={text_html} />
                <td class="info-img">
                    <img src={ asset(item.image_url) } alt="Girl"/>
                </td>
            </tr>
        });

        return (
            <div {...this.props}>
                <section class="default-side-padding project-dsc" style={description_style}>
                    <div class="description-container">
                        <div class="col-30p">
                            <h2>ZUM PROJEKT:</h2>
                            <h1><strong>{movie.name} {movie.year}</strong></h1>
                        </div>

                        <div class="col-70p project-desctription-text" dangerouslySetInnerHTML={description_html}></div>
                    </div>
                </section>

                <section className="default-side-padding more-info">
                    <table className="movie-comments" cellspacing="0" cellpadding="0">
                        { comments }
                    </table>

                    <hr/>

                    <a href="#" class="movie_page-back-to-top">
                        <span>BACK TO TOP</span>
                    </a>

                </section>
            </div>
        );
    }

}