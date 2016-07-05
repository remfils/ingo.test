import EventEmmiter from 'events';
import dispatcher from '../dispatcher';

class ResizeStore extends EventEmmiter {

    constructor() {
        this.current_action = null;
    }

    handleActions(action) {
        this.current_action = action;
        this.emit("resize");
    }
}

const resize_store = new ResizeStore();
dispatcher.register(resize_store.handleActions.bind(resize_store));

export default resize_store;