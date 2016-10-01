import config from "./config";

export function asset(url) {
    return config.ASSET_PATH + url;
}

export function padIntegerWithZeros (num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

export function createNotReadyYetFunction(feature) {
    return function(e) {
        e.preventDefault();
        notReadyYet(feature);
        return false;
    }
}

export function notReadyYet(feature) {
    alert(feature + " is not reay yet!");
}

export function createCountdownCallback(callback, c) {
    var counter = c;
    return function() {
        if (!--c) {
            callback();
        }
    }
}

export function hexToRgba(hex, alpha) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result)
        return 'rgba(0,0,0,0)';

    var r = parseInt(result[1], 16),
        g = parseInt(result[2], 16),
        b = parseInt(result[3], 16);

    return 'rgba(' + [r,g,b,alpha].join(',') + ')';
}

export function lockScroll() {
    $(document).bind('scroll',function () {
        window.scrollTo(0,0);
    });
}

export function unlockScroll() {
    $(document).unbind('scroll');
}

export function changeUrl(clean_url) {
    window.history.pushState({}, '', config.SITE_NAME + config.SUBDOMAIN_NAME + clean_url);
}