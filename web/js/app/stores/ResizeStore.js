import EventEmmiter from 'events';
import dispatcher from '../dispatcher';

class ResizeStore extends EventEmmiter {
    constructor() {
        super();
        this.current_action = null;
        this.data = null;
    }

    handleActions(action) {
        this.current_action = action;
        this.data = action.params;
        this.emit("RESIZE_TABLE_HEADER");
    }
}

const resize_store = new ResizeStore();
dispatcher.register(resize_store.handleActions.bind(resize_store));

export default resize_store;