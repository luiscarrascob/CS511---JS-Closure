// Draws a node in the canvas (which is a global object) with the given 
// name label
function drawNode(name)
{
	w = $('#theCanvas').width()-10;
	h = $('#theCanvas').height()-10;

	x = Math.floor(Math.random()*w)+10;
	y = Math.floor(Math.random()*h)+10;
	
	ctx.fillStyle = "#22FF5F";
	ctx.beginPath();
	ctx.arc(x, y, 20, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();

	ctx.font = "bold 30px sans-serif"
	ctx.fillStyle = "#151515";
	ctx.fillText(name, x-7, y+5);
}
