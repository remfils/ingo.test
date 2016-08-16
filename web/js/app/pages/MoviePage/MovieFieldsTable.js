import React from "react";

import AlphaTextBox from "../components/AlphaTextBox";

import ProjectModel from "../../models/ProjectModel";

var $ = require('jquery');

export default class MovieFieldsTable extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        MovieFieldsTable.box_counter ++;

        this.id = "MovieFieldsTable" + MovieFieldsTable.box_counter;

        this.state = {
            movie: null
        };
    }

    get id() {
        return "#" + this._id;
    }

    set id(val) {
        this._id = val;
    }

    componentWillMount() {
        var movie = this.props.movie;

        if (!(movie instanceof ProjectModel))
            return;

        this.setState({
            movie: movie
        });
    }

    componentWillUpdate(nextProps, nextState) {
        var movie = this.props.movie;
        var next_movie = nextProps.movie;

        if (!(next_movie instanceof ProjectModel)) {
            return;
        }

        if (
            this.state.movie
            && (this.state.movie.id == next_movie.id || nextState.movie.id == next_movie.id) ) {
            return;
        }

        var $this = $(this.id);

        var $rows = $this.find('tr');
        var interval = 0.7 / $rows.size();
        var tl = new TimelineLite();
        $($rows.get().reverse()).each((i, item) => {
            tl.to(item, interval, { delay: - interval / 5, opacity: 0, x: "-100%", ease: Power3.easeIn});
        });

        tl.to($this, 0, {onComplete: () => {
            console.debug("DEBUG(MovieFiedlsTable.componentWillUpdate): !!!!!!!!!!!!!");

            this.setState({movie: next_movie});

            var tl2 = new TimelineLite();
            $($this.find('tr')).each((i, item) => {
                TweenLite.set(item, {opacity: 0, x: "100%"});
                tl2.to(item, interval, { opacity: 1, x: "0%", delay: -interval / 5, ease: Power3.easeOut });
            });
        }});
    }

    render() {
        var movie = this.state.movie;
        console.debug("RENDER(MovieFieldsTable): movie: ", movie);

        if (!movie) {
            return <table class="col-30p project-stats">
                <tr>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        }

        var project_name = movie.name;
        var movie_table = "";
        
        if (movie.project_info_table) {
            movie_table = movie.project_info_table.map(function(item, i) {
                return <tr>
                    <td>{item.field_name}</td>
                    <td>{item.field_value}</td>
                </tr>;
            });
        }

        return <table id={this._id} class="col-30p project-stats">
             <tr>
                 <th>Project:</th>
                 <th>{project_name}</th>
             </tr>

            {movie_table}
         </table>;
    }
}