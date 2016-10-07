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
        this.url = "";
    }

    parseJsonData(data) {
        this.id = data.id;
        this.name = data.name;
        this.logo = asset(data.logo);
        this.logo_short = asset(data.logo_short);
        this.color = data.color;
        this.genre = data.genre;
        this.description = data.description;
        this.url = data.url;
    }

    get page_name () {
        return padIntegerWithZeros(this.index, 2);
    }
    set page_name (index) {
        this.index = index;
    }

    get short_description () {
        var result = this.description;
        var cutat = result.lastIndexOf(' ',250);
        if(cutat!=-1)
            result = result.substring(0,cutat)+' [...]';

        return result;
    }
}
