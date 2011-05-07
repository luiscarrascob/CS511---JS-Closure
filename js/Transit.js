function transit(graph, assertions) {
	var numEdgesAdded = 1;
	var execStartTime = new Date().getTime();
	while (numEdgesAdded > 0) {
		var startPoint = 0;
		numEdgesAdded = 0;
		while (startPoint < assertions.length) {
		
			// get the names of the variables of our assertion
			var variableNames = new Object;
			var variableNameArray = new Array;
			
			var numVariables = 0;
			
			// advance start point through implies
			while(assertions[startPoint].type == 'implies' || assertions[startPoint].type == 'node') {
				startPoint++;
			}

			var thisStatement = new Object;
			var thisStatementIndex = 0;
			var lookingAtImplies = false;
			// look through the expression, collect out only the functions of the current
			// statement and collect relevant variables
			for (var curStatement = startPoint; curStatement < assertions.length; curStatement++) {
				if (assertions[curStatement].type != 'node') {
					if (assertions[curStatement].type == 'implies') {
						lookingAtImplies = true;
					}
					
					if (lookingAtImplies && assertions[curStatement].type == 'assert') {
						break;
					}
					
					for (var cur in assertions[curStatement].adjacencies) {
						var curVar = assertions[curStatement].adjacencies[cur];
						if (!(curVar in variableNames)) {
							variableNames[curVar] = curVar;
							variableNameArray[numVariables] = curVar;
							numVariables++;
						}
					}
					
					thisStatement[thisStatementIndex] = assertions[curStatement];
					
					thisStatementIndex++;
				}
				startPoint++;
			}
			if (thisStatementIndex > 0) {
				var nodeList = graph.nodes
				var variableMappings = new Object;
				
				// initialize a data structure of variable mappings to all point to the first node
				var firstNodeName = "";
				
				for (var cur in nodeList) {
					firstNodeName = nodeList[cur].label;	
					break;
				}
				
				var i = 0;
				for (var thisLabel in variableNames) {
					variableMappings[variableNameArray[i]] = new VariableMapping(thisLabel, firstNodeName);
					i++;
				}
				
				console.log('variableMappings');
				console.log(variableMappings);
					
						
				
								
				
				// create all possible mappings of variables to nodes in the graph
				
				var mapVariablesAndEval = "";
				
				for (var varNum = 0; varNum < variableNameArray.length; varNum++) {
					mapVariablesAndEval += 'for (n'+varNum+' in nodeList) {';
					mapVariablesAndEval += 'var var'+varNum+' = variableNameArray['+varNum+'];';
					mapVariablesAndEval += 'variableMappings[var'+varNum+'].value = nodeList[n'+varNum+'].label;';
				}
				mapVariablesAndEval += 'numEdgesAdded += drawPossibleEdges(graph, variableMappings, thisStatement);';
				for (var varNum = 0; varNum < variableNameArray.length; varNum++) {
					mapVariablesAndEval += '}';
				}
				
				eval(mapVariablesAndEval);
				/*
				
				
				
				
				for (var n0 in nodeList) {
					var var0 = variableNameArray[0];
					variableMappings[var0].value = nodeList[n0].label;
					for (var n1 in nodeList) {
						var var1 = variableNameArray[1];
						variableMappings[var1].value = nodeList[n1].label;
						for (var n2 in nodeList) {
							var var2 = variableNameArray[2];
							variableMappings[var2].value = nodeList[n2].label;
							
							//console.log(var0 + ' ' + variableMappings[var0].value);
							//console.log(var1 + ' ' + variableMappings[var1].value);
							//console.log(var2 + ' ' + variableMappings[var2].value);
							
							numEdgesAdded += drawPossibleEdges(graph, variableMappings, thisStatement);
						}
					}
				}
				
				
				
				
				*/
			}
			
			
	
		}
		console.log('Num edges added on this iteration ' + numEdgesAdded);
	}
	
	var elapsed = new Date().getTime() - execStartTime;
	console.log('Execution time for transitive closure operation: ' + elapsed);
   return graph;
}

function VariableMapping(variable, value) {
	this.variable = variable;
	this.value = value;
}

/*Resulting code

transit(graph, variableNameArray, assertions) {
	nodeList = graph.nodes
	variableAssignments = new Object;
	
	for (each variableLabel thisLabel in variableNameArray) {
		variableAssignments[thisLabel] = "";
	}
		
	for (each node N1 already in graph) {
		variableassignment[0].value = N1;
		
		for (each node N2 already in graph) {
			variableassignment[2].value = N2;

				if (allPropositionsHold(graph, variableAssignments, arguments))
					drawEdges(graph, variableAssignments, conclusions)

			}
		}
	}
}
	
	
	/////////// revised //////////////
	
	// build list of arguments
	arguments = new Object();
	i = 0;
	while (assertions[i].type == "assert") {
		arguments[assertions[i]]
		i++;
	}
	
	
	// build list of conclusions
	
	while (assertions[i].type == "implies") {
	
		
	}
	
	
	//////////////revised /////////////
	
allPropositionsHold(graph, variableAssignments, assertions)	{	
	// check to see if all of the assertions hold
	for (each assertion A in assertions) {
		edgename = A.edge-name
		nodes = new Array(A.adjacencies.length)
		
		for (each variable V in A.adjacencies) {
			mappedVal = variableassignment[V].value
			nodes[i] = mappedVal;
		}
	    
	    if !(graph._edgeBetween(edgename, nodes)) {
	    	return false;	
	    }
	}
	
	return true
}
*/


// returns the number of edges drawn, -1 if error
function drawPossibleEdges(graph, variableAssignments, assertions) {
    var consideringAssertions = true;
    var holdingSoFar = true;
    var numEdgesAdded = 0;
    
    // lookk at each statement in the assertions
    for (var cur in assertions) {
    	var curStatement = assertions[cur];
    	var edgeName = curStatement["edge-name"];

        if (curStatement.type == "assert") {
            if (!consideringAssertions) {
            	consideringAssertions = true;
           		holdingSoFar = true;
           	}
            
            var nodeAdjacencies = new Array(curStatement.adjacencies.length);
            
            var i = 0;
            for (var curN in curStatement.adjacencies) {
            	var curVar = curStatement.adjacencies[curN];
                nodeAdjacencies[i] = variableAssignments[curVar].value;
				i++;
            }
            
		  	if (graph._edgeBetween(edgeName, nodeAdjacencies)) {
				//console.log('Found edge ' + edgeName + ' between ' + nodeAdjacencies[0] +' and ' + nodeAdjacencies[1] +', continuing');
			} else {
				//console.log('No such edge, stopping for this variable mapping');
				holdingSoFar = false;
			}
        } else if (curStatement.type == "implies") {
            consideringAssertions = false;
            
            if (holdingSoFar) {
				var nodeAdjacencies = new Array(curStatement.adjacencies.length);
				
				var i = 0;
				for (var curN in curStatement.adjacencies) {
					var curVar = curStatement.adjacencies[curN];
					nodeAdjacencies[i] = variableAssignments[curVar].value;
					i++;
				}
				
				if (!(graph._edgeBetween(edgeName, nodeAdjacencies))) {
					
					//console.log('Adding edge ' + edgeName + ' between ' + nodeAdjacencies[0] +' and ' + nodeAdjacencies[1] );
					graph._newEdge(edgeName, nodeAdjacencies.length, nodeAdjacencies);
					numEdgesAdded++;
				}
            }
        }
    
        
    }
    
    return numEdgesAdded;
}

/*

drawEdges(graph, variableAssignments, assertions) {
	for (each implies I in assertions) {
		edgename = I.edge-name
		nodes = new Array(I.adjacencies.length)
		
		for (each variable V in I.adjacencies) {
			mappedVal = variableassignment[V].value
			nodes[i] = mappedVal;
		}
		
		graph.newEdge(edgename, nodes)
		
	}
}
	


*/
































