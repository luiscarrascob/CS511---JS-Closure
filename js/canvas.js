var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};

// Draws a node in the canvas (which is a global object) with the given 
// name label

var canvas_x = 30;
var canvas_y = 30;
var canvas_w = 1200-30;
var canvas_h = 400-30;

function resetCanvas()
{
	//ctx.fillStyle = "#151515";
	//ctx.fillRect (0, 0, 2000, 1000); // Clear the canvas
	//canvas_x = 30;
	//canvas_y = 30;
}

function drawNode(name)
{
	if(canvas_x > canvas_w)
	{
		canvas_x = 30;
		canvas_y += 70;
		if(canvas_y > canvas_h)
		{
			canvas_y = 30;
		}
	}

	x = canvas_x;
	y = canvas_y;

	ctx.beginPath();
	ctx.moveTo(canvas_x, canvas_y);
	ctx.lineTo(canvas_x + 70, canvas_y);
	ctx.lineTo(canvas_x, canvas_y+70);
	ctx.strokeStyle = "#f22";
	ctx.stroke();
	
	ctx.fillStyle = "#22FF5F";
	ctx.beginPath();
	ctx.arc(x, y, 20, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();

	ctx.font = "bold 30px sans-serif"
	ctx.fillStyle = "#151515";
	ctx.fillText(name, x-7, y+5);

	canvas_x = canvas_x + 70;
}

function drawGraph ( json, fd ){

	if ( fd != null )
	{
		fd.graph.empty();
		fd.loadJSON(json);
		fd.computeIncremental({
			iter: 40,
			property: 'end',
			onStep: function(perc){
			},
			onComplete: function(){
			  fd.animate({
				modes: ['linear'],
				transition: $jit.Trans.Elastic.easeOut,
				duration: 2500
			  });
			}
		  });
	}
	else
	{
    fd = new $jit.ForceDirected({
    //id of the visualization container
    injectInto: 'infovis',
  	height: 700, 
    //Enable zooming and panning
    //by scrolling and DnD
    Navigation: {
      enable: true,
      //Enable panning events only if we're dragging the empty
      //canvas (and not a node).
      panning: 'avoid nodes',
      zooming: true
    },
    // Change node and edge styles such as
    // color and width.
    // These properties are also set per node
    // with dollar prefixed data-properties in the
    // JSON structure.
    Node: {
      	overridable: false, 
      	type: 'circle',  
		color: '#0781CC',  
		alpha: 1,  
		dim: 15,  
		height: 50,  
		width: 50,  
		autoHeight: false,  
		autoWidth: false,  
		lineWidth: 1,  
		transform: true,  
		align: "center",  
		angularWidth:1,  
		span:1
    },
    Edge: {
		overridable: true,  
		type: 'arrow',  
		color: '#f22',  
		lineWidth: 10,  
		dim:40,  
		alpha: 0.5,
    },
    //Native canvas text styling
    Label: {
      type: labelType, //Native or HTML
      size: 15,
      style: 'bold',
      color: '#fff'
    },
    //Add Tips
    Tips: {
      enable: true,
      onShow: function(tip, node) {
        //count connections
        var count = 0;
        node.eachAdjacency(function() { count++; });
        //display node info in tooltip
        tip.innerHTML = "<div class=\"tip-title\">" + node.name + "</div>"
          + "<div class=\"tip-text\"><b>connections:</b> " + count + "</div>";
      }
    },
    // Add node events
    Events: {
      enable: true,
      //Change cursor style when hovering a node
      onMouseEnter: function() {
        fd.canvas.getElement().style.cursor = 'move';
      },
      onMouseLeave: function() {
        fd.canvas.getElement().style.cursor = '';
      },
      //Update node positions when dragged
      onDragMove: function(node, eventInfo, e) {
          var pos = eventInfo.getPos();
          node.pos.setc(pos.x, pos.y);
          fd.plot();
      },
      //Implement the same handler for touchscreens
      onTouchMove: function(node, eventInfo, e) {
        $jit.util.event.stop(e); //stop default touchmove event
        this.onDragMove(node, eventInfo, e);
      },
      //Add also a click handler to nodes
      onClick: function(node) {
        if(!node) return;
        // Build the right column relations list.
        // This is done by traversing the clicked node connections.
        var html = "<h4>" + node.name + "</h4><b> connections:</b><ul><li>",
            list = [];
        node.eachAdjacency(function(adj){
          list.push(adj.nodeTo.name);
        });
        //append connections information
        $jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
      }
    },
    //Number of iterations for the FD algorithm
    iterations: 200,
    //Edge length
    levelDistance: 130,
    // Add text to the labels. This method is only triggered
    // on label creation and only for DOM labels (not native canvas ones).
    onCreateLabel: function(domElement, node){
      domElement.innerHTML = node.name;
      var style = domElement.style;
      style.fontSize = "0.8em";
      style.color = "#fff";
    },
    // Change node styles when DOM labels are placed
    // or moved.
    onPlaceLabel: function(domElement, node){
      var style = domElement.style;
      var left = parseInt(style.left);
      var top = parseInt(style.top);
      var w = domElement.offsetWidth;
      style.left = (left - w / 2) + 'px';
      style.top = (top + 10) + 'px';
      style.display = '';
    }
  });
  // load JSON data.
  fd.loadJSON(json);
  // compute positions incrementally and animate.
  fd.computeIncremental({
    iter: 40,
    property: 'end',
    onStep: function(perc){
    },
    onComplete: function(){
      fd.animate({
        modes: ['linear'],
        transition: $jit.Trans.Elastic.easeOut,
        duration: 2500
      });
    }
  });
  // end
  }
  return fd;
 }
