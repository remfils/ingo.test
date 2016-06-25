var config = {
    DEBUG: false,
    HOME: true,
    SITE_NAME: "http://" + document.domain + "/"
};

if ( config.HOME ) {
     config.SITE_NAME = "http://" + document.domain + "/";
};

config['ASSET_PATH'] = config.SITE_NAME + "web/";

export default config;