var $ = require("jquery");

export function initAddPage() {
    $("#field-name-1")[0].value = "Agentur";
    createField("Kamera");
    createField("Schnitt");
}

var field_count = 1;

export function setFieldCounter(counter) {
    field_count = counter;
}

export function addFieldButtonsClickListeners() {
    $('#AddField').click(function(){
        createField();
    });

    $("#ProjectInfoTable").on('click', ".remove", function(){
        var id = this.id.split("-").pop();

        var $field = $('#field-' + id);

        if ( $field.parent().children().length > 1 ) {
            var remove_marker = createRemoveMarker(id);
            $field.append(remove_marker);
            $field.hide();
        }
        else {
            alert('There has to be at least one field');
        }
    });
};

function createRemoveMarker(id) {
    var marker = document.createElement('input');
    marker.type = 'hidden';
    marker.name = "project[de][fields]["+id+"][delete]";
    marker.value = true;

    return marker;
}

function createField(name = "", value = "") {
    field_count ++;

    var container = document.createElement('div');
    container.classList.add('form-group');
    container.id = "field-" + field_count;

    var input_container = document.createElement('div');
    input_container.classList.add('col-lg-12');

    var de_row = createLangRow('de', name, value);
    input_container.appendChild(de_row);

    var en_row = createLangRow('en', name, value);
    input_container.appendChild(en_row);

    container.appendChild(input_container);

    var new_marker = createNewMarker('de');
    container.appendChild(new_marker);

    var field_container = document.createElement('div');
    field_container.classList.add('form-group');
    field_container.classList.add('col-lg-8');
    field_container.style['vertical-align'] = "middle";
    var btn = document.createElement('span');
    btn.id = "field-remove-" + field_count;
    btn.innerHTML = "Remove Field";
    btn.classList.add('btn');
    btn.classList.add('btn-sm');
    btn.classList.add('btn-danger');
    btn.classList.add('pull-right');
    btn.classList.add('remove');
    field_container.appendChild(btn);
    container.appendChild(field_container);

    var table = $("#ProjectInfoTable")[0];
    table.appendChild(container);
}

function createLangRow(lang, name, value) {
    var lang_container = document.createElement('div');
    lang_container.classList.add('row');
    lang_container.classList.add('form-group');

    var name_row = createInfoRow('name', lang, name);
    lang_container.appendChild(name_row);

    var value_row = createInfoRow('value', lang, value);
    lang_container.appendChild(value_row);

    return lang_container;
}

function createInfoRow (row_type, lang, row_text="") {
    var field_container = document.createElement('div');
    field_container.classList.add('col-md-4');

    var field_id = ["field", row_type, field_count].join('-');

    var label = document.createElement('label');
    label.htmlFor = field_id;
    label.innerHTML = "Field " + row_type +" (" + lang + ")" + ":";

    var input = document.createElement('input');
    input.type = "text";
    input.id = field_id;
    input.name = "project["+lang+"][fields]["+field_count+"]["+row_type+"]";
    input.classList.add("form-control");
    input.value = row_text;

    field_container.appendChild(label);
    field_container.appendChild(input);

    return field_container;
};

function createNewMarker(lang) {
    var marker = document.createElement('input');
    marker.type = 'hidden';
    marker.name = "project["+lang+"][fields]["+field_count+"][new]";
    marker.value = true;

    return marker;
}

var comment_count = 1;

export function setCommentCounter(counter) {
    comment_count = counter;
}

export function addCommentClickListeners() {
    $("#AddComment").on("click", (e) => {
        comment_count ++;

        var container = createDiv("comment_" + comment_count, "form-group");
        container.appendChild(createDiv(null, "col-sm-1"));

        var comment_container = createDiv(null, "col-sm-9");

        var id = ["comment", "img", comment_count].join("_");

        var img_container = createDiv(null, "form-group");

        var label = document.createElement("label");

        label.htmlFor = id;
        label.classList.add("col-sm-2");
        label.classList.add("control-label");
        label.innerHTML = "Image:";
        img_container.appendChild(label);

        var input_container = createDiv(null, "col-sm-10");

        var input = document.createElement("input");
        input.type = "file";
        input.id = id;
        input.name = id;
        input_container.appendChild(input);

        img_container.appendChild(input_container);

        comment_container.appendChild(img_container);

        var text_container = createDiv(null, "form-group");

        var id = ["comment", "text", comment_count].join("_");

        var text_container = createDiv(null, "form-group");

        var label = document.createElement("label");

        label.htmlFor = id;
        label.classList.add("col-sm-2");
        label.classList.add("control-label");
        label.innerHTML = "Text:";
        text_container.appendChild(label);

        var input_container = createDiv(null, "col-sm-10");

        var input = document.createElement("textarea");
        input.id = id;
        input.name = id;
        input.classList.add("form-control");
        input_container.appendChild(input);

        text_container.appendChild(input_container);

        comment_container.appendChild(text_container);

        container.appendChild(comment_container);

        var remove_container = createDiv(null, "col-sm-2");

        var remove_button = createElement(
            'span',
            ["comment", "remove", comment_container].join("_"),
            ["btn", "btn-sm", "btn-danger", "remove"]
        );
        remove_button.innerHTML = "Remove Comment";
        remove_container.appendChild(remove_button);

        container.appendChild(remove_container);

        $("#CommentBox")[0].appendChild(container);
    });

    $("#CommentBox").on('click', ".remove", function(){
        var id = this.id.split("_").pop();

        var $field = $('#comment_' + id);

        $field.remove();
    });
}

function createDiv(id, classes) {
    return createElement('div', id, classes);
}

function createElement(elem, id, classes) {
    var div = document.createElement(elem);

    if ( classes instanceof Array ) {
        classes.map((item) => {
            div.classList.add(item);
        });
    }
    else if ( classes ) {
        div.classList.add(classes);
    }

    if ( id ) {
        div.id = id;
    }

    return div;
}