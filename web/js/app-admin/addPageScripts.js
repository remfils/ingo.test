var $ = require("jquery");

var field_count = 1;

export function addFieldButtonsClickListeners() {
    $('#AddField').click(function(){
        field_count ++;

        var container = document.createElement('div');
        container.classList.add('form-group');
        container.id = "field-" + field_count;

        var name_row = createInfoRow('name');
        container.appendChild(name_row);

        var value_row = createInfoRow('value');
        container.appendChild(value_row);

        var field_container = document.createElement('div');
        field_container.classList.add('col-md-4');
        field_container.classList.add('no-float');
        field_container.style['vertical-align'] = "bottom";
        var btn = document.createElement('span');
        btn.id = "field-remove-" + field_count;
        btn.innerHTML = "Remove";
        btn.classList.add('btn');
        btn.classList.add('btn-sm');
        btn.classList.add('btn-danger');
        btn.classList.add('remove');
        field_container.appendChild(btn);
        container.appendChild(field_container);

        var table = $("#ProjectInfoTable")[0];
        table.appendChild(container);
    });

    $("#ProjectInfoTable").on('click', ".remove", function(){
        var id = this.id.split("-").pop();

        var $field = $('#field-' + id);

        if ( $field.parent().children().length > 1 ) {
            $field.remove();
        }
        else {
            alert('There has to be at least one field');
        }
    });
};

function createInfoRow (row_type) {
    var field_container = document.createElement('div');
    field_container.classList.add('col-md-4');
    field_container.classList.add('no-float');

    var field_id = ["field", row_type, field_count].join('-');

    var label = document.createElement('label');
    label.htmlFor = field_id;
    label.innerHTML = "Field " + row_type + ":";

    var input = document.createElement('input');
    input.type = "text";
    input.id = field_id;
    input.name = ["field", row_type, field_count].join('_');
    input.classList.add("form-control");

    field_container.appendChild(label);
    field_container.appendChild(input);

    return field_container;
};

export function addButtonsClickListeners() {
    $("#CommentBox").on("click", "");
}