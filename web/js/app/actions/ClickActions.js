import dispatcher from "../dispatcher";
import ClickStore from "../stores/ClickStore";

export function clickTitleMenu() {
    dispatcher.dispatch({
        type: ClickStore.ACTION_MENU_CLICK,
        data: null
    });
}

export function clickMenuItem(current_page_name, next_page_name) {
    dispatcher.dispatch({
        type: ClickStore.ACTION_MENU_ITEM_CLICK,
        data: {
            from: current_page_name,
            to: next_page_name
        }
    });
}