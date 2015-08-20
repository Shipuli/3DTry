var cube = require('./Cube'); //requires cube so that components can change cubes attributes through cubes methods
var React = require('react');

exports.init = function () {

//Generate title
/*** @jsx React.DOM */

var colors = {Red:0,Green:1,Blue:2} //object to hold indices of colors

/*Main/Top React class*/
var App = React.createClass({

	render: function() {
		return (
			<div className="wrapper">
				<div id="editor-title">
					<h1>Cube Editor</h1>
				</div>
				<Checkboxes />
				<ul className="side">
					<ColorMenu/>
				</ul>
			</div>
			)
	}
});

//Class to hold different toggling options
var Checkboxes = React.createClass({
	render: function() {
		return (
			<div id="checkbox">
				<OptionBoxes />
			</div>
			)
	}

});

//All checkbox options.(stop rotation, show coordinate axels, reset colors)
var OptionBoxes = React.createClass({
	getInitialState: function() {
		return{show : true}; //sets show state ready before changeAxis is called
	},
	changeRotation: function () {
		//call cube.js changeRotation to stop or continue rotation
		cube.changeRotation();
	},
	changeAxis: function () {
		var s = this.state.show
		cube.pivot.traverse(function (object) {object.visible = s}); //makes objects added to pivot visible
		this.setState({show: !this.state.show});
	},
	initColors: function() {
		cube.initColors(); //resets colors
	},
	render: function () {
		return (
			<ul>
				<li><label><input onChange={this.changeRotation} type="checkbox" value="false" />Stop Rotation</label></li>
				<li><label><input onChange={this.changeAxis} type="checkbox" value="false" />Show Coordinate Axels</label></li>
				<li><label><input onChange={this.initColors} type="checkbox" value="false" />Reset Colors </label></li>
			</ul>
			)
	}
});


//Gathers all rgb colorsliders together
var ColorMenu = React.createClass({
	render: function() {
		return (
			<li> <h2>Color</h2>
				<ul className="side-color">
					<li><ColorSlider side = {this.props.side} color="Red" /></li>
					<li><ColorSlider side = {this.props.side} color="Green" /></li>
					<li><ColorSlider side = {this.props.side} color="Blue" /></li>
				</ul>
			</li>
			)
	}
});


//ColorSlider creates one slider for red, green or blue. Is part of the color menu
var ColorSlider = React.createClass({

	getInitialState: function () {
		var c = cube.getColor();
		return {value: c[colors[this.props.color]]};
	},

	handleEvent: function(event) {
		if(event.target.value != this.state.value){
			this.setState({value: event.target.value});
			if(this.props.color == "Red"){
				cube.changeColor("r",this.state.value)
			}else if(this.props.color == "Blue"){
				cube.changeColor("b", this.state.value)
			}else{
				cube.changeColor("g", this.state.value)
			}
		}
	},

	render: function() {
		var value = this.state.value;
		return(
			<div>
				<label>{this.props.color}</label>
				<input defaultValue={this.state.value} type="range" min="0" max="255"  onChange={this.handleEvent} />
				<label className="color-value">{this.state.value}</label>
			</div>
		)	
	}
});

React.render(<App />, document.getElementById('target'));
};