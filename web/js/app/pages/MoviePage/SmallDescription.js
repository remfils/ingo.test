import React from "react";

export default class SmallDescription extends React.Component {
    render() {
        var name = this.props.projectName;

        return (
            <section class="default-side-padding project-sm-dsc">
                <table class="col-md-4 project-stats">
                    <tr>
                        <th>PROJECT:</th>
                        <th>INSULINE MEDICAL - INSUPAD 2011 </th>
                    </tr>
                    <tr>
                        <td>Agentur:</td>
                        <td>tsitrone medien GmbH &amp; Co. KG</td>
                    </tr>
                    <tr>
                        <td>Kamera:</td>
                        <td>Ingo Scheel</td>
                    </tr>
                    <tr>
                        <td>Schnitt:</td>
                        <td>Ingo Scheel</td>
                    </tr>
                </table>

                <div class="col-md-8 project-demo-video">
                    <iframe height="60%" src="https://player.vimeo.com/video/67123140?color=ffffff" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                    <div class="btn-mehr-container">
                        <a class="btn-mehr">MEHR ERFAHREN</a>
                    </div>
                </div>
            </section>
        );
    }
}
