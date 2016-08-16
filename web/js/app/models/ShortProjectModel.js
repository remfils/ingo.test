import { asset, padIntegerWithZeros } from "../funcitons";

export default class ShortProjectModel {
    constructor() {
        this.id = 0;
        this.index = 0;
        this.name = "";
        this.genre = "";
        this.description = "";
        this.logo = "";
        this.logo_short = "";
        this.color = "";
    }

    parseJsonData(data) {
        this.id = data.id;
        this.name = data.name;
        this.logo = asset(data.logo);
        this.logo_short = asset(data.logo_short);
        this.color = data.color;
        this.genre = data.genre;
        this.description = data.description;
    }

    get page_name () {
        return padIntegerWithZeros(this.index, 2);
    }
    set page_name (index) {
        this.index = index;
    }

    get short_description () {
        return this.description;
    }
}
