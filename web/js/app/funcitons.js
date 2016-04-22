import config from "./config";

export function asset(url) {
    return config.ASSET_PATH + url;
}
