import dispatcher from "../dispatcher";

export function fromIndexToMovieTranstion(index_page, params={}) {
    createTransition("INDEX-MOVIE", index_page, params);
}

export function fromMovieToIndexTransition(movie_page, params={}) {
    createTransition("MOVIE-INDEX", movie_page, params);
}

export function fromIndexToContactTransition(index_page, params={}) {
    createTransition("INDEX-CONTACT", index_page, params);
}

export function fromContactToIndexTransition(contact_page, params={}) {
    createTransition("CONTACT-INDEX", contact_page, params);
}

export function createTitleTransition(from_page_name, to_page_name , current_page, params={}) {
    console.debug(from_page_name + "-" + to_page_name);
    createTransition(from_page_name + "-" + to_page_name, current_page, params);
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