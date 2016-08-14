import React from "react";

var $ = require('jquery');

export default class MovieImageRotator extends React.Component {
    static box_counter = 0;

    constructor() {
        super();

        MovieImageRotator.box_counter ++;
        this.id = "MovieImageRotator" + MovieImageRotator.box_counter;

        this.are_components_set = false;


        this.SWITCH_DURATION = 1.2;
        this.SWITCH_EASE = Expo.easeOut;
        this.SWITCH_A_DELAY = -this.SWITCH_DURATION * 2.8 / 3;
        this.SWITCH_B_DELAY = -this.SWITCH_DURATION * 2.3 / 3;


        this.state = {
            is_transition_finished: true
        };
    }

    get id() {
        return "#" + this._id;
    }

    set id(val) {
        this._id = val;
    }

    componentWillMount() {
        this.setState({current_movie: this.props.movie});
    }

    componentWillUpdate(nextProps, nextState) {
        var current_movie = this.props.movie;
        var next_movie = nextProps.movie;

        if ( current_movie.id === next_movie.id ) {
            return;
        }

        console.log("DEBUG(MovieImageRotator): componentUpdate current_movie, next_movie", current_movie, next_movie);

        var $this = $(this.id);

        var is_left = false;

        $this.find('.movie-curtain').addClass('right');

        $this.find('.current-image').css('z-index', 1);
        $this.find('#cover1').css('background', current_movie.color);
        $this.find('#cover2').css('background', next_movie.color);
        $this.find('.next-image').css({
            'background-image': "url(" + next_movie.logo + ")",
            'z-index': 10
        });

        var tl = new TimelineLite();
        tl.to('#cover1', this.SWITCH_DURATION * 1.2, {width: "100%", ease: this.SWITCH_EASE})
            .to("#cover2", this.SWITCH_DURATION, {delay: this.SWITCH_A_DELAY, width: "100%", ease: this.SWITCH_EASE})
            .from(".next-image", this.SWITCH_DURATION, {
                delay: this.SWITCH_B_DELAY,
                x: (is_left ? "-" : "") + "100%",
                ease: this.SWITCH_EASE,
                onComplete: () => {
                    $('.movie-curtain').removeClass('left')
                        .removeClass('right');

                    var $next_image = $('.next-image');
                    var $current_image = $('.current-image');

                    $next_image.removeClass('left')
                        .removeClass('right');

                    var bgi = $next_image.css('background-image');
                    $next_image.css('background-image', $current_image.css('background-image'));
                    $current_image.css('background-image', bgi);

                    $current_image.css('z-index', 10);
                    $next_image.css('z-index', 1);

                    this.setState({current_movie: next_movie});
                }
            })
            .set('#cover1', {width: "0"})
            .set('#cover2', {width: "0"})
    }

    render() {
        var current_logo_style = {backgroundImage: "url(" + this.state.current_movie.image_url + ")"};

        return <div id={this._id} class="project-main-image">
            <div class="current-image" style={current_logo_style}></div>
            <div id="cover1" class="movie-curtain"></div>
            <div id="cover2" class="movie-curtain"></div>
            <div class="next-image"></div>
        </div>;
    }
}
