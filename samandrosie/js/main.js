var colour = d3.scale.ordinal().domain(["Sam", "Rosie", "Sam & Rosie"]).range(["#ffa500","#FF69B4", "#ADD8E6"]),
	direction = d3.scale.ordinal().domain(["NE", "NW", "SE", "SW"]).range([[25, -25], [-25, -25], [25, 25], [-25, 25]]),
	anchor = d3.scale.ordinal().domain(["NE", "NW", "SE", "SW"]).range(["start", "end", "start", "end"])

var width = $(".map").width(),
  height = $(".map").height();

var sameplace = false;

var projection = d3.geo.wagner6()
  .scale(230)
  .center([-25,20])
  .translate([width / 2, height / 2])
  .precision(.1);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select(".map").append("svg")
  .attr("width", width)
  .attr("height", height);

var defs = svg.append("defs"),
mapG = svg.append("g")
  	.attr("class", "mapG"),
textsG = svg.append("g")
	.attr("class", "textsG")
arcs = svg.append("g")
  	.attr("class", "arcs"),
points = svg.append("g")
	.attr("class", "points");

var data;

var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/10H4X5yRnubACgBCK1qR_zKJgWA5Mla5wGfqEpbCOugs/edit?usp=sharing';

function init() {
	Tabletop.init( { key: publicSpreadsheetUrl,
	    callback: showInfo,
	    simpleSheet: true } )
}

function showInfo(raw, tabletop) {
	data = raw;
	drawPoints(data);
}

loadData();

function loadData() {
  queue()
    .defer(d3.json, "js/world.json")
    .await(drawMap);
  init()
}


function drawMap(error, world) {
	// var countries = world.objects.countries.geometries; // store the path in variable
 	var features = topojson.feature(world, world.objects.countries).features;

	  // draw a base map
	  mapG.append('g')
	    .classed('basemap', true)
	    .selectAll('path')
	    .data(features)
	    .enter().append('path')
	    .attr('d', path)
	    .style('fill', '#dddddd')
	    .style("stroke", "none")
}

function drawPoints(data) {

    together = data.filter(function(d) {
      return d.name == "Sam & Rosie"
    })
	rosie = data.filter(function(d) {
      return d.name == "Rosie"
    })
    sam = data.filter(function(d) {
      return d.name == "Sam"
    })
    firsts = data.filter(function(d) {
      return d.first == "TRUE"
    })

    if (rosie[rosie.length - 1].place === sam[sam.length - 1].place) sameplace = true;

    points.selectAll("point.together")
	    .data(together)
	    .enter().append("circle")
	    .attr("class", "point together")
	    .attr("cx", function(d){return projection(parseCoord(d.lngLat))[0]})
	    .attr("cy", function(d){return projection(parseCoord(d.lngLat))[1]})
	    .attr("r", "4")
	    .style("fill", function(d){
	    	return colour(d.name)
	    })

	arcs.selectAll("connection.together")
	    .data(together)
	    .enter()
	    .append("path")
	    .attr("class", "connection together")
	    .attr('d', function(d) {return lngLatToArc(d, 0)})
	    .style("stroke", function(d){return colour(d.name)})

	textsG.selectAll("texts.together")
		.data(firsts)
		.enter()
		.append("text")
		.attr("class", "texts together")
		.attr("x", function(d){
			return projection(parseCoord(d.lngLat))[0] + parseCoord(d.distance)[0]
		})
	    .attr("y", function(d){
	    	return projection(parseCoord(d.lngLat))[1] + parseCoord(d.distance)[1]
		})
		.attr("dy", 4)
		.style("text-anchor", function(d){
			return d.anchor
		})
	    .text(function(d){return d.place})

	textsG.selectAll("callouts.together")
		.data(firsts)
		.enter()
		.append("line")
		.attr("class", "callouts together")
		.attr("x1", function(d){
			return projection(parseCoord(d.lngLat))[0]
		})
	    .attr("y1", function(d){
	    	return projection(parseCoord(d.lngLat))[1]
		})
		.attr("x2", function(d){
			return projection(parseCoord(d.lngLat))[0] + parseCoord(d.distance)[0]
		})
	    .attr("y2", function(d){
	    	return projection(parseCoord(d.lngLat))[1] + parseCoord(d.distance)[1]
		})


	if (!sameplace) {
		points.append("circle")
			.attr("class", "point separate sam")
			.attr("cx", projection(parseCoord(sam[sam.length-1].lngLat))[0])
			.attr("cy", projection(parseCoord(sam[sam.length-1].lngLat))[1])
			.attr("r", 15)
			.style("stroke", colour("Sam"))
			.style("stroke-width", 3)

		points.append("circle")
			.attr("class", "point separate rosie")
			.attr("cx", projection(parseCoord(rosie[rosie.length-1].lngLat))[0])
			.attr("cy", projection(parseCoord(rosie[rosie.length-1].lngLat))[1])
			.attr("r", 15)
			.style("stroke", colour("Rosie"))
			.style("stroke-width", 3)

		points.append("text")
			.attr("class", "label")
			.attr("x", projection(parseCoord(rosie[rosie.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(rosie[rosie.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 35)
			.style("fill", colour("Rosie"))
			.style("stroke", "white")
			.style("stroke-width", 2)
			.text("Rosie")

		points.append("text")
			.attr("class", "label")
			.attr("x", projection(parseCoord(sam[sam.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(sam[sam.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 35)
			.style("fill", colour("Sam"))
			.style("stroke", "white")
			.style("stroke-width", 2)
			.text("Sam")

		points.append("text")
			.attr("class", "label")
			.attr("x", projection(parseCoord(rosie[rosie.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(rosie[rosie.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 35)
			.style("fill", colour("Rosie"))
			.text("Rosie")

		points.append("text")
			.attr("class", "label")
			.attr("x", projection(parseCoord(sam[sam.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(sam[sam.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 35)
			.style("fill", colour("Sam"))
			.text("Sam")

		points.append("text")
			.attr("class", "label sub")
			.attr("x", projection(parseCoord(rosie[rosie.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(rosie[rosie.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 50)
			.style("fill", colour("Rosie"))
			.style("stroke", "white")
			.style("stroke-width", 2)
			.text(rosie[rosie.length-1].place)

		points.append("text")
			.attr("class", "label sub")
			.attr("x", projection(parseCoord(sam[sam.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(sam[sam.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 50)
			.style("fill", colour("Sam"))
			.style("stroke", "white")
			.style("stroke-width", 2)
			.text(sam[sam.length-1].place)

		points.append("text")
			.attr("class", "label sub")
			.attr("x", projection(parseCoord(rosie[rosie.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(rosie[rosie.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 50)
			.style("fill", colour("Rosie"))
			.text(rosie[rosie.length-1].place)

		points.append("text")
			.attr("class", "label sub")
			.attr("x", projection(parseCoord(sam[sam.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(sam[sam.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 50)
			.style("fill", colour("Sam"))
			.text(sam[sam.length-1].place)

		arcs.append("path")
		    .attr("class", "connection separate")
		    .attr('d', lngLatToArc(sam[sam.length-1]), 0)
		    .style("stroke", colour("Sam"))

		arcs.append("path")
		    .attr("class", "connection separate")
		    .attr('d', lngLatToArc(rosie[rosie.length-1]), 0)
		    .style("stroke", colour("Rosie"))

		arcs.append("line")
			.attr("class", "toofar")
			.attr("x1", projection(parseCoord(rosie[rosie.length-1].lngLat))[0])
			.attr("y1", projection(parseCoord(rosie[rosie.length-1].lngLat))[1])
			.attr("x2", projection(parseCoord(sam[sam.length-1].lngLat))[0])
			.attr("y2", projection(parseCoord(sam[sam.length-1].lngLat))[1])
	}
    
}

function lngLatToArc(d, bend) {
  bend = bend || 1;

  var sourceLngLat = parseCoord(d.prevLngLat),
    targetLngLat = parseCoord(d.lngLat);

  if (targetLngLat && sourceLngLat) {
    var sourceXY = projection(sourceLngLat),
      targetXY = projection(targetLngLat);

    var sourceX = sourceXY[0],
      sourceY = sourceXY[1];

    var targetX = targetXY[0],
      targetY = targetXY[1];

    var dx = targetX - sourceX,
      dy = targetY - sourceY,
      dr = Math.sqrt(dx * dx + dy * dy) * bend;

    // To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
    var west_of_source = (targetX - sourceX) < 0;
    if (west_of_source) return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
    return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

  } else {
    return "M0,0,l0,0z";
  }
}

function parseCoord(value) {
  return JSON.parse("[" + value + "]")[0]
}