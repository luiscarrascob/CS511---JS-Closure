function processSymbols(str)
{
	var output = '';
	var firstTime = 0;
	var count = 0;
	for ( var i = 0; i < str.length; i++ )
	{
		if (str[i] == '"')
		{
			if ( count % 2 != 0 )
			{
				output += "</span>";
			}
			else
			{
				output += "<span class='symbol'>";
			}
			count ++;
		}
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
		else if ( (str.substring(i, i+4)) == 'and ' )
		{
			output += '<span class="keywords">and </span>';
			i += 3;
		}
		else if ( (str.substring(i, i+3)) == 'or ' )
		{
			output += '<span class="keywords">or </span>';
			i += 2;
		}
		else if ( (str.substring(i, i+4)) == 'not ' )
		{
			output += '<span class="keywords">not </span>';
			i += 3;
		}
		else if ( (str.substring(i, i+8)) == 'implies ' )
		{
			output += '<span class="implies">implies </span>';
			i += 7;
		}
		else output += str[i];
	}
	return output;
}

function update()
{
	var thestring = $("#input").val();

	thestring = processSymbols(thestring);
	
	$("div.#output").html(thestring);
}


// MAIN
$(document).ready(function(){
	$("#input").focus();
	
	update();
	$("#input").keyup(function(){
		update();
	});
});

