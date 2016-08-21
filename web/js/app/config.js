var config = {
    DEBUG: false,
    SITE_NAME: "http://" + document.domain + "/"
};

config.SITE_NAME = "http://localhost:3000/";

console.log(config.SITE_NAME);

config['ASSET_PATH'] = config.SITE_NAME + "web/";

export default config;