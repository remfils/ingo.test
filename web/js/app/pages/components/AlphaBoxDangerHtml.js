import React from "react";
import AlphaBox from './AlphaBox';

export default class AlphaBoxDangerHtml extends AlphaBox {
    render() {
        var text = this.state.children;

        return <div id={this._id} className={this.props.className} dangerouslySetInnerHTML={{__html: text}}></div>;
    }
}