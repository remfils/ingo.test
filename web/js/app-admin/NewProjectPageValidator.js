var $ = require('jquery');

export default class NewProjectPageValidator {
    constructor() {
        this.errors = [];
    }

    validate(e) {
        if (this.isValid()) {
            alert('valid');
            $('#ProjectForm').submit();
        }
        else {
            alert('not valid');

            e.preventDefault();

            this.displayValidationErrors();

            return false;
        }
    }

    pushError(msg) {
        this.errors.push(msg);
    }

    isValid() {
        return true;

        var result = this.isLogoValid()
            && this.isColorValid()
            && this.isCommentsImageValid()
            && this.isPreviewUrlValid()
            && this.isYearValid()
            && this.isShortLogoValid();

        return result;
    }

    isLogoValid() {
        let $logo = $('#Logo_Input');
        let $logo_img = $('#Logo_Input')
        let file_name = $logo.val();

        return this.validateImage('Large Logo', $logo_img, file_name);
    }

    isShortLogoValid() {
        let $logo = $('#Logo_Input');
        let $logo_img = $('#Logo_Input');
        let file_name = $logo.val('#Logo_Img');

        return this.validateImage('Large Logo', $logo_img, file_name);
    }

    isCommentsImageValid() {

    }

    validateImage(validator_name, $img, image_filename) {
        if (!image_filename) {
            this.pushError(validator_name + 'file was not set');
            return false;
        }

        let re_filename = /\.(jpeg|jpg|png|tiff)$/;

        if (!re_filename.exec(image_filename)) {
            this.pushError( validator_name + ' file should only be jpeg, jpg, png or tiff');
            return false;
        }

        // check image resolution

        return true;
    }

    isYearValid() {
        let $year = $('#year');
        let year = $year.val();

        if (isNan(year)) {
            this.pushError('Year is not a number');
            return false;
        }

        let year_num = +year;
        if (year_num > new Date().getFullYear()) {
            this.pushError('Year is in the future');
            return false;
        }

        return true;
    }

    isPreviewUrlValid() {
        let re_valid_url = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        let prev_url = $('#preview_url').val();

        if (!re_valid_url.exec(prev_url)) {
            this.pushError('Preview url is not valid')
            return false;
        }

        return true;
    }

    isColorValid() {
        let re_valid_color = /^#[0-9A-F]{6}$/;
        let color = $('#color').val();

        if (!re_valid_color.exec(color)) {
            this.pushError('Color is not valid');
            return false;
        }

        return true;
    }

    displayValidationErrors() {
        alert(this.errors[0]);
    }
}