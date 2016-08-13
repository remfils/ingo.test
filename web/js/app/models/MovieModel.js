import config from '../config';
import { asset } from "../funcitons";

var $ = require('jquery');

export default class MovieModel {

    constructor(movie_data) {
        this.id = movie_data.id;
        this.name = movie_data.name;
        this.year = movie_data.year;
        this.logo = asset(movie_data.logo);
        this.logo_short = asset(movie_data.logo_short);
        this.color = movie_data.color;
        this.genre = movie_data.genre;
        this.description = movie_data.description;

        this.project_info_table = null;
        this.preview_url = null;
        this.comments = null;
    }

    getMoreData(callback) {
        $.ajax({
            url: config.SITE_NAME + 'api/movie/' + this.id,
            dataType: 'json',
            success: (data) => {
                this.project_info_table = data.table;
                this.preview_url = data.preview_url;
                this.description = data.description;
                this.comments = data.comments;

                if ( callback ) {
                    callback();
                }
            },
            error: (err) => {
                console.log('error ' + err);
            }
        });
    }
}