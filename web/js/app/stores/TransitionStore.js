import EventEmmiter from 'events';
import dispatcher from '../dispatcher';

class TransitionStore extends EventEmmiter {
    constructor() {
        super();
        this.current_page = this.INDEX_PAGE;

        this.INDEX_PAGE = 'index';
        this.MOVIE_PAGE = 'movie';
        this.MOVIE_PAGE_LEFT = 'movie-left';
        this.MOVIE_PAGE_RIGHT = 'movie-right';

        this.current_transition = null;

    }

    makeTransition(from, to, shared_timeline, params={}) {
        console.log(shared_timeline);
        this.current_transition = {from, to, sharedTimeline: shared_timeline, params};
        this.emit("leave");
    }

    goto(page) {
        this.prev_page = this.current_page;
        this.current_page = page;
        this.emit("leave");
    }

    handleActions(action) {
        console.log("recived:", action)
        switch ( action.type ) {
            case "TRANSITION_TO":
                console.log("is transition");

                this.current_transition = {
                    type: action.transition_type
                };
                var trans = this.current_transition;
                var params = action.params;
                for ( var param in params ) {
                    trans[param] = params[param];
                }

                setTimeout(() => {
                    this.emit("leave");
                }, 1);

            break;

        case "BACK_TO":
          console.log('this is back!');
          this.emit("back_to", action.params);
        }
    }
}

const transition_store = new TransitionStore();
dispatcher.register(transition_store.handleActions.bind(transition_store));

export default transition_store;
