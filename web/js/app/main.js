import React from 'react';
import ReactDOM from 'react-dom';
import 'gsap';
// require('gsap/src/minified/plugins/ColorPropsPlugin.min');
require('../../../node_modules/gsap/src/minified/plugins/ColorPropsPlugin.min');

import Application from './Application';

var app = document.getElementById('App');

ReactDOM.render(<Application />, app);