// Parses input, does syntax highlighting and initializes arrays with 
// data to feed later into the data structure

// This function looks for keywords, parenthesis and quotes and encloses
// the findings in <span></span> tags with the appropiate class. It passes
// through the whole input string only once. Saves all edges in an edges
// array and all the nodes in a nodes array, where nodes[i] are the nodes 
// spanned by edges[i]
function processSymbols(str)
{
	resetCanvas();
			
	colorIndex = 0; // restart the color for the edges, this is in randColor.js
	
	var output = ''; // the output string with syntax highlighting
	edges_str = '';  // the string with all the edges
	nodes_str = '';  // the string with all the nodes

	// State variables
	var firstTime = 0;
	var count = 0;

	var impliesComing = 0;
	var nodesComing = 0;

	var lptilda = 0; // last starting " character
	var lppar = 0;   // last starting parenthesis

	var beginVar = -1;
	var asserting = 0;

	var lastPredicate = '';
	
	for ( var i = 0; i < str.length; i++ )
	{
		// Check for quotes. for quotes we need a count variable to be able
		// to match them since the quotes on the left are the same as the right.
		// Enclose all terms in quotes in a span with class edge. Save all these
		// edges in the edges array.
		if (str[i] == '"')
		{
			if ( count % 2 != 0 )
			{
				output += "</span>";

				var classImplies = '';
				if(impliesComing)
				{
					classImplies = 'span-implies';
					edges_str += '<div class="arrow-right"></div>';
				}
				var pred = str.substring(lptilda,i);
				edges_str += '<span class="edge '+classImplies+'"><a>' + pred + "</a>";
				lastPredicate = pred; // Save the last predicate symbol so we can assign
				// the same color to the same symbol later
			}
			else
			{
				output += "<span class='symbol'>";
				lptilda = i+1;
			}
			count ++;
		}
		// Match the parenthesis and save all the nodes to the nodes array.
		// The nodes we are parsing a little different since there can be many
		// nodes in a set of parenthesis. So we match the parenthesis, and then
		// we parse the string inside taking comma separated string (these are 
		// the actual nodes)
		else if (str[i] == '(')
		{
			lppar = i+1;
			output += "(<span class='predicate'>";
		}
		else if (str[i] == ')')
		{
			output += "</span>)";

			// Use the last predicate to add the same color to the same predicate
			// symbols
			var color = getRandomColor(lastPredicate);

			// Try taking out the extra space characters. Not working correctly
			var allnodes = str.substring(lppar,i).replace(" ","").split(",");
			
			edges_str += '<span class="nodes" style="background-color:'+color+';">'
			for (var nn in allnodes)
			{
				if(allnodes[nn] == "" || allnodes[nn] == " ") continue;
				var temp = allnodes[nn].replace(" ","");
				edges_str += '<span class="node">' + temp + '</span>';
			}

			edges_str += '</span></span>';
		}
		// Take care of the introduction of variables. This should happen at the beggining
		// of the input.
		else if( ( str.substr(i, i+6) ) == 'intro ' )
		{
			output += '<div class="wff"><span class="keywords">intro </span><span class="var">';
			i += 5;
			beginVar = i+1;
		}
		// Take care of assumptions. They should come between introducions and assertions
		else if ( (str.substring(i, i+7)) == 'assume ' )
		{
			if ( firstTime == 0 )
			{
				output += '<div class="wff assume"><span class="keywords">assume </span>';
				edges_str += '<div class="wff-a assume">';
				firstTime = 1;
			}
			else output += '</div><div class="wff assume"><span class="keywords">assume </span>';
			edges_str += '<div class="clear"></div></div><div class="wff-a assume">';

			impliesComing = 0;
			i += 6;
			nodesComing = i+1;
			beginVar = -1;
			asserting = 1;
		}
		// Match the forall keyword and enclose it in a span. These are the assertions
		else if ( (str.substring(i, i+8)) == 'for all ' )
		{
			if ( firstTime == 0 )
			{
				output += '<div class="wff assert"><span class="keywords">for all </span>';
				edges_str += '<div class="wff-a assert">';
				firstTime = 1;
			}
			else output += '</div><div class="wff assert"><span class="keywords">for all </span>';
			edges_str += '<div class="clear"></div></div><div class="wff-a assert">';

			impliesComing = 0;
			i += 7;
			nodesComing = i+1;
			beginVar = -1;
			asserting = 0;
		}
		// This is the end delimiter for variables. if we are in an intro statement, then it's the end
		// of a line. Otherwise we are in an assertion statement
		else if( str[i] == "." )
		{
			if (beginVar != -1)
			{
				var nn = str.substring(beginVar, i).replace(" ","");
				var ex = nn.split(",");
				for (ii in ex)
				{
					var temp = ex[ii].replace(" ","");
					nodes_str += "<span class='a-node'>" + temp + "</span><div class='clear'></div>";
				}
				beginVar = -1;
				output += "</span></div>";
			}
			else
			{
				var nn = str.substring(nodesComing, i);
				var ex = nn.split(",");
				for (ii in ex)
				{
					nodes_str += "<span class='a-node var'>" + ex[ii] + "</span><div class='clear'></div>";
				}
			}
		}
		// Match the and keyword
		else if ( (str.substring(i, i+4)) == 'and ' )
		{
			output += '<span class="keywords">and </span>';
			edges_str += '<span class="and">a</span>';
			i += 3;
		}
		// Match the or keyword
		else if ( (str.substring(i, i+3)) == 'or ' )
		{
			output += '<span class="keywords">or </span>';
			i += 2;
		}
		// Match the not keyword
		else if ( (str.substring(i, i+4)) == 'not ' )
		{
			output += '<span class="keywords">not </span>';
			i += 3;
		}
		// Match the implies keyword
		else if ( (str.substring(i, i+8)) == 'implies ' )
		{
			output += '<span class="implies">implies </span>';
			impliesComing = 1;
			i += 7;
		}
		// Anything that is not matched will be put into the 
		// output string without any changes.
		else output += str[i];
	}
	output += '</div>';
	edges_str += '</div>';
	return output;
}

var fd = null; // the graph drawing

// This is called when the graph button is pressed. It traverses the parsed out input and creates
// a graph. Then it draws it.
function makeGraph() { 
	var graph = new Hypergraph(); // create new graph
	var graphjson = []; // This is the json array that keeps the representation of the graph 
	// that we can pass to the graphing library.

	var assertions = []; // This is the json array that will be passed into the Hypergraph() to 
	// perform the transit operation.

	// Traverse the introduced nodes and add them to the graph
	$(".a-node").not(".var").each(function(index){
		//console.log("Adding node: " + $(this).text());
		graph.newNode($(this).text());
		graphjson.push({
			"adjacencies": [],
			"id": $(this).text(),
			"name": $(this).text()
		});
	});

	// Traverse all the assumptions. Add all these edges to the graph. Also add the edges to 
	// the graphjson structure in order to draw them later
	$(".wff-a.assume").each(function(index){
		if ( index > 0 ) // little hack because we have an extra div floating around
		{
			$(this).children().filter(".edge").not(".span-implies").each(function(){
				var command = "graph.newEdge(";
				$(this).children().each(function(index){
					if ( index == 0 ) // title
					{
						command += "'" + $(this).text() + "', ";
					}
					else // nodes
					{
						var count = 0;
						var tmp_str = "";
						$(this).children().filter(".node").each(function(){
							var tempSel = $(this);
							$.each(graphjson, function(){
								if(this["name"] == tempSel.text())
								{
									if ( tempSel.next(".node").text() != "" )
									{
										this["adjacencies"].push(
																{
																	"nodeTo": tempSel.next(".node").text(),
																	"nodeFrom": tempSel.text(),
																	"data": {
																		"$color": tempSel.parent().css("background-color")
																			}
																}
																);
									}
								}
							});
							tmp_str += ", '" + $(this).text() + "'";
							count ++;
						});
						command += count + tmp_str;
					}
				});
				command += ");";
				//console.log(command);
				eval(command);
			});
		}
	});

	// Draw the graph and log stuff.
	fd = drawGraph(graphjson, fd);
	console.log('graphjson at the beginning:');
	console.log(graphjson);

	var count = 0;
	// Add the assertions to the assertions json array
	$(".wff-a.assert").each(function(index){
			$(this).children().filter(".edge").each(function(ii)
			{
				var currEdge = $(this);
				$(this).children().each(function(index){
					var currNode = $(this);
					if ( index == 0 ) // title
					{
						var type = "assert";
						if ( $(this).parent().hasClass("span-implies") ) type = "implies";
						assertions.push({
							"edge-name":$(this).text(),
							"type":type,
							"adjacencies": []
						});
						$(this).siblings().filter(".nodes").children().filter(".node").each(function(){
							//console.log(assertions[ii]);
							assertions[count]["adjacencies"].push($(this).text());
						});
						count ++;
					}
				});
			});
	});
	

	// Add the variables to the assertions json array. This will make thigs easier in the 
	// Hypergraph()'s transit and closure operation
	$(".a-node.var").each(function(index){
		console.log($(this).text());
		assertions.push({
							"node-name":$(this).text(),
							"type":"node"
						});
	});
	
	//console.log('assertions:');
	//console.log(assertions);
    
    //////////////////////////////////////////////////////////////
    // ADDITIONS

	return [graph, assertions];
    
    //transit(graph, assertions);
    
    //////////////////////////////////////////////////////////////
    
};

function drawTheGraph(graph)
{
	var graphjson = []; // This is the json array that will be passed into the Hypergraph() to 
	// perform the transit operation.

	for (node in graph.nodes)
	{
		console.log(node);
		graphjson.push({
			"adjacencies": [],
			"id": node,
			"name": node
		});
	}

	console.log("before");
	console.log(graphjson);
	//console.log(graph.edges["P"]);

	$.each(graphjson, function(){
		var currentNode = this;
		//console.log(currentNode["name"]);
		for (edgeName in graph.edges)
		{
			//console.log("edge name " + edgeName);
			for (edgeObject in graph.edges[edgeName])
			{
				if (currentNode["name"] == edgeObject[0])
				{
					currentNode["adjacencies"].push(
						{
							"nodeTo": edgeObject[1],
							"nodeFrom": edgeObject[0],
							"data": {
								"$color": getRandomColor(edgeName)
								}
						}
					);
				}
			}
		}
	});

	console.log("after");
	console.log(graphjson);

	fd = drawGraph(graphjson, fd);
	
	/*$.each(graphjson, function(){
		if(this["name"] == tempSel.text())
		{
			if ( tempSel.next(".node").text() != "" )
			{
				this["adjacencies"].push(
										{
											"nodeTo": tempSel.next(".node").text(),
											"nodeFrom": tempSel.text(),
											"data": {
												"$color": tempSel.parent().css("background-color")
													}
										}
										);
			}
		}
	});*/
}

// This function is called every time that a key in pressed
// inside the input area. It takes the output from the processed
// input string and writes to the right divs.
function update()
{	
	var thestring = $("#input").val();

	thestring = processSymbols(thestring);
	
	$("div.#output").html(thestring);
	$("div.#edges-area").html(edges_str);
	$("div.#nodes-area").html(nodes_str);
}
