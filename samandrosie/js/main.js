var colour = d3.scale.ordinal().domain(["Sam", "Rosie", "Sam & Rosie"]).range(["#ffa500","#FF69B4", "#ADD8E6"]),
	direction = d3.scale.ordinal().domain(["NE", "NW", "SE", "SW"]).range([[25, -25], [-25, -25], [25, 25], [-25, 25]]),
	anchor = d3.scale.ordinal().domain(["NE", "NW", "SE", "SW"]).range(["start", "end", "start", "end"])

var width = $(".map").width(),
  height = $(".map").height();

var sameplace = false;

var projection = d3.geo.wagner6()
  .scale(290)
  .center([-39,30])
  .translate([width / 2, height / 2])
  .precision(.1);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select(".map").append("svg")
  .attr("width", width)
  .attr("height", height);


var defs = svg.append("defs"),
g = svg.append("g")
  	.attr("class", "mapG"),
textsG = svg.append("g")
	.attr("class", "textsG")
arcs = svg.append("g")
  	.attr("class", "arcs"),
points = svg.append("g")
	.attr("class", "points");


svg.call(zoom)
    .call(zoom.event)

var data;

var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/10H4X5yRnubACgBCK1qR_zKJgWA5Mla5wGfqEpbCOugs/edit?usp=sharing';

defs.append("pattern")
    .attr("id", "rosie_img")//set the id here
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href", "http://projects.samvickars.com/samandrosie/img/img3.png");

defs.append("pattern")
    .attr("id", "sam_img")//set the id here
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href", "http://projects.samvickars.com/samandrosie/img/img2.png");

defs.append("pattern")
    .attr("id", "both_img")//set the id here
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href", "http://projects.samvickars.com/samandrosie/img/img1.png");

function init() {
	Tabletop.init( { key: publicSpreadsheetUrl,
	    callback: showInfo,
	    simpleSheet: true } )
}

function showInfo(raw, tabletop) {
	data = raw;
	drawPoints(data);
}

function zoomed() {
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  textsG.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  arcs.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  points.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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
	  g.selectAll('path')
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
		.attr("dy", function(d) {
			return d.dy
		})
		.attr("dx", function(d) {
			return d.dx
		})
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

	if (sameplace) {
		points.append("circle")
			.attr("class", "point together")
			.attr("cx", projection(parseCoord(together[together.length-1].lngLat))[0])
			.attr("cy", projection(parseCoord(together[together.length-1].lngLat))[1])
			.attr("r", 15)
			.style("stroke", colour("Sam & Rosie"))
			.style("stroke-width", 3)
			.style("fill", "url(#both_img")

		points.append("text")
			.attr("class", "label")
			.attr("x", projection(parseCoord(together[together.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(together[together.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 35)
			.style("fill", colour("Sam & Rosie"))
			.style("stroke", "white")
			.style("stroke-width", 2)
			.text("Sam & Rosie")


		points.append("text")
			.attr("class", "label sub")
			.attr("x", projection(parseCoord(together[together.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(together[together.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 50)
			.style("fill", colour("Sam & Rosie"))
			.style("stroke", "white")
			.style("stroke-width", 2)
			.text(together[together.length-1].place)

		points.append("text")
			.attr("class", "label")
			.attr("x", projection(parseCoord(together[together.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(together[together.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 35)
			.style("fill", colour("Sam & Rosie"))
			.text("Sam & Rosie")


		points.append("text")
			.attr("class", "label sub")
			.attr("x", projection(parseCoord(together[together.length-1].lngLat))[0])
			.attr("y", projection(parseCoord(together[together.length-1].lngLat))[1])
			.attr("text-anchor", "middle")
			.attr("dy", 50)
			.style("fill", colour("Sam & Rosie"))
			.text(together[together.length-1].place)
	}


	if (!sameplace) {
		points.append("circle")
			.attr("class", "point separate sam")
			.attr("cx", projection(parseCoord(sam[sam.length-1].lngLat))[0])
			.attr("cy", projection(parseCoord(sam[sam.length-1].lngLat))[1])
			.attr("r", 15)
			.style("stroke", colour("Sam"))
			.style("stroke-width", 3)
			.style("fill", "url(#sam_img")

		points.append("circle")
			.attr("class", "point separate rosie")
			.attr("cx", projection(parseCoord(rosie[rosie.length-1].lngLat))[0])
			.attr("cy", projection(parseCoord(rosie[rosie.length-1].lngLat))[1])
			.attr("r", 15)
			.style("stroke", colour("Rosie"))
			.style("stroke-width", 3)
			.style("fill", "url(#rosie_img")

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

		var toofar = arcs.append("g");

		toofar.append("line")
			.attr("class", "toofar")
			.attr("x1", projection(parseCoord(rosie[rosie.length-1].lngLat))[0])
			.attr("y1", projection(parseCoord(rosie[rosie.length-1].lngLat))[1])
			.attr("x2", projection(parseCoord(sam[sam.length-1].lngLat))[0])
			.attr("y2", projection(parseCoord(sam[sam.length-1].lngLat))[1])

		arcs.append("text")
			.attr("class", "toofartext")
			.style("transform", function(){
				var x = (projection(parseCoord(rosie[rosie.length-1].lngLat))[0] + projection(parseCoord(sam[sam.length-1].lngLat))[0])/2,
					y = (projection(parseCoord(rosie[rosie.length-1].lngLat))[1] + projection(parseCoord(sam[sam.length-1].lngLat))[1])/2,
					x1 = projection(parseCoord(rosie[rosie.length-1].lngLat))[0],
					y1 = projection(parseCoord(rosie[rosie.length-1].lngLat))[1],
					x2 = projection(parseCoord(sam[sam.length-1].lngLat))[0],
					y2 = projection(parseCoord(sam[sam.length-1].lngLat))[1];
				var dx = x1 - x2,
					dy = y1 - y2;
				var theta = Math.atan2(dy,dx);
				return "translate(" + x + "px, " + y + "px) rotate("+theta+"rad) rotate(180deg)"
			})
			.attr("dy", 14)
			.attr("text-anchor", "middle")
			// .style("transform-origin", "center")
			// .style("transform", "rotate(45deg)")			
			.text(function() {
				var lat1 = parseCoord(rosie[rosie.length-1].lngLat)[1],
					lon1 = parseCoord(rosie[rosie.length-1].lngLat)[0],
					lat2 = parseCoord(sam[sam.length-1].lngLat)[1],
					lon2 = parseCoord(sam[sam.length-1].lngLat)[0];
				var distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
				return "Way too far (" + distance.toFixed(0) + "km)"
			})
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

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}