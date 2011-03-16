// Initialize new hypergraph
var graph = new Hypergraph();

// add some new labeled nodes
graph.newNode("x1");
graph.newNode("x2");
graph.newNode("x3");
graph.newNode("x4");
graph.newNode("x5");
graph.newNode("x6");
graph.newNode("x7");

// connect some of those nodes with edges
graph.newEdge("P", 2, "x1", "x2");
graph.newEdge("P", 2, "x4", "x1");
graph.newEdge("P", 2, "x3", "x5");
graph.newEdge("Q", 0);
graph.newEdge("R", 3, "x4", "x2", "x1");
graph.newEdge("R", 3, "x6", "x1", "x3");
graph.newEdge("S", 1, "x3");
graph.newEdge("S", 1, "x4");

// Display string output of hypergraph
document.write("-------------------------<br>Output of edges<br>-------------------------<br>");
document.write(graph.toString());
document.write("-------------------------<br><br><br>");

// Check for existing and nonexistant edges between nodes
document.write("P between x1 and x2?  " + graph.edgeBetween("P", "x1", "x2") + "<br>");
document.write("P between x2 and x1?  " + graph.edgeBetween("P", "x2", "x1") + "<br>");
document.write("Q between none?  " + graph.edgeBetween("Q") + "<br>");
document.write("Q between x3 and x5?  " + graph.edgeBetween("Q", "x3", "x5") + "<br>");
document.write("R between x6, x1 and x3?  " + graph.edgeBetween("R", "x6", "x1", "x3") + "<br>");
document.write("R between x6, x2 and x3?  " + graph.edgeBetween("R", "x6", "x2", "x3") + "<br>");
document.write("S between x4?  " + graph.edgeBetween("S", "x4") + "<br>");
document.write("S between x1?  " + graph.edgeBetween("S", "x1") + "<br>");