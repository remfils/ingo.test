var config = {
    DEBUG: false,
    SITE_NAME: "http://" + document.domain + "/"
};

config.SITE_NAME = "http://localhost:3000/";
//config.SITE_NAME = "http://192.168.0.100:3000/";
//config.SITE_NAME = "http://wsh1490.web-shop-hosting.com/i.test/";

console.log(config.SITE_NAME);

config['ASSET_PATH'] = config.SITE_NAME + "web/";

export default config;