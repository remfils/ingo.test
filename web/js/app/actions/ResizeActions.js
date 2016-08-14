import dispatcher from "../dispatcher";

export function resizeTableHeaderAction(new_table_width) {
    dispatcher.dispatch({
        type: "RESIZE_TABLE_HEADER",
        params: {
            width: new_table_width
        }
    });
}