import React from "react";

export default class FullDescription extends React.Component {
    render() {
        var name = this.props.projectName;
        var style_description = {"background-color": this.props.movie.color};

        return (
            <div>
            <section class="default-side-padding project-dsc" style={style_description}>
                <div class="description-container">
                    <div class="col-md-5">
                        <h1>ZUM PROJEKT:</h1>
                        <h1><strong>INSULINE MEDICAL - INSUPAD 2011</strong></h1>
                    </div>
                    <div class="col-md-7">
                        <p>Wieder ein gemeinsames Projekt mit dem langjahrigen Partner tsitrone Werbeagentur. Oliver Horst, Inhaber von tsitrone medien GmbH und Co. KG, hatte den Auftrag bekommen, die komplette Entwicklung des Corporate De-

                            signs und Inszenierung des Produkts fur das Fachpublikum zu ubernehmen. In diesem Rahmen haben wir dieses Video produziert. Hier kommen sowohl Patienten als auch Arzte zu Wort.</p>
                    </div>
                </div>
            </section>

            <section className="default-side-padding more-info">

                <div class="info-block">
                    <div class="info-text">
                        <p>„Braun Olympia“ 2012</p>
                        <p>Making of photo´s <br/> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
                    </div>
                    <div class="info-img">
                        <img src="img/movies/Ebene_136.png" alt="Girl"/>
                    </div>
                </div>

                <div class="info-block">
                    <div class="info-text">
                        <p>„Braun Olympia“ 2012</p>
                        <p>Making of photo´s <br/> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
                    </div>
                    <div class="info-img">
                        <img src="img/movies/Ebene_136.png" alt="Girl"/>
                    </div>
                </div>

            </section>

            </div>
        );
    }
}