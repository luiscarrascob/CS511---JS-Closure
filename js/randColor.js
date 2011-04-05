var colorArr = ["#FF7575",
"#E77AFE",	
"#A27AFE",
"#FE67EB",
"#BF00BF",
"#6755E3",
"#BC2EBC",
"#FF73B9",
"#2897B7",
"#03F3AB",
"#A827FE",
"#9B4EE9",
"#75B4FF",
"#24E0FB",
"#D97BFD",
"#C8C800",
"#2F74D0",
"#FF79E1",
"#75D6FF",
"#1FFEF3",
"#6A6AFF",
"#32DF00",
"#D97BFD",
"#27DE55",
"#6CA870",
"#0AFE47",
"#61F200",
"#79FC4E",
"#CDD11B",
"#E0E04E",	
"#D9C400",
"#F9BB00",
"#EAA400",
"#FFBF48",
"#FFA04A",
"#FF9C42",
"#D7D78A",
"#CEB86C",
"#C98A4B",	
"#CB876D",
"#C06A45",
"#C98767",
"#C48484",
"#FF2626",	
"#D73E68",
"#B300B3",
"#8D18AB",
"#5B5BFF",
"#25A0C5",
"#5EAE9E"
];

var colorIndex = 0; // Keeps track of where in the array we are
var colorsUsed = [];

// Randomizes the array of colors
function randomizeColors()
{
	for (i=0; i<colorArr.length*5; i++)
	{
		var index1 = Math.floor(Math.random()*colorArr.length);
		var index2 = Math.floor(Math.random()*colorArr.length);
		var temp = colorArr[index1];
		colorArr[index1] = colorArr[index2];
		colorArr[index2] = temp;
	}
}

// Returns a color from randomized list in order. It also keeps track
// of what predicate symbols have requested a color and returns the 
// same color if a predicate with the same name requests a color again.
function getRandomColor(node)
{
	if (node in colorsUsed) return colorsUsed[node];
	else
	{
		var color = colorArr[(colorIndex++)%colorArr.length];
		colorsUsed[node] = color;
		return color;
	}
}










