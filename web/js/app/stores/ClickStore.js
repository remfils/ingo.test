import EventEmmiter from 'events';
import dispatcher from '../dispatcher';

class ClickStore extends EventEmmiter {
    constructor() {
        super();

        this.ACTION_MENU_CLICK = "ACTION_TYPE_MENU_CLICK";

        this.EVENT_CLICK_MENU = "CLICK_MENU";
    }

    handleActions(action) {
        switch (action.type) {
            case this.ACTION_MENU_CLICK:
                this.emit(this.EVENT_CLICK_MENU);
                break;
        }
    }
}

const click_store = new ClickStore();
dispatcher.register(click_store.handleActions.bind(click_store));

export default click_store;