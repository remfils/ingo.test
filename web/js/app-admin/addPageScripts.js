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
        var $this = $(this);
        var en_id = $this.data('id-en');
        var de_id = $this.data('id-de');

        var remove_field = function(lang, id) {
            var $field = $('#field-' + lang + '-' + id);

            var remove_marker = createRemoveMarker(lang, 'fields', id);
            $field.append(remove_marker);
        }

        remove_field('en', en_id);
        remove_field('de', de_id);

        $('#ProjectFieldGroup-' + de_id).hide();
    });
};

function createRemoveMarker(lang, type, id) {
    var marker = document.createElement('input');
    marker.type = 'hidden';
    marker.name = 'project['+lang+']['+type+']['+id+'][delete]';
    marker.value = true;

    return marker;
}

function createField(name = "", value = "") {
    field_count ++;

    var container = document.createElement('div');
    container.classList.add('form-group');
    container.id = "ProjectFieldGroup-" + field_count;

    var input_container = document.createElement('div');
    input_container.classList.add('col-lg-12');

    var de_row = createLangRow('de', name, value);
    input_container.appendChild(de_row);

    var en_row = createLangRow('en', name, value);
    input_container.appendChild(en_row);

    container.appendChild(input_container);

    var new_marker = createNewMarker('de', 'fields', field_count);
    container.appendChild(new_marker);

    new_marker = createNewMarker('en', 'fields', field_count);
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
    lang_container.id = "field-" + lang + "-" + field_count;
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

function createNewMarker(lang, type, index) {
    var marker = document.createElement('input');
    marker.type = 'hidden';
    marker.name = 'project['+lang+']['+type+']['+index+'][new]';
    marker.value = true;

    return marker;
}

var comment_count = 1;

export function setCommentCounter(counter) {
    comment_count = counter;
}

export function addCommentClickListeners() {
    $("#AddComment").on("click", (e) => {
        createComment();
    });

    $("#CommentBox").on('click', ".remove", function(){
        var $this = $(this);
        var id_de = $this.data('id-de');
        var id_en = $this.data('id-en');

        var $field = $('#comment_' + id);

        var remove_marker_de = createRemoveMarker('de','comments', id_de);
        var remove_marker_en = createRemoveMarker('en','comments', id_en);
        $field.append(remove_marker_de)
            .append(remove_marker_en)
            .hide();
    });
}

function createComment() {
    comment_count ++;

    var comment_container = createDiv(comment_count, ['form-group','comment-block']);
    var input_container = createDiv(null, 'col-sm-1');
    comment_container.appendChild(input_container);

    var input_container = createDiv(null, 'col-sm-9');

    var logo = createCommentLogo(comment_count);
    input_container.appendChild(logo);

    var text = createCommentText('de', comment_count);
    input_container.appendChild(text);

    var text = createCommentText('en', comment_count);
    input_container.appendChild(text);

    comment_container.appendChild(input_container);
    var btn_container = createDiv(null, 'col-sm-2');

    var btn = createRemoveCommentButton(comment_count);
    btn_container.appendChild(btn);
    comment_container.appendChild(btn_container);

    var marker = createNewMarker('de', 'comments', comment_count);

    comment_container.id = 'Comment-' + comment_container;

    $('#CommentBox').append(comment_container);
}

function createCommentLogo(comment_id) {
    var container = createDiv(null, 'form-group');

    var logo_name = 'project[de][comments][' + comment_id + ']';

    var label = createElement('label', null, ['col-sm-2','control-label']);
    label.innerHTML = "Image:";
    label.for = logo_name;
    container.appendChild(label);

    var input_container = createDiv(null, 'col-sm-6');

    var input = document.createElement('input');
    input.type = "file";
    input.name = logo_name;
    input_container.appendChild(input);

    container.appendChild(input_container);

    return container;
}

function createCommentText(lang, comment_id) {
    var field_id = 'comment_text_' + comment_id;
    var field_name = 'project['+lang+'][comments]['+comment_id+'][text]'

    var container = createDiv(null, 'form-group');

    var label = createElement('label', null, ['col-sm-2', 'control-label']);
    label.innerHTML = 'Text ('+lang+'):';
    label.for = field_name;
    container.appendChild(label);

    var input_container = createDiv(null, 'col-lg-10');

    var textarea = createElement('textarea', field_id, 'form-control');
    textarea.name = field_name;

    input_container.appendChild(textarea);

    container.appendChild(input_container);

    return container;
}

function createRemoveCommentButton(comment_id) {
    var btn = createElement('span', 'remove_comment_' + comment_id, ['btn', 'btn-sm', 'btn-danger', 'remove']);
    btn.innerHTML = 'Remove Comment';

    return btn;
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