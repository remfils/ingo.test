import config from '../config';
import ShortProjectModel from './ShortProjectModel';

export default class MovieModel extends ShortProjectModel {

    constructor() {
        super();

        this.preview_url = "";
        this.project_info_table = null;
        this.comments = null;
    }

    parseJsonData(data) {
        super.parseJsonData(data);

        this.preview_url = data.preview_url;

        this.project_info_table = data.table;
        this.comments = data.comments;
    }
}
