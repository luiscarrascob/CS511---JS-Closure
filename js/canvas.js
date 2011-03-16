// Draws a node in the canvas (which is a global object) with the given 
// name label

var canvas_x = 30;
var canvas_y = 30;
var canvas_w = 1200-30;
var canvas_h = 400-30;

function resetCanvas()
{
	ctx.fillStyle = "#151515";
	ctx.fillRect (0, 0, 2000, 1000); // Clear the canvas
	canvas_x = 30;
	canvas_y = 30;
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
