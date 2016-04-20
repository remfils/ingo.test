import React from "react";

export default class SmallDescription extends React.Component {
    render() {
        var name = this.props.projectName;

        return (
            <div>
                <div>
                    <h1>Name:</h1>
                    <span>{name}</span>
                </div>
                <div>
                    <h1>Name:</h1>
                    <span>Project</span>
                </div>
                <div>
                    <h1>Name:</h1>
                    <span>Project</span>
                </div>
                <div>
                    <h1>Name:</h1>
                    <span>Project</span>
                </div>
            </div>
        );
    }
}
