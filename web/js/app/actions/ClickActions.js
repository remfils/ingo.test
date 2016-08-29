import dispatcher from "../dispatcher";
import ClickStore from "../stores/ClickStore";

export function clickTitleMenu() {
    dispatcher.dispatch({
        type: ClickStore.ACTION_MENU_CLICK
    });
}