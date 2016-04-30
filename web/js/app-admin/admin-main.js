var $ = require('jquery');

import * as AddPageScripts from './addPageScripts';

for ( var script_name in AddPageScripts ) {
    window[script_name] = AddPageScripts[script_name];
}