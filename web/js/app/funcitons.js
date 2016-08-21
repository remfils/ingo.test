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
        alert(feature + " is not reay yet!");
        return false;
    }
}
