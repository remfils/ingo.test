import React from "react";

import { asset } from "../../funcitons";
import config from '../../config';
import AlphaBox from "../components/AlphaBox";
import ColoredSection from "../components/ColoredSection";

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

    backToTopClickListener(e) {
        e.preventDefault();

        TweenLite.to($('html, body'), 1, {scrollTop: 0, ease: Power2.easeInOut});

        return false;
    }

    render() {
        console.log("description rerender");
        var movie = this.props.movie;

        console.log("RENDER(Description)", movie, movie.comments);

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
                <ColoredSection class="default-side-padding project-dsc" color={movie.color}>
                    <div class="description-container">
                        <div class="col-30p">
                            <h2>ZUM PROJEKT:</h2>
                            <h1><strong>
                                <AlphaBox>{movie.name} {movie.year}</AlphaBox>
                            </strong></h1>
                        </div>

                        <AlphaBox>
                            <div class="col-70p project-desctription-text" dangerouslySetInnerHTML={description_html}></div>
                        </AlphaBox>
                    </div>
                </ColoredSection>

                <section className="default-side-padding more-info">
                    <table className="movie-comments" cellspacing="0" cellpadding="0">
                        { comments }
                    </table>

                    <hr/>

                    <a href="#" class="movie_page-back-to-top" onClick={this.backToTopClickListener.bind(this)}>
                        <span>BACK TO TOP</span>
                    </a>

                </section>
            </div>
        );
    }

}