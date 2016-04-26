export class HtmlFactory {
    function createDiv(class_name = null, content = null) {
        var div = document.createElement('div');

        if ( class_name ) {
            this.addClassTo(div, class_name);
        }

        return div;
    }

    function addClassTo(element, class_name) {
        if ( class_name.length > 1 ) {
            for ( var a in class_name ) {
                element.classList.add(class_name[a]);
            }
        }
        else {
            element.classList.add(class_name[a]);
        }
    }

    function createLabel(for_name, class_name, inner_html) {

    }
}