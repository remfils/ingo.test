import dispatcher from "../dispatcher";

export function fromIndexToMovieTranstion(index_page, params={}) {
    createTransition("INDEX-MOVIE", index_page, params);
}

export function fromMovieToIndexTransition(movie_page, params={}) {
    createTransition("MOVIE-INDEX", movie_page, params);
}

// TODO: DEPRECATED
export function fromIndexToContactTransition(index_page, params={}) {
    createTransition("INDEX-CONTACT", index_page, params);
}

// TODO: DEPRECATED
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

export function fromWorksToMovie(works_page, movie_id, params={}) {
    params.movie_id = movie_id;

    createTransition(
        "WORKS-MOVIE",
        works_page,
        params
    );
}

export function fromMovieToWorks(movie_page, movie_index, params={}) {
    params.movie_index = movie_index;

    createTransition(
        "MOVIE-WORKS",
        movie_page,
        params
    );
}

export function backTransition(to_page_transition_part, params={}) {
    params['to_page'] = to_page_transition_part;
    
    setTimeout(() => {
        dispatcher.dispatch({
            type: "BACK_TO",
            params
        });
    });
}

export function createTransition(type, prev_page, params) {
    params["prev_page"] = prev_page;

    setTimeout(() => {
        dispatcher.dispatch({
            type: "TRANSITION_TO",
            transition_type: type,
            params
        });
    }, 1);

}
