import React from "react";

var $ = require('jquery');

export default class FooterInfoBlock extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        FooterInfoBlock.box_counter ++;

        this.id = "FooterInfoBlock" + FooterInfoBlock.box_counter;
    }

    get id() {
        return "#" + this._id;
    }

    set id(val) {
        this._id = val;
    }

    render() {
        return <div id={this._id} className={this.props.className}>
            <h4>Ingo Scheel </h4>

            <p>Kameramann I DOP I visual concepts</p>

            <h4>Adresse:</h4>

            <p>Thielenstraße 13, 50825 Köln</p>

            <h4>Telefon:</h4>

            <p>0163 8765 082 </p>

            <h4>E-Mail:</h4>

            <p>ingo.scheel@yahoo.de</p>

            <h4>Netzwerk:</h4>

            <p><a href="https://www.linkedin.com/">in</a></p>

            <span>© 2016, Ingo Scheel</span>
        </div>;
    }
}