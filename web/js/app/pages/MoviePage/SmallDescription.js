import React from "react";

export default class SmallDescription extends React.Component {

    constructor() {
        super();
        this.array = [
            {
                id: 1,
                preview: "",
                table: {
                    "Agentur": "tsitrone medien GmbH & Co. KG",
                    "Kamera": "Ingo Scheel",
                    "Schnitt": "Ingo Scheel"
                }
            },
            {
                id: 2,
                preview: "",
                table: {
                    "Produktion": "Ingo Scheel",
                    "DoP": "Ingo Scheel",
                    "Schnitt": "Ingo Scheel"
                }
            }
        ];
    }

    render() {
        var mov = this.props.movie;

        var dsc = this.array.filter((item)=>{return item.id == mov.id;})[0];
        var data_table = dsc.table;
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
