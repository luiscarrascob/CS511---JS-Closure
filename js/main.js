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

	$("#propositional-button").click(function () {
		var text = $("#input").text();
		text += '\n\n\nfor all a,b,x. "is_impl_of"(x,a,b) and "true"(a) and "true"(x) implies "true"(b)\n';
		text += 'for all a,b,x. "is_impl_of"(x,a,b) and "false"(a) and "true"(x) implies "false"(b)\n';
		text += 'for all a,b,x. "is_impl_of"(x,a,b) and "true"(b) implies "true"(x)\n';
		text += 'for all a,b,x. "is_impl_of"(x,a,b) and "true"(a) and "false"(b) implies "false"(x)\n';
		text += 'for all a,b,x. "is_impl_of"(x,a,b) and "true"(a) and "false"(x) implies "false"(b)\n';
		text += 'for all a,b,x. "is_impl_of"(x,a,b) and "false"(a) and "false"(b) implies "true"(x)\n';
		text += 'for all a,b,x. "is_impl_of"(x,a,b) and "false"(a) and "true"(b) implies "true"(x)\n';
		text += 'for all a,b,x. "is_conj_of"(x,a,b) and "true"(a) and "true"(b) implies "true"(x)\n';
		text += 'for all a,b,x. "is_conj_of"(x,a,b) and "true"(a) and "true"(x) implies "true"(b)\n';
		text += 'for all a,b,x. "is_conj_of"(x,a,b) and "true"(b) and "true"(x) implies "true"(a)\n';
		text += 'for all a,b,x. "is_conj_of"(x,a,b) and "false"(a) implies "false"(x)\n';
		text += 'for all a,b,x. "is_conj_of"(x,a,b) and "false"(b) implies "false"(x)\n';
		text += 'for all a,b,x. "is_conj_of"(x,a,b) and "true"(a) and "false"(x) implies "false"(b)\n';
		text += 'for all a,b,x. "is_conj_of"(x,a,b) and "true"(b) and "false"(x) implies "false"(a)\n';
		text += 'for all a,b,x. "is_disj_of"(x,a,b) and "true"(a) implies "true"(x)\n';
		text += 'for all a,b,x. "is_disj_of"(x,a,b) and "true"(b) implies "true"(x)\n';
		text += 'for all a,b,x. "is_disj_of"(x,a,b) and "false"(a) and "false"(b) implies "false"(x)\n';
		text += 'for all a,b,x. "is_disj_of"(x,a,b) and "false"(a) and "true"(x) implies "true"(b)\n';
		text += 'for all a,b,x. "is_disj_of"(x,a,b) and "false"(b) and "true"(x) implies "true"(a)\n';

		$("#input").html(text);
		
		update();
	});

	$("#transit-button").click(function () {
		var execStartTime = new Date().getTime();
		graph = transit(graph, assertions);
		var elapsed = new Date().getTime() - execStartTime;
		$("#timem").html(elapsed);
		console.log("Graph after edges drawn:");
		console.log(graph);
		
		var shouldDraw = 1;
		if (elapsed > 3000) shouldDraw = 0;

		if (shouldDraw)
		{
			var outputText = drawTheGraph(graph, shouldDraw);
			$("div.#transitoutput").html(outputText);
		}
		else
		{
			var outputText = simpleGraph(graph);
			$("div.#transitoutput").html(outputText);
		}
	});
});

