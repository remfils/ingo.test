var config = {
    DEBUG: false,
    SITE_NAME: "http://" + document.domain + "/",
    SUBDOMAIN_NAME: '',
};

//config.SITE_NAME = "http://ingo.test/";
config.SITE_NAME = "http://localhost:3000/";
//config.SITE_NAME = "http://www.ingoscheel.com/";
//config.SUBDOMAIN_NAME = 'i.test/';
//config.SITE_NAME = "http://192.168.0.100:3000/";
//config.SITE_NAME = "http://wsh1490.web-shop-hosting.com/i.test/";

console.log(config.SITE_NAME);

//config.SITE_NAME += config.SUBDOMAIN_NAME;

config['ASSET_PATH'] = config.SITE_NAME +"web/";

config['MIN_LOAD_TIME'] = 3500;
//config['MIN_LOAD_TIME'] = 3500000;
//config['MIN_LOAD_TIME'] = 0;

export default config;
