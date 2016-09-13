var $ = require('jquery');

export default class NewProjectPageValidator {
    constructor() {
        this.errors = [];
    }

    validate(e) {
        if (this.isValid()) {
            return true;
        }

        e.preventDefault();

        this.displayValidationErrors();

        return false;
    }

    isValid() {
        var result = false;

        result = result | this.isLogoValid();

        return result;
    }

    isLogoValid() {
        let $logo = $('#Logo_Input');
        let file_name = $logo.val();

        if (!file_name) {
            this.errors.push('logo file was not set');
            return false;
        }

        let re_filename = /\.(jpeg|jpg|png|tiff)$/;

        if (!re_filename.exec(file_name)) {
            this.errors.push('logo file should only be jpeg, jpg, png or tiff');
            return false;
        }

        let $img = $('#Logo_Img');
        // check image resolution

        return true;

    }

    displayValidationErrors() {
        alert(this.errors[0]);
    }
}