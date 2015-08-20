/*Initialize the scene and camera*/
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
var rotateCamera = true; //flag to stop the rotation when cube is being dragged
var rotateReact = true; //flag to stop the rotation when "stop rotation"-box is checked
var showAxis = true

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
var canvas = renderer.domElement;
canvas.addEventListener("mousedown", function(){rotateCamera = false;})
canvas.addEventListener("mouseup", function(){rotateCamera = true;})
document.body.appendChild(canvas);


//Actual cube

var geometry = new THREE.BoxGeometry( 1, 1, 1 );

var color = []; //array that holds cubes color values rgb separetly

//Creating materials and mesh
var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.FaceColors } );
var cube1 = new THREE.Mesh( geometry, material );
var borders = new THREE.BoxHelper(cube1);
cube1.material.color.setRGB(color[0], color[1], color[2]);
borders.material.color.set( 0x000000 );
renderer.setClearColor( 0xffffff, 1);

//Function to initialize colors and to reset colors back to starting color
var initColors = function() {
	color[0] = 0;
	color[1] = 0;
	color[2] = 1;
	cube1.material.color.setRGB(color[0], color[1], color[2]);
	cube1.geometry.colorsNeedUpdate = true;
}

/*Coordinate axis*/

//Arrow lines
var xAxis = new THREE.Mesh(new THREE.BoxGeometry(2,0.05,0.05),new THREE.MeshBasicMaterial({color: 0xFF3061}));
var yAxis = new THREE.Mesh(new THREE.BoxGeometry(0.05,2,0.05),new THREE.MeshBasicMaterial({color: 0xE4FF00}));
var zAxis = new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,2),new THREE.MeshBasicMaterial({color: 0x00FF7E}));

//Arrow tips
var xCone = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.1, 0.4, 50, 50, false), new THREE.MeshBasicMaterial({color: 0xFF3061}));
xCone.overdraw = true;
var yCone = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.1, 0.4, 50, 50, false), new THREE.MeshBasicMaterial({color: 0xE4FF00}));
yCone.overdraw = true;
var zCone = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.1, 0.4, 50, 50, false), new THREE.MeshBasicMaterial({color: 0x00FF7E}));
yCone.overdraw = true;

//Moving axis to their right places
xAxis.position.x = 1;
yAxis.position.y = 1;
zAxis.position.z = 1;

//Moving and rotating arrow tops to their right places
xCone.position.x = 2;
xCone.rotation.z = -Math.PI/2;
yCone.position.y = 2;
yCone.rotation.y = -Math.PI/2;
zCone.position.z = 2;
zCone.rotation.x = Math.PI/2;

//Creating a pivot point to make axis rotate with the cube
var pivot = new THREE.Object3D();
pivot.add(xAxis);
pivot.add(yAxis);
pivot.add(zAxis);
pivot.add(xCone);
pivot.add(yCone);
pivot.add(zCone);
//Add objects to scene
scene.add(pivot)
scene.add(borders);
scene.add( cube1 );

//Push camera out of the cube
camera.position.z = 5;

//Camera controls 
var controls = new THREE.TrackballControls( camera, canvas );
controls.rotateSpeed = 3.0;
controls.zoomSpeed = 1.2;
controls.noPan = true;
controls.staticMoving = true;
controls.minDistance = 1; //restrict camera from going inside the cube
controls.dynamicDampingFactor = 0.3;

pivot.traverse(function (object) {object.visible = false})
//Render function which updates the view
var render = function() {
	requestAnimationFrame( render );
	controls.update();
	if(rotateCamera && rotateReact) {
		pivot.rotation.x += 0.01;
		pivot.rotation.y += 0.01;
		cube1.rotation.x += 0.01;
		cube1.rotation.y += 0.01;
	}
	renderer.render( scene, camera );
}
controls.addEventListener( 'mousedown', render );

//function that either stops or starts rotatation depending is the cube rotating.
var changeRotation = function() {
	rotateReact = !rotateReact;
}
//Sets cubes color
var changeColor = function(colour, value) {
	//maps 0 to 255 values to 0 to 1 values
	if(colour == "r"){
		color[0] = value/255;
	}else if(colour == "g"){
		color[1] = value/255;
	}else{
		color[2] = value/255;
	}
	cube1.material.color.setRGB(color[0], color[1], color[2]);
	cube1.geometry.colorsNeedUpdate = true;
};
//returns current color of the cube
var getColor = function() {
	return color.map(function(c) {return c*255}); //maps 0 to 1 values to 0 to 255 rgb values
};
//exports to other modules
exports.render = render;
exports.pivot = pivot;
exports.changeRotation = changeRotation;
exports.initColors = initColors;
exports.changeColor = changeColor;
exports.getColor = getColor;