// GLOBAL VARIABLES
var edges_str = '';			// Output string for edges div

var nodes_str = '';			//Output string for nodes div 

var ctx;						//Canvas variable

// MAIN
$(document).ready(function(){

	$("#message").hide();
	var firstTime = true;
	var firstTimeButton = true;

	var graph;
	var assertions = [];
	randomizeColors();
	
	// initializes the canvas, and sets the focus to the input area
	$("#input").focus();

	// Every Keystroke call update, this is on parsing.js
	//update();
	$("#input").keyup(function(){
		update();
		/*if ( firstTime )
		{
			$.scrollTo( $(this).prev("h2"), 800);
			firstTime = false;
		}*/
	});

	$("#submit-button").click(function () { 
		var ret = makeGraph();

		graph = ret[0];
		assertions = ret[1];

		console.log("Graph and assertions in main");
		console.log(graph);
		console.log(assertions);
		
		/*if ( firstTimeButton )
		{
			$.scrollTo( $("#infovis").prev("h2"), 800);
			firstTimeButton = false;
		}*/
	});

	$("#transit-button").click(function () {
		graph = transit(graph, assertions);
		console.log("Graph after edges drawn:");
		console.log(graph);
		var outputText = drawTheGraph(graph);
		$("div.#transitoutput").html(outputText);
	});
});

