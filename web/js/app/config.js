var config = {
    DEBUG: false,
    HOME: true,
    SITE_NAME: "http://ingo-test.tk/"
};

if ( config.HOME ) {
     config.SITE_NAME = "http://ingo.test/web/";
};

config['ASSET_PATH'] = config.SITE_NAME;

export default config;