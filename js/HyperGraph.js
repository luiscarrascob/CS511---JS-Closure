//-------------------------------------------------------------------------------------
// HYPERGRAPH CLASS DEFINITION
//-------------------------------------------------------------------------------------
function Hypergraph() {
	this.nodes = new Object;
	this.edges = new Object;
	
	this.newNode = newNode;
	this.newEdge = newEdge;
	this._newEdge = _newEdge;
	this.toString = toString;
	this.edgeBetween = edgeBetween;
	this._edgeBetween = _edgeBetween;
}

//-------------------------------------------------------------------------------------
// PUBLIC METHODS ON HYPERGRAPH
//-------------------------------------------------------------------------------------

// Is there an edge with specified label between specified nodes?
//
// USAGE:  edgeBetween(<edgeLabel>, <node1Label>, <node2Label>, ... <nodeNLabel>)
//
// RETURNS: true iff this edge connects nodes in specified order, false otherwise
//
function edgeBetween(edgeLabel, nodeLabels) {
	if (!(edgeLabel in this.edges)) { 
		return false;
	}
	
	var collectedLabels = "";
	
	for (var i = 1; i < arguments.length; i++) {
		if (!(arguments[i] in this.nodes)) {
			return false;
		}
		
		collectedLabels+= arguments[i];
	}
	
	if (collectedLabels in this.edges[edgeLabel]) {
		return true;	
	}
	
	return false;
}

// Same as edgeBetween(), but takes node labels as an array of strings rather than 
// individual arguments
function _edgeBetween(edgeLabel, nodeLabelArray) {
	if (!(edgeLabel in this.edges)) { 
		return false;
	}
	
	var collectedLabels = "";
	
	for (var i = 0; i < nodeLabelArray.length; i++) {
		if (!(nodeLabelArray[i] in this.nodes)) {
			return false;
		}
		
		collectedLabels+= nodeLabelArray[i];
	}
	
	if (collectedLabels in this.edges[edgeLabel]) {
		return true;	
	}
	
	return false;
}

// Add a new node to the graph with specified label
//
//Returns: TRUE iff node successfully created
//Returns: FALSE iff node with specified label already exists
function newNode(label) {
	if (label in this.nodes) {
		return false;
	}
	
	this.nodes[label] = new Node(this, label);
	
	return true;
}

// Add a new edge between existing nodes in the graph
//
// USAGE: newEdge(<edgeLabel>, <arity>, <node1Label>, <node2Label>, ... <nodeNLabel>)
//
// RETURNS: -1 // "Arity argument mismatch" iff arity does not match number of node args
// RETURNS: -2 // "Nonexistent node <nodeName>" iff specified node with name doesn't exist
// RETURNS: 0 iff success
function newEdge(label, arity, nodeLabels) {
	// check argument number agreement
	if (arity != arguments.length - 2) {
		console.log("Arity argument mismatch");
		return -1;
	}
	
	collectedLabels = "";
	nodes = new Array(arity);
	
	// check that member nodes exist
	for (var i = 2; i < arguments.length; i++) {
		var curLabel = arguments[i];
	
		if (!(curLabel in this.nodes)) {
			console.log( ("Nonexistent node " + curLabel));
		}
		
		collectedLabels += curLabel;
		nodes[i] = this.nodes[curLabel];
	}
	
	// check edge is already in graph
	if (label in this.edges) {
		this.edges[label][collectedLabels] = new Edge(this, label, arity, nodes);
	} 
	// else create a new set with this label
	else {
		this.edges[label] = new Object;
		this.edges[label][collectedLabels] = new Edge(this, label, arity, nodes);
	}

	return 0;
	
}

function _newEdge(label, arity, nodeLabelArray) {
	
	collectedLabels = "";
	
	// check that member nodes exist
	for (var i = 0; i < arity; i++) {
		var curLabel = nodeLabelArray[i];
	
		if (!(curLabel in this.nodes)) {
			console.log( ("Nonexistent node " + curLabel));
			return -1;
		}
		
		collectedLabels += curLabel;
		nodes[i] = this.nodes[curLabel];
	}
	
	// check edge is already in graph
	if (label in this.edges) {
		this.edges[label][collectedLabels] = new Edge(this, label, arity, nodeLabelArray);
	} 
	// else create a new set with this label
	else {
		this.edges[label] = new Object;
		this.edges[label][collectedLabels] = new Edge(this, label, arity, nodeLabelArray);
	}

	return 0;
}

// Return a string representation of the Hypergraph 
function toString() {
	
	var result = "Edges <br>";
	for (var curEdgeSet in this.edges) {
		for (var curEdge in this.edges[curEdgeSet]) {
			result += this.edges[curEdgeSet][curEdge].label + ":     ";
			
			for (var curNode in this.edges[curEdgeSet][curEdge].nodes) {
				result += this.edges[curEdgeSet][curEdge].nodes[curNode].label + "  ";
			}
			
			result += "<br>";
		}
	}
	
	return result;
}

//-------------------------------------------------------------------------------------
// INTERNAL DATA STRUCTURES
//-------------------------------------------------------------------------------------
// Member Node Class
function Node(graph, label) {
	this.graph = graph;
	this.label = label;
}

// Member edge class
function Edge(graph, label, arity, nodes) {
	this.graph = graph;
	this.label = label;
	this.arity = arity;
	this.nodes = nodes;
}
