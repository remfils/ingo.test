var config = {
    DEBUG: true,
    SITE_NAME: "http://ingo-test.tk/"
};

if ( config.DEBUG ) {
     config.SITE_NAME = "http://ingo.test/";
};

config['ASSET_PATH'] = config.SITE_NAME + 'web/';

export default config;