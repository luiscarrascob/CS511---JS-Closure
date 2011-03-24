// GLOBAL VARIABLES
var edges_str = '';			// Output string for edges div

var nodes_str = '';			//Output string for nodes div 

var ctx;						//Canvas variable

// MAIN
$(document).ready(function(){

	var firstTime = true;
	var firstTimeButton = true;

	randomizeColors();
	
	// initializes the canvas, and sets the focus to the input area
	$("#input").focus();

	// Every Keystroke call update, this is on parsing.js
	//update();
	$("#input").keyup(function(){
		update();
		if ( firstTime )
		{
			$.scrollTo( $(this).prev("h2"), 800);
			firstTime = false;
		}
	});

	$("#submit-button").click(function () { 
		makeGraph();
		if ( firstTimeButton )
		{
			$.scrollTo( $("#infovis").prev("h2"), 800);
			firstTimeButton = false;
		}
	});

	$("#transit-button").click(function () {
		alert("Transit not yet implemented");
	});
});

