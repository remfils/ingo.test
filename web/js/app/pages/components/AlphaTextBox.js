import React from "react";

export default class AlphaTextBox extends React.Component {
    constructor() {
        super();

        this.text_before = "";
        this.text_after = "";

        this.state = {
            is_transition: false
        };
    }

    componentWillUpdate(nextProps, nextState) {
        this.text_before = this.props.text;
        this.text_after = nextProps.text;
    }

    render() {
        var text = this.props.text;

        if ( this.state.is_transition ) {
            text = this.text_before;
        }

        return <div class={this.props.className} >
            {text}
        </div>;
    }
}