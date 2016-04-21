import EventEmmiter from 'events';

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
}

const transition_store = new TransitionStore();

export default transition_store;
