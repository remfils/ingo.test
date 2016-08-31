import EventEmmiter from 'events';
import dispatcher from '../dispatcher';

class ClickStore extends EventEmmiter {
    constructor() {
        super();

        this.ACTION_MENU_CLICK = "ACTION_TYPE_MENU_CLICK";
        this.ACTION_MENU_ITEM_CLICK = "ACTION_TYPE_MENU_ITEM_CLICK";

        this.EVENT_CLICK_MENU = "CLICK_MENU";
        this.EVENT_CLICK_MENU_ITEM = "CLICK_MENU_ITEM";
    }

    handleActions(action) {
        console.debug("This action is fired:", action);

        switch (action.type) {
            case this.ACTION_MENU_CLICK:
                this.emit(this.EVENT_CLICK_MENU);
                break;
            case this.ACTION_MENU_ITEM_CLICK:
                this.emit(this.EVENT_CLICK_MENU_ITEM, action.data);
                break;
        }
    }
}

const click_store = new ClickStore();
dispatcher.register(click_store.handleActions.bind(click_store));

export default click_store;