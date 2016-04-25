import dispatcher from "../dispatcher";

export function fromIndexToMovieTranstion(index_page, params={}) {
    createTransition("INDEX-MOVIE", index_page, params);
}

export function fromMovieToMovie(is_right, prev_page, params={}) {
    createTransition(
        "MOVIE-MOVIE_" + (is_right ? "RIGHT" : "LEFT"),
        prev_page,
        params
    );
}

function createTransition(type, prev_page, params) {
    params["prev_page"] = prev_page;

    dispatcher.dispatch({
        type: "TRANSITION_TO",
        transition_type: type,
        params
    });
}