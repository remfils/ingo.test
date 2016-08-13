var config = {
    DEBUG: false,
    SITE_NAME: "http://" + document.domain + "/"
};

console.log(config.SITE_NAME);

config['ASSET_PATH'] = config.SITE_NAME + "web/";

export default config;