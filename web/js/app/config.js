var config = {
    DEBUG: true,
    ASSET_PATH: "http://ingo-test.tk/web/"
};

if ( config.DEBUG ) {
    config.ASSET_PATH = "http://ingo.test/web/";
};

export default config;