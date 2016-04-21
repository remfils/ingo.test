import dispatcher from "../dispatcher";

export function fromIndexToMovieTranstion() {
    dispatcher.dispatch({
        type: "TRANSITION_TO",
        transition_type: "INDEX-MOVIE"
    });
}

export function fromMovieToMovie(is_right, next_movie, params) {
    dispatcher.dispatch({
        type: "TRANSITION_TO",
        transition_type: "MOVIE_MOVIE_" + (is_right ? "RIGHT" : "LEFT"),
        next_movie,
        params
    });
}