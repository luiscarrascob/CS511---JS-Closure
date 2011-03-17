// GLOBAL VARIABLES
var edges_str = '';			// Output string for edges div

var nodes_str = '';			//Output string for nodes div 

var ctx;						//Canvas variable

// MAIN
$(document).ready(function(){

	randomizeColors(); // Randomizes the list of colors (randColor.js)
	
	// initializes the canvas, and sets the focus to the input area
	ctx = $('#theCanvas')[0].getContext("2d");
	$("#input").focus();

	// Every Keystroke call update, this is on parsing.js
	update();
	$("#input").keyup(function(){
		update();
	});
});

