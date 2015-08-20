var cube = require('./Cube');
var components = require('./Components.jsx');

document.addEventListener('DOMContentLoaded', function(){
	cube.initColors();
	components.init();
	cube.render();
});