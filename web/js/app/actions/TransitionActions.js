import dispatcher from "../dispatcher";

export function fromIndexToMovieTranstion(shared_timeline, params={}) {
    createTransition("INDEX-MOVIE", shared_timeline, params);
}

export function fromMovieToMovie(is_right, shared_timeline, params={}) {
    createTransition(
        "MOVIE-MOVIE_" + (is_right ? "RIGHT" : "LEFT"),
        shared_timeline,
        params
    );
}

function createTransition(type, shared_timeline, params) {
    params["shared_timeline"] = shared_timeline;

    dispatcher.dispatch({
        type: "TRANSITION_TO",
        transition_type: type,
        params
    });
}