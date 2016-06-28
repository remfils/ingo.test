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

        var comments = movie.comments.map((item) => {
            console.log("DESCRIPTION RENDER: ", item);
            var text_html = {__html: item.text };

            return <div class="info-block">
                <div class="col-30p info-text" dangerouslySetInnerHTML={text_html} />
                <div class="col-70p info-img">
                    <img src={ asset(item.image_url) } alt="Girl"/>
                </div>
            </div>
        });

        return (
            <div>
                <section class="default-side-padding project-dsc">
                    <div class="description-container">
                        <div class="col-30p">
                            <h1>ZUM PROJEKT:</h1>
                            <h1><strong>{movie.name} {movie.year}</strong></h1>
                        </div>
                        
                        <div class="col-70p project-desctription-text" dangerouslySetInnerHTML={description_html}></div>
                    </div>
                </section>

                <section className="default-side-padding more-info">

                    { comments }

                </section>
            </div>
        );
    }
}