// Parses input, does syntax highlighting and initializes arrays with 
// data to feed later into the data structure

// This function looks for keywords, parenthesis and quotes and encloses
// the findings in <span></span> tags with the appropiate class. It passes
// through the whole input string only once. Saves all edges in an edges
// array and all the nodes in a nodes array, where nodes[i] are the nodes 
// spanned by edges[i]
function processSymbols(str)
{
	var output = ''; // the output string with syntax highlighting
	edges_str = '';  // the string with all the edges
	nodes_str = '';  // the string with all the nodes

	// State variables
	var firstTime = 0;
	var count = 0;

	var lptilda = 0; // last starting " character
	var lppar = 0;   // last starting parenthesis
	
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
				edges.push(str.substring(lptilda,i));
				edges_str += '<span class="edge">' + str.substring(lptilda,i) + '</span><br/>';
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

			var allnodes = str.substring(lppar,i).split(",");
			
			nodes.push(allnodes);
			nodes_str += '<span class="nodes">'
			for (var nn in allnodes)
			{
				nodes_str += '<span class="node">' + allnodes[nn] + '</span>';
				drawNode(allnodes[nn]);
			}
			nodes_str += '</span><br/>';
		}
		// Match the forall keyword and enclose it in a span
		else if ( (str.substring(i, i+8)) == 'for all ' )
		{
			if ( firstTime == 0 )
			{
				output += '<span class="keywords">for all </span>';
				firstTime = 1;
			}
			else output += '<br/><br/><span class="keywords">for all </span>';
			i += 7;
		}
		// Match the and keyword
		else if ( (str.substring(i, i+4)) == 'and ' )
		{
			output += '<span class="keywords">and </span>';
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
			i += 7;
		}
		// Anything that is not matched will be put into the 
		// output string without any changes.
		else output += str[i];
	}
	return output;
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
