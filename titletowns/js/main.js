var cLeagues = {
  mlb: "#beaed4",
  cfl: "#7fc97f",
  mls: "#fdc086",
  nba: "#ffff99",
  nfl: "#f0027f",
  nhl: "#bf5b17",
  ncaa: "#386cb0",
  "ncaa-baseball-m": "#386cb0",
  "ncaa-basketball-m": "#386cb0",
  "ncaa-basketball-w": "#386cb0",
  "ncaa-football-m": "#386cb0",
  "ncaa-soccer-w": "#386cb0",
  "ncaa-volleyball-w": "#386cb0"
}

var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  mapD = {
    w: 0,
    h: 0,
    m: 8
  },
  smallmapD = {
    w: 0,
    h: 0,
    m: 8
  },
  mediummapD = {
    w: 0,
    h: 0,
    m: 8
  },
  c1m = {
    top: 12,
    right: 150,
    bottom: 25,
    left: 25
  },
  c1D = {
    w: 0,
    h: 0,
    m: 8
  },
  sliderD = {
    h: $("#slider").height(),
    w: $("#slider").width()
  },
  mapCount = 1,
  smallmapCount = 4,
  mediummapCount = 2;

var userCoord = [],
  userPlace,
  searchArray = [];

var large_screen = false,
  medium_screen = false,
  small_screen = false,
  map0 = false;

var startDate = new Date(1870, 0, 1),
  endDate = new Date(2018, 11, 31);

var controller = new ScrollMagic.Controller();
var windowW, windowH, projection, path, smallprojectio, smallpath, mediumprojection, mediumpath, line, targetValue, x;

var trophyList = ["NBA", "NHL", "NFL", "MLB", "CFL", "MLS", "volleyball-w", "baseball-m", "basketball-w", "basketball-m", "football-m", "soccer-w"],
  leagueList = ["MLB", "NBA", "NFL", "NHL"],
  levelList = ["pro", "NCAA"],
  opacityScale = d3.scaleLinear().domain([1, 66]).range([.25, .05]);


var formatDateIntoYear = d3.timeFormat("%Y"),
  formatDate = d3.timeFormat("%b %Y"),
  formatYear = d3.timeFormat("%Y"),
  parseYear = d3.timeParse("%Y"),
  parseDate = d3.timeParse("%m/%d/%y"),
  parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime(),
  xscale = d3.scaleTime().range([0, c1D.w]),
  yscale = d3.scaleLinear().range([c1D.h, 0]);

function handleResize() {

  d3.select(".title-wrapper").style("background-image", "url('/img/backgrounds/" + getRandomInt(1, 7) + ".jpg')")

  windowW = window.innerWidth;
  windowH = window.innerHeight;

  large_screen = false
  medium_screen = false
  small_screen = false

  if (windowW >= 1025) {
    large_screen = true;
  } else if (windowW >= 650) {
    medium_screen = true;
  } else if (windowW < 650) {
    small_screen = true;
  }

  if (small_screen) {
    margin.left = 0
    margin.right = 0
    mapD.w = windowW - 16
    mapD.h = windowW * .66
    c1m.right = 15;
    c1D.w = windowW - 16 - c1m.left - c1m.right
    c1D.h = windowW * .66 - c1m.top - c1m.bottom
    smallmapD.w = (windowW - 20)
    smallmapD.h = windowW * .66
    mediummapD.w = (windowW - 20)
    mediummapD.h = windowW * .66
  } else if (medium_screen) {
    margin.left = (windowW * .125) - 8
    margin.right = (windowW * .125) - 8
    mapD.w = windowW * .75
    mapD.h = (windowW * .75) * .66
    c1D.w = windowW * .75 - c1m.left - c1m.right
    c1D.h = (windowW * .75) * .66 - c1m.top - c1m.bottom
    smallmapD.w = (windowW * .75) / 2
    smallmapD.h = ((windowW * .75) / 2) * .66
    mediummapD.w = (windowW * .75) / 2
    mediummapD.h = ((windowW * .75) / 2) * .66
  } else {
    margin.left = (windowW * .125) - 8
    margin.right = (windowW * .125) - 8
    mapD.w = windowW * .75
    mapD.h = (windowW * .75) * .66
    c1D.w = windowW * .75 - c1m.left - c1m.right
    c1D.h = (windowW * .75) * .66 - c1m.top - c1m.bottom
    smallmapD.w = (windowW * .75) / 4
    smallmapD.h = ((windowW * .75) / 4) * .66
    mediummapD.w = (windowW * .75) / 2
    mediummapD.h = ((windowW * .75) / 2) * .66
  }

  projection = d3.geoAlbers()
    .scale(mapD.w + 100)
    .translate([mapD.w / 2, mapD.h * .6])
    .precision(0.1)

  smallprojection = d3.geoAlbers()
    .scale(smallmapD.w + 75)
    .translate([smallmapD.w * .475, smallmapD.h * .525])
    .precision(0.1)

  mediumprojection = d3.geoAlbers()
    .scale(mediummapD.w + 75)
    .translate([mediummapD.w * .475, mediummapD.h * .55])
    .precision(0.1)

  path = d3.geoPath()
    .projection(projection)

  smallpath = d3.geoPath()
    .projection(smallprojection)

  mediumpath = d3.geoPath()
    .projection(mediumprojection)

  xscale = d3.scaleTime().range([0, c1D.w])
  yscale = d3.scaleLinear().range([c1D.h, 0]);

  line = d3.line()
    .curve(d3.curveStep)
    .x(function(d) {
      return xscale(d.date);
    })
    .y(function(d) {
      return yscale(d.wins);
    });

  line.defined(function(d) {
    return d.wins || d.wins > 0;
  })

  d3.selectAll(".continent").attr("d", path)
  d3.selectAll(".continentSmall").attr("d", smallpath)
  d3.selectAll(".continentMedium").attr("d", mediumpath)


  for (var i = 0; i < mapCount; i++) {
    d3.select("#map" + i).attr("height", mapD.h)
      .attr("width", mapD.w)
      .attr("transform", "translate(" + margin.left + ")")
  }

  for (var i = 0; i < smallmapCount; i++) {
    d3.select("#smallmap" + i).attr("height", smallmapD.h)
      .attr("width", smallmapD.w)
      .attr("transform", "translate(" + margin.left + ")")
  }

  for (var i = 0; i < mediummapCount; i++) {
    d3.select("#mediummap" + i).attr("height", mediummapD.h)
      .attr("width", mediummapD.w)
      .attr("transform", "translate(" + margin.left + ")")
  }

  d3.select("#chart1").attr("height", c1D.h + c1m.top + c1m.bottom)
    .attr("width", c1D.w + c1m.left + c1m.right)
    .attr("transform", "translate(" + margin.left + ")")

  d3.selectAll(".mapcaptionsmall").style("left", margin.left + ((smallmapD.w * .25) / 2) + "px").style("width", smallmapD.w * .75 + "px")
  d3.selectAll(".mapcaptionmedium").style("left", margin.left + ((mediummapD.w * .25) / 2) + "px").style("width", mediummapD.w * .75 + "px")

  if (!small_screen) {
    d3.select("#chart-overtext1").style("left", margin.left + 100 + "px")
  }

  if (small_screen) {
    // d3.select("#chart-overtext1").style("display", "none")
    // d3.select("#c1story").style("display", "block")
    // d3.select(".chart-container").style("margin-top", "25px")
  }

  // SLIDER
  // d3.select("#play-button").style("left", margin.left + 25 + "px").style("top", 25 + "px");
  targetValue = sliderD.w - 15;
  x.range([30, targetValue])
  d3.select(".track").attr("x1", x.range()[0]).attr("x2", x.range()[1])

} // end handleResize

loadData();

function loadData() {
  queue()
    .defer(d3.json, "js/maps/world-continents.json")
    .defer(d3.json, "js/maps/us.json")
    .defer(d3.json, "js/maps/canada.json")
    .defer(d3.csv, "data/data.csv")
    .defer(d3.csv, "data/cities.csv")
    .defer(d3.csv, "data/matrix.csv")
    .await(processData);

  ipLookUp()
} // end loadData

function processData(error, world, us, canada, titles, places, matrix) {
  handleResize();
  window.addEventListener("resize", handleResize);
  findClosest(places);
  drawMaps(world, us, canada);
  if (small_screen) drawMap0small(titles);
  if (!small_screen) drawMap0(titles, places);
  drawProMaps(titles);
  drawProVsCollegeMaps(titles, places);
  drawChart1(matrix);
  drawChart2(titles, places);
  detectView();
} // end processData

function drawMaps(world, us, canada) {
  for (var i = 0; i < mapCount; i++) {
    var svg = d3.select("#map" + i);
    var g = svg.append("g").attr("transform", "translate(" + mapD.m + "," + mapD.m + ")")

    var defs = svg.append("defs");

    var filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", "25")
      .attr("result", "blur");
    filter.append("feColorMatrix")
      .attr("type", "matrix")
      .attr("values", ".25 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.25 0 ")
      .attr("result", "bluralpha");
    filter.append("feOffset")
      .attr("in", "bluralpha")
      .attr("dx", 0)
      .attr("dy", 0)
      .attr("result", "offsetBlur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

    g.append("path")
      .attr("class", "continent")
      .datum(topojson.feature(world, world.objects.continent))
      .attr("d", path)
      .style("fill", "#fff")
      .style("filter", "url(#glow)")
  }

  for (var i = 0; i < smallmapCount; i++) {
    var svg = d3.select("#smallmap" + i);
    var g = svg.append("g").attr("transform", "translate(" + smallmapD.m + "," + smallmapD.m + ")")

    g.append("path")
      .attr("class", "continentSmall")
      .datum(topojson.feature(us, us.objects.states))
      .attr("d", smallpath)
      .style("fill", "#efefef")
      .style("stroke", "#fff")

    g.append("path")
      .attr("class", "continentSmall")
      .datum(topojson.feature(canada, canada.objects.canadaprov))
      .attr("d", smallpath)
      .style("fill", "#efefef")
      .style("stroke", "#fff")
  }

  for (var i = 0; i < mediummapCount; i++) {
    var svg = d3.select("#mediummap" + i);
    var g = svg.append("g").attr("transform", "translate(" + mediummapD.m + "," + mediummapD.m + ")")

    g.append("path")
      .attr("class", "continentMedium")
      .datum(topojson.feature(us, us.objects.states))
      .attr("d", mediumpath)
      .style("fill", "#efefef")
      .style("stroke", "#fff")

    g.append("path")
      .attr("class", "continentMedium")
      .datum(topojson.feature(canada, canada.objects.canadaprov))
      .attr("d", mediumpath)
      .style("fill", "#efefef")
      .style("stroke", "#fff")
  }
} // end drawMaps

function detectView() {
  var map0scene = new ScrollMagic.Scene({
      triggerElement: "#map0"
    })
    .addTo(controller);

  map0scene.on("enter", function() {
    if (!map0) {
      map0 = true;
      // $("#play-button").click();
    }
  }).on("exit", function() {
    if (map0) {
      map0 = false;
    }
  })

  // var chart1scene = new ScrollMagic.Scene({
  //     triggerElement: "#chart1"
  //   })
  //   .addTo(controller);
  //
  // chart1scene.on("progress", function(event) {
  //   if (event.scrollDirection === "FORWARD") {
  //     d3.select("body").style("background-color", "#333")
  //     d3.select("#chart-overtext1").transition().delay(250).style("opacity", "1")
  //   } else {
  //     d3.select("#chart-overtext1").transition().duration(50).style("opacity", "0")
  //     d3.select("body").style("background-color", "#fff")
  //   }
  // })
} // end detectView

function drawMap0(titles, placeData) {

  var svg = d3.select("#map0");
  var gCircle = svg.append("g").attr("transform", "translate(" + mapD.m + "," + mapD.m + ")"),
    gTrophy = svg.append("g").attr("transform", "translate(" + mapD.m + "," + mapD.m + ")");
  svg.append("g")
    .attr("class", "map0annotation-group");
  var gTT = svg.append("g").attr("transform", "translate(" + mapD.m + "," + mapD.m + ")");


  for (var i = 0; i < trophyList.length; i++) {
    gTrophy.append("svg:image")
      .attr("class", "trophy trophy-" + trophyList[i])
      .attr("width", 50)
      .attr("height", 50)
      .attr("xlink:href", "img/icons/" + trophyList[i] + ".png")
      .style("opacity", 0)
  }

  d3.select(".trophy-NBA").attr("x", projection([-75.1652215, 39.9525839])[0] - 25).attr("y", projection([-75.1652215, 39.9525839])[1] - 25);
  d3.select(".trophy-NHL").attr("x", projection([-79.3831843, 43.653226])[0] - 25).attr("y", projection([-79.3831843, 43.653226])[1] - 25);
  d3.select(".trophy-NFL").attr("x", projection([-81.378447, 40.7989472999999])[0] - 25).attr("y", projection([-81.378447, 40.7989472999999])[1] - 25);
  d3.select(".trophy-MLB").attr("x", projection([-71.0588801, 42.3600825])[0] - 25).attr("y", projection([-71.0588801, 42.3600825])[1] - 25);
  d3.select(".trophy-CFL").attr("x", projection([-79.3831843, 43.653226])[0] - 25).attr("y", projection([-79.3831843, 43.653226])[1] - 25);
  d3.select(".trophy-MLS").attr("x", projection([-77.0368707, 38.9071923])[0] - 25).attr("y", projection([-77.0368707, 38.9071923])[1] - 25);
  d3.select(".trophy-volleyball-w").attr("x", projection([-81.0348144, 34.0007104])[0] - 25).attr("y", projection([-81.0348144, 34.0007104])[1] - 25);
  d3.select(".trophy-baseball-m").attr("x", projection([-122.272747, 37.8715926])[0] - 25).attr("y", projection([-122.272747, 37.8715926])[1] - 25);
  d3.select(".trophy-basketball-m").attr("x", projection([-123.0867536, 44.0520691])[0] - 25).attr("y", projection([-123.0867536, 44.0520691])[1] - 25);
  d3.select(".trophy-basketball-w").attr("x", projection([-79.8742367999999, 40.5077792])[0] - 25).attr("y", projection([-79.8742367999999, 40.5077792])[1] - 25);
  d3.select(".trophy-football-m").attr("x", projection([-74.6672226, 40.3572976])[0] - 25).attr("y", projection([-74.6672226, 40.3572976])[1] - 25);
  d3.select(".trophy-soccer-w").attr("x", projection([-79.0558445, 35.9131996])[0] - 25).attr("y", projection([-79.0558445, 35.9131996])[1] - 25);

  // -----SLIDER----- // https://bl.ocks.org/officeofjane/47d2b0bfeecfcb41d2212d06d095c763
  var moving = false;
  var currentValue = 15;

  // var playButton = d3.select("#play-button")
  var playButton = d3.select("#play-button");

  x.domain([startDate, endDate])
    .range([15, targetValue])
    .clamp(true);

  var slider = d3.select("#slider").append("g")
    .attr("class", "sliderG")
    .attr("transform", "translate(" + 0 + "," + sliderD.h / 3 + ")");


  slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function() {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-inset")
    .select(function() {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-overlay")
    .call(d3.drag()
      .on("start.interrupt", function() {
        slider.interrupt();
      })
      .on("start drag", function() {
        currentValue = d3.event.x;
        update(x.invert(currentValue));
      })
    );

  slider.append("text")
    .attr("class", "slider-tick")
    .attr("x", x.range()[0])
    .attr("y", sliderD.h * (2 / 3))
    .attr("text-anchor", "middle")
    .attr("dy", 7)
    .text("1870")

  slider.append("text")
    .attr("class", "slider-tick")
    .attr("x", x.range()[1])
    .attr("y", sliderD.h * (2 / 3))
    .attr("text-anchor", "middle")
    .attr("dy", 7)
    .text("2018")

  // slider.insert("g", ".track-overlay")
  //   .attr("class", "ticks")
  //   .attr("transform", function() {
  //     // if (medium_screen) {
  //     //   return "translate(30," + -18 + ")"
  //     // } else if (large_screen) {
  //     //   return "translate(60," + -18 + ")"
  //     // }
  //     return "translate(0," + -18 + ")"
  //   })
  //   .selectAll("text")
  //   .data(x.ticks())
  //   .enter()
  //   .append("text")
  //   .attr("x", x)
  //   .attr("y", 10)
  //   .attr("text-anchor", "middle")
  //   .text(function(d) {
  //     return parseInt(formatDateIntoYear(d));
  //   });

  var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "slider-handle")
    .attr("r", 5)
    .attr("cx", x(startDate));

  var handleStroke = slider.insert("circle", ".track-overlay")
    .attr("class", "slider-handleStroke")
    .attr("r", 7)
    .attr("cx", x(startDate));

  d3.select("#sliderYear").text(formatDateIntoYear(startDate))

  playButton
    .on("click", function() {
      var button = d3.select(this);
      if (button.text() == "Pause") {
        moving = false;
        clearInterval(timer);
        // timer = 0;
        button.text("Play");
        $("#play-button").removeClass("played").removeClass("ended").addClass("paused")
      } else {
        moving = true;
        timer = setInterval(step, 100);
        button.text("Pause");
        $("#play-button").removeClass("paused").removeClass("ended").addClass("played")
      }
    })

  slider.on("click", function() {
    if (moving) $("#play-button").click();
  })

  function prepare(d) {
    d.id = d.id;
    d.date = parseDate(d.date);
    return d;
  }

  document.onkeydown = checkKey;

  function checkKey(e) {
    e = e || window.event;
    if (e.which == "13") {
      // e.preventDefault();
      if (!map0) {
        map0 = true;
        $("#play-button").click();
      } else {
        map0 = false;
        $("#play-button").click();
      }
    } else if (e.which == "39") {
      step();
    } else if (e.which == "37") {
      stepBack()
    }
  }

  function step() {
    update(x.invert(currentValue));
    currentValue = currentValue + (targetValue / 151);
    if (currentValue > targetValue) {
      moving = false;
      currentValue = 0;
      clearInterval(timer);
      // timer = 0;
      playButton.text("Play");
    }
  } // end step

  function stepBack() {
    currentValue = currentValue - (targetValue / 151);
    update(x.invert(currentValue));
    if (currentValue > targetValue) {
      moving = false;
      currentValue = 0;
      clearInterval(timer);
      // timer = 0;
      playButton.text("Play");
    }
  } // end step

  function drawPlot(data, placeData) {
    var cities = gCircle.selectAll(".city")
      .data(data);

    cities.enter()
      .append("circle")
      .attr("class", "city")
      .attr("cx", function(d) {
        gTrophy.select("." + d.trophySelector)
          .transition().duration(250)
          .attr("x", projection(parseCoord(d.t1coord))[0] - 25)
          .attr("y", projection(parseCoord(d.t1coord))[1] - 25)
          .style("opacity", "1");
        return projection(parseCoord(d.t1coord))[0]
      })
      .attr("cy", function(d) {
        return projection(parseCoord(d.t1coord))[1]
      })
      .style("fill", function(d) {
        return d.colour
      })
      .style("opacity", function(d) {
        return opacityScale(d.nth)
      })
      .attr("r", 0)
      .transition().duration(400)
      .attr("r", function(d) {
        return d.nth
      })

    var placeCircles = gTT.selectAll(".placeCircles")
      .data(placeData);

    placeCircles.enter()
      .append("circle")
      .attr("class", "map0city placeCircles")
      .attr("id", function(d) {
        return "map0place" + "-" + camelize(d.cityState)
      })
      .attr("cx", function(d) {
        return projection(parseCoord(d.lngLat))[0]
      })
      .attr("cy", function(d) {
        return projection(parseCoord(d.lngLat))[1]
      })
      .attr("r", function(d) {
        return d.count
      })
      .style("fill", "#333")
      .style("opacity", 0)

    d3.selectAll(".placeCircles")
      .on("mouseover", function(d) {
        // d3.select(this).style("opacity", 1)
        svg.append("text")
          .attr("class", "cityAnnoBG cityAnno-" + camelize(d.cityState))
          .attr("x", projection(parseCoord(d.lngLat))[0] + 8)
          .attr("y", projection(parseCoord(d.lngLat))[1] + 8)
          .attr("text-anchor", "middle")
          .attr("dy", function() {
            return (d.count / 3) * 2
          })
          .text(d.city + " (" + d.count + ")")

        svg.append("text")
          .attr("class", "mainAnno cityAnno-" + camelize(d.cityState))
          .attr("x", projection(parseCoord(d.lngLat))[0] + 8)
          .attr("y", projection(parseCoord(d.lngLat))[1] + 8)
          .attr("text-anchor", "middle")
          .attr("dy", function() {
            return (d.count / 3) * 2
          })
          .text(d.city + " (" + d.count + ")")
      })
      .on("mouseout", function(d) {
        d3.selectAll(".cityAnno-" + camelize(d.cityState)).transition().delay(200).duration(200).style("opacity", 0).remove();
      })

    cities.exit()
      .remove();

    window.addEventListener("resize", function() {
      d3.selectAll(".trophy").transition().duration(100).style("opacity", 0)
      d3.selectAll(".city")
        .attr("cx", function(d) {
          return projection(parseCoord(d.t1coord))[0]
        })
        .attr("cy", function(d) {
          return projection(parseCoord(d.t1coord))[1]
        })
    });

    gTrophy.selectAll(".trophy").style("opacity", 0)
  } // end drawPlot

  function update(h) {
    handle.attr("cx", x(h));
    handleStroke.attr("cx", x(h))
    d3.select("#sliderYear").html(formatDateIntoYear(h))

    if (d3.select("#sliderYear").html() == "2018") {
      $("#play-button").removeClass("paused").removeClass("played").addClass("ended")
    }

    if (parseInt(d3.select("#sliderYear").html()) < 1875) {
      d3.selectAll(".map0Annotation").style("opacity", "0")
    }
    if (parseInt(d3.select("#sliderYear").html()) > 1874) {
      d3.select(".map0Annotation1875").style("opacity", "1")
    }
    if (parseInt(d3.select("#sliderYear").html()) < 1903) {
      d3.select(".map0Annotation1903").style("opacity", "0")
    }
    if (parseInt(d3.select("#sliderYear").html()) > 1902) {
      d3.select(".map0Annotation1875").style("opacity", "0")
      d3.select(".map0Annotation1903").style("opacity", "1")
    }
    if (parseInt(d3.select("#sliderYear").html()) < 1918) {
      d3.select(".map0Annotation1918").style("opacity", "0")
    }
    if (parseInt(d3.select("#sliderYear").html()) > 1917) {
      d3.select(".map0Annotation1903").style("opacity", "0")
      d3.select(".map0Annotation1918").style("opacity", "1")
    }
    if (parseInt(d3.select("#sliderYear").html()) < 1921) {
      d3.select(".map0Annotation1921").style("opacity", "0")
    }
    if (parseInt(d3.select("#sliderYear").html()) > 1920) {
      d3.select(".map0Annotation1921").style("opacity", "1")
    }
    if (parseInt(d3.select("#sliderYear").html()) < 1939) {
      d3.select(".map0Annotation1939").style("opacity", "0")
    }
    if (parseInt(d3.select("#sliderYear").html()) > 1938) {
      d3.select(".map0Annotation1918").style("opacity", "0")
      d3.select(".map0Annotation1921").style("opacity", "0")
      d3.select(".map0Annotation1939").style("opacity", "1")
    }
    if (parseInt(d3.select("#sliderYear").html()) > 1950) {
      d3.select(".map0Annotation1939").style("opacity", "0")
    }
    if (parseInt(d3.select("#sliderYear").html()) < 1967) {
      d3.select(".map0Annotation1967").style("opacity", "0")
    }
    if (parseInt(d3.select("#sliderYear").html()) > 1966) {
      d3.select(".map0Annotation1967").style("opacity", "1")
    }
    if (parseInt(d3.select("#sliderYear").html()) > 1977) {
      d3.select(".map0Annotation1967").style("opacity", "0")
    }
    if (parseInt(d3.select("#sliderYear").html()) < 1985) {
      d3.select(".map0Annotation1985").style("opacity", "0")
    }
    if (parseInt(d3.select("#sliderYear").html()) > 1984) {
      d3.select(".map0Annotation1985").style("opacity", "1")
    }
    if (parseInt(d3.select("#sliderYear").html()) < 2002) {
      d3.select(".map0Annotation2002").style("opacity", "0")
    }
    if (parseInt(d3.select("#sliderYear").html()) > 2001) {
      d3.select(".map0Annotation1985").style("opacity", "0")
      d3.select(".map0Annotation2002").style("opacity", "1")
    }
    if (parseInt(d3.select("#sliderYear").html()) < 2018) {
      d3.selectAll(".map0Annotation2018").style("opacity", "0")
    }
    if (parseInt(d3.select("#sliderYear").html()) > 2017) {
      d3.select(".map0Annotation2002").style("opacity", "0")
      d3.selectAll(".map0Annotation2018").style("opacity", "1")

      svg.on("mouseover", function() {
        // d3.selectAll(".medMap0Hide").transition().duration(200).style("opacity", 0).style("display", "none")
        d3.selectAll(".map0Annotation2018").transition().duration(200).style("opacity", 0)
      }).on("mouseout", function() {
        // d3.selectAll(".medMap0Hide").style("display", "block").transition().duration(400).style("opacity", 1)
        d3.selectAll(".map0Annotation2018").transition().duration(400).style("opacity", 1)
      })
    }


    var newData = titles.filter(function(d) {
      return d.year <= formatDateIntoYear(h);
    })
    drawPlot(newData, placeData);
  } //end update

  // Annotations -- thank you Susie Lu
  const type = d3.annotationCustomType(
    d3.annotationCalloutElbow, {
      "connector": {
        "type": "elbow",
        "end": "dot"
      }
    })

  const map0Annotations = [{
      note: {
        label: "Titletowns of the late 1800s centred around the NE United States, home to a good chunk of early NCAA Div 1 football championships.",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-end map0Annotation1875",
      x: projection([-72.9642011, 41.2983476])[0] + 8,
      y: projection([-72.9642011, 41.2983476])[1] + 8,
      dy: -75,
      dx: -100
    },
    {
      note: {
        label: "Professional sports championships began with baseball's World Series landing in Boston, the first of their nine Major League titles, and quickly shifting to New York and then Chicago.",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-end map0Annotation1903",
      x: projection([-71.0588801, 42.3600825])[0] + 8,
      y: projection([-71.0588801, 42.3600825])[1] + 8,
      dy: -75,
      dx: -100
    },
    {
      note: {
        label: "The first professional Stanley Cup was won in 1918 by Toronto, the first of their 13. Hockey championships account for more than 30% of Toronto's titles.",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-end map0Annotation1918",
      x: projection([-79.3831843, 43.653226])[0] + 8,
      y: projection([-79.3831843, 43.653226])[1] + 8,
      dy: -85,
      dx: -105
    },
    {
      note: {
        label: "The first city on the West Coast to join the party was Berkeley, when the University of California Berkeley won its first of six NCAA titles.",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-start map0Annotation1921",
      x: projection([-122.272747, 37.8715926])[0] + 8,
      y: projection([-122.272747, 37.8715926])[1] + 8,
      dy: 75,
      dx: 90
    },
    {
      note: {
        label: "The inaugural March Madness, also known as the NCAA Division I Men's Basketball Tournament, was played in 1939 and won by the University of Oregon, bringing just the seventh title (all NCAA) to the West Coast.",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-start map0Annotation1939",
      x: projection([-123.0867536, 44.0520691])[0] + 8,
      y: projection([-123.0867536, 44.0520691])[1] + 8,
      dy: -75,
      dx: 90
    },
    {
      note: {
        label: "The first Superbowl (previously the NFL Championships) was won by Titletown USA, or Green Bay, Wisconsin, in 1967. Green Bay has won 13 NFL championships, the most of any city.",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-end map0Annotation1967",
      x: projection([-88.0132958, 44.5133188])[0] + 8,
      y: projection([-88.0132958, 44.5133188])[1] + 8,
      dy: 65,
      dx: -120
    },
    {
      note: {
        label: "By the mid-1980s, New York City was far and away the winningest city around, having claimed 43 professional titles (and just one college ship), mostly in baseball.",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-end map0Annotation1985",
      x: projection([-74.0059728, 40.7127753])[0] + 8,
      y: projection([-74.0059728, 40.7127753])[1] + 8,
      dy: -90,
      dx: -115
    },
    {
      note: {
        label: "In 2002, LA surpassed NYC in total championships, having won nine in the previous decade. They continue to be America's winningest city. West Coast, Best Coast.",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-start map0Annotation2002",
      x: projection([-118.2436849, 34.0522342])[0] + 8,
      y: projection([-118.2436849, 34.0522342])[1] + 8,
      dy: -60,
      dx: 85
    },
    {
      note: {
        title: "1. Los Angeles",
        label: "27 PRO/39 NCAA",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-start map0Annotation2018",
      x: projection([-118.2436849, 34.0522342])[0] + 8,
      y: projection([-118.2436849, 34.0522342])[1] + 8,
      dy: -40,
      dx: 50
    },
    {
      note: {
        title: "2. New York",
        label: "54 PRO/1 NCAA",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-end map0Annotation2018",
      x: projection([-74.0059728, 40.7127753])[0] + 8,
      y: projection([-74.0059728, 40.7127753])[1] + 8,
      dy: 100,
      dx: -110
    },
    {
      note: {
        title: "3. Toronto",
        label: "40 PRO",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-end map0Annotation2018",
      x: projection([-79.3831843, 43.653226])[0] + 8,
      y: projection([-79.3831843, 43.653226])[1] + 8,
      dy: -40,
      dx: -50
    },
    {
      note: {
        title: "4. Boston",
        label: "37 PRO",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-end map0Annotation2018",
      x: projection([-71.0588801, 42.3600825])[0] + 8,
      y: projection([-71.0588801, 42.3600825])[1] + 8,
      dy: -30,
      dx: -40
    },
    {
      note: {
        title: "5. Montreal",
        label: "36 PRO",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0hide map0Annotation annotation-end map0Annotation2018",
      x: projection([-73.567256, 45.5016889])[0] + 8,
      y: projection([-73.567256, 45.5016889])[1] + 8,
      dy: -40,
      dx: -50
    }
  ]

  const map0MakeAnnotations = d3.annotation()
    .textWrap(250)
    .type(type)
    .annotations(map0Annotations);

  d3.select("g.map0annotation-group").call(map0MakeAnnotations)

  if (userPlace != undefined && userPlace.city != "Los Angeles" && userPlace.city != "New York" && userPlace.city != "Toronto" && userPlace.city != "Boston" && userPlace.city != "Montreal") {
    const map0CurrentAnnotations = [{
      note: {
        title: userPlace.rank_all + ". " + userPlace.city,
        label: userPlace.count + " TITLES",
        orientation: "leftRight",
        lineType: "none",
        align: "middle"
      },
      className: "map0Annotation annotation-end map0Annotation2018 map0AnnotationCurrent",
      x: projection(parseCoord(userPlace.lngLat))[0] + 8,
      y: projection(parseCoord(userPlace.lngLat))[1] + 8,
      dy: -20,
      dx: -30
    }]

    const map0MakeCurrentAnnotations = d3.annotation()
      .textWrap(250)
      .type(type)
      .annotations(map0CurrentAnnotations);

    svg.append("g")
      .attr("class", "map0currentannotation-group").call(map0MakeCurrentAnnotations)
  }
  // end annotations



} // end drawMap0

function drawMap0small(titles) {

  var data = titles;

  var cityList = [];

  var svg = d3.select("#map0");
  var g = svg.append("g").attr("transform", "translate(" + mapD.m + "," + mapD.m + ")");
  d3.select("#play-button").style("display", "none")
  d3.select("#sliderYear").style("display", "none")
  d3.selectAll(".hide").style("display", "none")

  var cities = g.selectAll(".cityNFL")
    .data(data);

  cities.enter()
    .append("circle")
    .attr("class", "cityNFL")
    .attr("cx", function(d) {
      return projection(parseCoord(d.t1coord))[0]
    })
    .attr("cy", function(d) {
      return projection(parseCoord(d.t1coord))[1]
    })
    .style("fill", function(d) {
      return d.colour
    })
    .style("opacity", function(d) {
      var t1loc = camelize(d.t1loc)
      cityList.push(t1loc)
      var nth = countThis(cityList, t1loc)
      return opacityScale(nth) / 2
    })
    .attr("r", function(d) {
      var t1loc = camelize(d.t1loc)
      cityList.push(t1loc)
      var nth = countThis(cityList, t1loc)
      return nth / 3
    })



} // end drawMap0small

function drawProMaps(titles) {

  for (var i = 0; i < leagueList.length; i++) {
    var league = leagueList[i]

    var data = titles.filter(function(d) {
      return d.leagueLevel === league
    })

    var cityList = [];

    var svg = d3.select("#smallmap" + i);
    var g = svg.append("g").attr("transform", "translate(" + smallmapD.m + "," + smallmapD.m + ")");

    var cities = g.selectAll(".city" + league)
      .data(data);

    cities.enter()
      .append("circle")
      .attr("class", "promapCity city" + league)
      .attr("cx", function(d) {
        return smallprojection(parseCoord(d.t1coord))[0]
      })
      .attr("cy", function(d) {
        return smallprojection(parseCoord(d.t1coord))[1]
      })
      .style("fill", function(d) {
        return d.colour
      })
      .style("opacity", function(d) {
        var t1loc = camelize(d.t1loc)
        cityList.push(t1loc)
        var nth = countThis(cityList, t1loc)
        return opacityScale(nth) / 2
      })
      .attr("r", function(d) {
        var t1loc = camelize(d.t1loc)
        cityList.push(t1loc)
        var nth = countThis(cityList, t1loc)
        if (small_screen) return nth / 3
        if (!small_screen) return nth / 1.5
      })
  }

  window.addEventListener("resize", function() {
    d3.selectAll(".promapCity").attr("cx", function(d) {
      return smallprojection(parseCoord(d.t1coord))[0]
    }).attr("cy", function(d) {
      return smallprojection(parseCoord(d.t1coord))[1]
    })
  });


} // end drawProMaps

function drawProVsCollegeMaps(titles, placeData) {

  for (var i = 0; i < levelList.length; i++) {
    var level = levelList[i]

    var data = titles.filter(function(d) {
      return d.level === level
    })

    var cityList = [];

    var svg = d3.select("#mediummap" + i);
    var g = svg.append("g").attr("transform", "translate(" + mediummapD.m + "," + mediummapD.m + ")");
    var annoG = svg.append("g").attr("class", "medMap" + i + "Annotations-group");

    var cities = g.selectAll(".city" + level)
      .data(data);

    cities.enter()
      .append("circle")
      .attr("class", "proVsmapCity city" + level)
      .attr("cx", function(d) {
        return mediumprojection(parseCoord(d.t1coord))[0]
      })
      .attr("cy", function(d) {
        return mediumprojection(parseCoord(d.t1coord))[1]
      })
      .style("fill", function(d) {
        return d.colour
      })
      .style("opacity", function(d) {
        var t1loc = camelize(d.t1loc)
        cityList.push(t1loc)
        var nth = countThis(cityList, t1loc)
        return opacityScale(nth) / 2
      })
      .attr("r", function(d) {
        var t1loc = camelize(d.t1loc)
        cityList.push(t1loc)
        var nth = countThis(cityList, t1loc)
        if (small_screen) return nth / 5
        if (!small_screen) return nth / 4
      })

    var places = g.selectAll(".place" + level)
      .data(placeData);

    places.enter()
      .append("circle")
      .attr("class", "proVsmapcity place" + level)
      .attr("id", function(d) {
        return level + "-" + camelize(d.cityState)
      })
      .attr("cx", function(d) {
        return mediumprojection(parseCoord(d.lngLat))[0]
      })
      .attr("cy", function(d) {
        return mediumprojection(parseCoord(d.lngLat))[1]
      })
      .attr("r", function(d) {
        if (small_screen) return d[level] / 3
        if (!small_screen) return d[level] / 2
      })
      .style("fill", "#333")
      .style("opacity", 0)
  }

  var svg0 = d3.select("#mediummap0"),
    svg1 = d3.select("#mediummap1")

  d3.selectAll(".placepro")
    .on("mouseover", function(d) {
      svg0.append("text")
        .attr("class", "cityAnnoBG cityAnno-" + camelize(d.cityState))
        .attr("x", mediumprojection(parseCoord(d.lngLat))[0] + 8)
        .attr("y", mediumprojection(parseCoord(d.lngLat))[1] + 8)
        .attr("text-anchor", "middle")
        .attr("dy", function() {
          if (small_screen) return (d[level] / 5) * 2
          if (!small_screen) return (d[level] / 4) * 2
        })
        .text(d.city + " (" + d.pro + ")")

      svg0.append("text")
        .attr("class", "mainAnno cityAnno-" + camelize(d.cityState))
        .attr("x", mediumprojection(parseCoord(d.lngLat))[0] + 8)
        .attr("y", mediumprojection(parseCoord(d.lngLat))[1] + 8)
        .attr("text-anchor", "middle")
        .attr("dy", function() {
          if (small_screen) return (d[level] / 5) * 2
          if (!small_screen) return (d[level] / 4) * 2
        })
        .text(d.city + " (" + d.pro + ")")

      svg1.append("text")
        .attr("class", "cityAnnoBG cityAnno-" + camelize(d.cityState))
        .attr("x", mediumprojection(parseCoord(d.lngLat))[0] + 8)
        .attr("y", mediumprojection(parseCoord(d.lngLat))[1] + 8)
        .attr("text-anchor", "middle")
        .attr("dy", function() {
          if (small_screen) return (d[level] / 5) * 2
          if (!small_screen) return (d[level] / 4) * 2
        })
        .text(d.city + " (" + d.NCAA + ")")

      svg1.append("text")
        .attr("class", "mainAnno cityAnno-" + camelize(d.cityState))
        .attr("x", mediumprojection(parseCoord(d.lngLat))[0] + 8)
        .attr("y", mediumprojection(parseCoord(d.lngLat))[1] + 8)
        .attr("text-anchor", "middle")
        .attr("dy", function() {
          if (small_screen) return (d[level] / 5) * 2
          if (!small_screen) return (d[level] / 4) * 2
        })
        .text(d.city + " (" + d.NCAA + ")")
    })
    .on("mouseout", function(d) {
      d3.selectAll(".cityAnno-" + camelize(d.cityState)).transition().delay(200).duration(200).style("opacity", 0).remove();
    })

  d3.selectAll(".placeNCAA")
    .on("mouseover", function(d) {
      svg0.append("text")
        .attr("class", "cityAnnoBG cityAnno-" + camelize(d.cityState))
        .attr("x", mediumprojection(parseCoord(d.lngLat))[0] + 8)
        .attr("y", mediumprojection(parseCoord(d.lngLat))[1] + 8)
        .attr("text-anchor", "middle")
        .attr("dy", function() {
          if (small_screen) return (d[level] / 5) * 2
          if (!small_screen) return (d[level] / 4) * 2
        })
        .text(d.city + " (" + d.pro + ")")

      svg0.append("text")
        .attr("class", "mainAnno cityAnno-" + camelize(d.cityState))
        .attr("x", mediumprojection(parseCoord(d.lngLat))[0] + 8)
        .attr("y", mediumprojection(parseCoord(d.lngLat))[1] + 8)
        .attr("text-anchor", "middle")
        .attr("dy", function() {
          if (small_screen) return (d[level] / 5) * 2
          if (!small_screen) return (d[level] / 4) * 2
        })
        .text(d.city + " (" + d.pro + ")")

      svg1.append("text")
        .attr("class", "cityAnnoBG cityAnno-" + camelize(d.cityState))
        .attr("x", mediumprojection(parseCoord(d.lngLat))[0] + 8)
        .attr("y", mediumprojection(parseCoord(d.lngLat))[1] + 8)
        .attr("text-anchor", "middle")
        .attr("dy", function() {
          if (small_screen) return (d[level] / 5) * 2
          if (!small_screen) return (d[level] / 4) * 2
        })
        .text(d.city + " (" + d.NCAA + ")")

      svg1.append("text")
        .attr("class", "mainAnno cityAnno-" + camelize(d.cityState))
        .attr("x", mediumprojection(parseCoord(d.lngLat))[0] + 8)
        .attr("y", mediumprojection(parseCoord(d.lngLat))[1] + 8)
        .attr("text-anchor", "middle")
        .attr("dy", function() {
          if (small_screen) return (d[level] / 5) * 2
          if (!small_screen) return (d[level] / 4) * 2
        })
        .text(d.city + " (" + d.NCAA + ")")
    })
    .on("mouseout", function(d) {
      d3.selectAll(".cityAnno-" + camelize(d.cityState)).transition().delay(200).duration(200).style("opacity", 0).remove();
    })

  svg0.on("mouseover", function() {
    // d3.selectAll(".medMap0Hide").transition().duration(200).style("opacity", 0).style("display", "none")
    d3.selectAll(".medMap0Hide").transition().duration(200).style("opacity", 0)
  }).on("mouseout", function() {
    // d3.selectAll(".medMap0Hide").style("display", "block").transition().duration(400).style("opacity", 1)
    d3.selectAll(".medMap0Hide").transition().duration(400).style("opacity", 1)
  })

  svg1.on("mouseover", function() {
    // d3.selectAll(".medMap0Hide").transition().duration(200).style("opacity", 0).style("display", "none")
    d3.selectAll(".medMap0Hide").transition().duration(200).style("opacity", 0)
  }).on("mouseout", function() {
    // d3.selectAll(".medMap0Hide").style("display", "block").transition().duration(400).style("opacity", 1)
    d3.selectAll(".medMap0Hide").transition().duration(400).style("opacity", 1)
  })

  var cityMainAnnos0 = {
      cities: ["1. New York", "3. Boston", "6. Los Angeles", "5. Chicago"],
      ranks: [54, 37, 27, 29],
      coords: [
        [-74.0059728, 40.7127753],
        [-71.0588801, 42.3600825],
        [-118.2436849, 34.0522342],
        [-87.6297982, 41.8781136]
      ]
    },
    cityMainAnnos1 = {
      cities: ["1. Los Angeles", "2. Chapel Hill", "3. Notre Dame", "3. New Haven", "5. Tuscaloosa"],
      ranks: [39, 28, 18, 18, 15],
      coords: [
        [-118.2436849, 34.0522342],
        [-79.0558445, 35.9131996],
        [-86.2379328, 41.7001908],
        [-72.9278835, 41.308274],
        [-87.5691734999999, 33.2098407]
      ]
    },
    cityAnnos0 = {
      cities: ["Chapel Hill", "Tuscaloosa", "Notre Dame"],
      ranks: [0, 0, 0],
      coords: [
        [-79.0558445, 35.9131996],
        [-87.5691734999999, 33.2098407],
        [-86.2379328, 41.7001908]
      ]
    },
    cityAnnos1 = {
      cities: ["New York", "Boston", "Chicago"],
      ranks: [1, 0, 3],
      coords: [
        [-74.0059728, 40.7127753],
        [-71.0588801, 42.3600825],
        [-87.6297982, 41.8781136]
      ]
    }

  for (var i = 0; i < cityAnnos0.cities.length; i++) {
    svg0.append("circle")
      .attr("class", "medMap0Hide")
      .attr("cx", mediumprojection(cityAnnos0.coords[i])[0] + 8)
      .attr("cy", mediumprojection(cityAnnos0.coords[i])[1] + 8)
      .attr("r", 4)
      .style("stroke", "#fff")

    svg0.append("circle")
      .attr("class", "medMap0Hide")
      .attr("cx", mediumprojection(cityAnnos0.coords[i])[0] + 8)
      .attr("cy", mediumprojection(cityAnnos0.coords[i])[1] + 8)
      .attr("r", 4)
      .style("fill", "#b5b5b5")

    svg1.append("circle")
      .attr("class", "medMap0Hide")
      .attr("cx", mediumprojection(cityAnnos1.coords[i])[0] + 8)
      .attr("cy", mediumprojection(cityAnnos1.coords[i])[1] + 8)
      .attr("r", 4)
      .style("stroke", "#fff")

    svg1.append("circle")
      .attr("class", "medMap0Hide")
      .attr("cx", mediumprojection(cityAnnos1.coords[i])[0] + 8)
      .attr("cy", mediumprojection(cityAnnos1.coords[i])[1] + 8)
      .attr("r", 4)
      .style("fill", "#b5b5b5")

    svg0.append("text")
      .attr("class", "cityAnnoBG medMap0Hide")
      .attr("x", mediumprojection(cityAnnos0.coords[i])[0] + 8)
      .attr("y", mediumprojection(cityAnnos0.coords[i])[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", function() {
        if (cityAnnos0.cities[i] === "Notre Dame") return -13
        return 13
      })
      .text(cityAnnos0.cities[i] + " (" + cityAnnos0.ranks[i] + ")")

    svg1.append("text")
      .attr("class", "cityAnnoBG medMap0Hide")
      .attr("x", mediumprojection(cityAnnos1.coords[i])[0] + 8)
      .attr("y", mediumprojection(cityAnnos1.coords[i])[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", function() {
        if (cityAnnos1.cities[i] === "Chicago" || cityAnnos1.cities[i] === "Boston") return -13
        return 13
      })
      .text(cityAnnos1.cities[i] + " (" + cityAnnos1.ranks[i] + ")")

    svg0.append("text")
      .attr("class", "cityAnno medMap0Hide")
      .attr("x", mediumprojection(cityAnnos0.coords[i])[0] + 8)
      .attr("y", mediumprojection(cityAnnos0.coords[i])[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", function() {
        if (cityAnnos0.cities[i] === "Notre Dame") return -13
        return 13
      })
      .text(cityAnnos0.cities[i] + " (" + cityAnnos0.ranks[i] + ")")

    svg1.append("text")
      .attr("class", "cityAnno medMap0Hide")
      .attr("x", mediumprojection(cityAnnos1.coords[i])[0] + 8)
      .attr("y", mediumprojection(cityAnnos1.coords[i])[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", function() {
        if (cityAnnos1.cities[i] === "Chicago" || cityAnnos1.cities[i] === "Boston") return -13
        return 13
      })
      .text(cityAnnos1.cities[i] + " (" + cityAnnos1.ranks[i] + ")")
  }

  for (var i = 0; i < cityMainAnnos0.cities.length; i++) {
    svg0.append("text")
      .attr("class", "mainAnnoBG medMap0Hide")
      .attr("x", mediumprojection(cityMainAnnos0.coords[i])[0] + 8)
      .attr("y", mediumprojection(cityMainAnnos0.coords[i])[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", (cityMainAnnos0.ranks[i] / 4) * 2)
      .text(cityMainAnnos0.cities[i] + " (" + cityMainAnnos0.ranks[i] + ")")

    svg0.append("text")
      .attr("class", "mainAnno medMap0Hide")
      .attr("x", mediumprojection(cityMainAnnos0.coords[i])[0] + 8)
      .attr("y", mediumprojection(cityMainAnnos0.coords[i])[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", cityMainAnnos0.ranks[i] / 4 * 2)
      .text(cityMainAnnos0.cities[i] + " (" + cityMainAnnos0.ranks[i] + ")")
  }

  for (var i = 0; i < cityMainAnnos1.cities.length; i++) {
    svg1.append("text")
      .attr("class", "mainAnnoBG medMap0Hide")
      .attr("x", mediumprojection(cityMainAnnos1.coords[i])[0] + 8)
      .attr("y", mediumprojection(cityMainAnnos1.coords[i])[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", (cityMainAnnos1.ranks[i] / 4) * 2)
      .text(cityMainAnnos1.cities[i] + " (" + cityMainAnnos1.ranks[i] + ")")

    svg1.append("text")
      .attr("class", "mainAnno medMap0Hide")
      .attr("x", mediumprojection(cityMainAnnos1.coords[i])[0] + 8)
      .attr("y", mediumprojection(cityMainAnnos1.coords[i])[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", cityMainAnnos1.ranks[i] / 4 * 2)
      .text(cityMainAnnos1.cities[i] + " (" + cityMainAnnos1.ranks[i] + ")")
  }

  if (userPlace != undefined && userPlace.city != "Los Angeles" && userPlace.city != "New York" && userPlace.city != "Boston" && userPlace.city != "Chapel Hill" && userPlace.city != "Tuscaloosa" && userPlace.city != "Notre Dame") {

    svg0.append("circle")
      .attr("class", "medMap0Hide")
      .attr("cx", mediumprojection(parseCoord(userPlace.lngLat))[0] + 8)
      .attr("cy", mediumprojection(parseCoord(userPlace.lngLat))[1] + 8)
      .attr("r", 4)
      .style("fill", "#b5b5b5")

    svg1.append("circle")
      .attr("class", "medMap0Hide")
      .attr("cx", mediumprojection(parseCoord(userPlace.lngLat))[0] + 8)
      .attr("cy", mediumprojection(parseCoord(userPlace.lngLat))[1] + 8)
      .attr("r", 4)
      .style("fill", "#b5b5b5")

    svg0.append("text")
      .attr("class", "cityAnnoBG medMap0Hide")
      .attr("x", mediumprojection(parseCoord(userPlace.lngLat))[0] + 8)
      .attr("y", mediumprojection(parseCoord(userPlace.lngLat))[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", 13)
      .text(userPlace.city + " (" + userPlace.count + ")")

    svg1.append("text")
      .attr("class", "cityAnnoBG medMap0Hide")
      .attr("x", mediumprojection(parseCoord(userPlace.lngLat))[0] + 8)
      .attr("y", mediumprojection(parseCoord(userPlace.lngLat))[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", 13)
      .text(userPlace.city + " (" + userPlace.NCAA + ")")

    svg0.append("text")
      .attr("class", "cityAnno medMap0Hide")
      .attr("x", mediumprojection(parseCoord(userPlace.lngLat))[0] + 8)
      .attr("y", mediumprojection(parseCoord(userPlace.lngLat))[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", 13)
      .text(userPlace.city + " (" + userPlace.count + ")")

    svg1.append("text")
      .attr("class", "cityAnno medMap0Hide")
      .attr("x", mediumprojection(parseCoord(userPlace.lngLat))[0] + 8)
      .attr("y", mediumprojection(parseCoord(userPlace.lngLat))[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", 13)
      .text(userPlace.city + " (" + userPlace.NCAA + ")")
  }
  // end annotations


  window.addEventListener("resize", function() {
    d3.selectAll(".proVsmapCity").attr("cx", function(d) {
      return mediumprojection(parseCoord(d.t1coord))[0]
    }).attr("cy", function(d) {
      return mediumprojection(parseCoord(d.t1coord))[1]
    })
  });
} // end drawProVsCollegeMaps

function drawChart1(matrix) {

  var startDate = new Date(1870, 0, 1),
    endDate = new Date(2018, 11, 31);

  var svg = d3.select("#chart1");
  var g = svg.append("g").attr("transform", "translate(" + c1m.left + "," + c1m.top + ")");

  var cities = matrix.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: matrix.filter(function(k) {
        return !isNaN(+k[id]);
      }).map(function(d) {
        return {
          date: parseYear(d.date),
          wins: +(d[id]),
        };
      })
    };
  });

  xscale.domain(d3.extent(matrix, function(d) {
    return parseYear(d.date);
  }));

  yscale.domain([
    d3.min(cities, function(c) {
      return d3.min(c.values, function(d) {
        return d.wins;
      });
    }),
    d3.max(cities, function(c) {
      return d3.max(c.values, function(d) {
        return d.wins;
      });
    })
  ]);

  var xAxis = d3.axisBottom(xscale)
    .tickSize(0)
    .tickValues([parseYear(1870), parseYear(1900), parseYear(1930), parseYear(1960), parseYear(1990), parseYear(2018)])

  var yAxis = d3.axisLeft(yscale)
    .tickSize(-c1D.w)
    .tickValues([10, 20, 30, 40, 50, 60])

  g.append("g")
    .attr("class", "axis xAxis")
    .attr("transform", "translate(0," + parseInt(c1D.h) + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("dy", 10)

  g.append("g")
    .attr("class", "axis yAxis")
    .call(yAxis)
    .selectAll("text")
    .attr("dy", -4)
    .attr("dx", 2)
    .attr("text-anchor", "start")

  var city = g.selectAll(".citylineG")
    .data(cities)
    .enter().append("g")
    .attr("class", "citylineG");

  city.append("path")
    .attr("class", "cityline")
    .attr("id", function(d) {
      return "chart1-" + camelize(d.id)
    })
    .attr("d", function(d) {
      return line(d.values);
    })
    .on("mouseover", function(d) {
      if (!small_screen) {
        d3.selectAll(".cityline").style("opacity", .5).style("stroke", "#666").style("stroke-width", "1.5px")
        d3.select(this).style("opacity", .75).style("stroke", "#fff").style("stroke-width", "2px")

        var values = d.values.filter(function(e) {
          return e.wins > 0;
        })

        var bg = g.append("rect").attr("class", "c1tt c1ttbg")

        var c1ttmain = g.append("text")
          .attr("class", "c1tt c1ttmain")
          .attr("x", xscale(d3.max(values, function(e) {
            return e.date;
          })))
          .attr("y", yscale(d3.max(d.values, function(e) {
            return e.wins;
          })))
          .attr("dy", -3)
          .attr("dx", 8)
          .text(d.id)

        g.append("text")
          .attr("class", "c1tt c1ttsub")
          .attr("x", xscale(d3.max(values, function(e) {
            return e.date;
          })))
          .attr("y", yscale(d3.max(d.values, function(e) {
            return e.wins;
          })))
          .attr("dy", 12)
          .attr("dx", 8)
          .text(d3.max(d.values, function(e) {
            return e.wins;
          }) + " titles")

        var bb = c1ttmain.node().getBBox()
        bg.attr("x", bb.x - 8)
          .attr("y", bb.y - 8)
          .attr("width", bb.width + 16)
          .attr("height", bb.height + 16 + 12)
      }

    })
    .on("mouseout", function() {
      if (!small_screen) {
        d3.select(this).style("opacity", .5).style("stroke", "#666").style("stroke-width", "1.5px")
        d3.select("#chart1-losAngelesCalifornia").style("opacity", .75).style("stroke", "#fff").style("stroke-width", "2px")
        d3.select("#chart1-newYorkNewYork").style("opacity", .75).style("stroke", "#fff").style("stroke-width", "2px")
        d3.select("#chart1-torontoOntario").style("opacity", .75).style("stroke", "#fff").style("stroke-width", "2px")
        d3.select("#chart1-bostonMassachusetts").style("opacity", .75).style("stroke", "#fff").style("stroke-width", "2px")
        d3.selectAll(".c1tt").remove();
      }
    });


} // end drawChart1

function drawChart2(titleData, placeData) {

  var w, h, c2x, term;

  placeData.forEach(function(placeData) {
    searchArray.push(placeData.city + ", " + placeData.stateAbb)
  })

  var options = {
    data: searchArray,
    list: {
      maxNumberOfElements: 5,
      sort: {
        enabled: true
      },
      match: {
        enabled: true
      },
      onClickEvent: function() {
        term = $(".search-bar").val()
        $(".search-bar").val("")
        addLast(term, key, metrics[key], titleData, placeData);
      },
      onKeyEnterEvent: function() {
        term = $(".search-bar").val()
        $(".search-bar").val("")
        addLast(term, key, metrics[key], titleData, placeData);
      }
    }
  };

  // if (small_screen) $("#search-barS").easyAutocomplete(options);
  // if (!small_screen) $("#search-bar").easyAutocomplete(options);

  $(".search-bar").easyAutocomplete(options);

  var key = "count",
    metrics = {
      count: ["mlb", "nba", "nfl", "nhl", "mls", "cfl", "ncaa"],
      pro: ["mlb", "nba", "nfl", "nhl", "mls", "cfl"],
      ncaa: ["ncaa-baseball-m", "ncaa-basketball-m", "ncaa-basketball-w", "ncaa-football-m", "ncaa-soccer-w", "ncaa-volleyball-w"]
    },
    subfilters = {
      professional: ["MLB", "NBA", "NFL", "NHL", "MLS", "CFL"],
      college: ["Baseball (M)", "Basketball (M)", "Basketball (W)", "Football (M)", "Soccer (W)", "Volleyball (W)"]
    };

  if (userPlace != undefined) {
    term = userPlace.city + ", " + userPlace.stateAbb;
  } else {
    term = "Minneapolis, MN";
  }

  chart2(key, metrics[key], titleData, placeData);
  addLast(term, key, metrics[key], titleData, placeData);

  $(".c2option").click(function() {
    $(".c2option").removeClass("c2optionActive")
    $(this).addClass("c2optionActive")
    key = $(this).attr("key")
    if (key === "count") $("#chart2headertext").text("Sports")
    if (key === "pro") $("#chart2headertext").text("Pro Sports")
    if (key === "ncaa") $("#chart2headertext").text("College Sports")
    d3.selectAll(".c2remove").remove();
    d3.selectAll(".c2subfilter").remove();
    drawSubfilter(key, metrics[key], titleData, placeData)
    chart2(key, metrics[key], titleData, placeData);
    addLast(term, key, metrics[key], titleData, placeData);
  })

  function drawSubfilter(key, metrics, titleData, placeData) {
    if (key === "pro") {
      var subfilter = d3.selectAll(".c2filter").append("div").attr("class", "c2subfilter");
      subfilter.append("span").attr("class", "c2subOption c2subOptionActive").attr("key", "pro").text("All")

      for (var n = 0; n < subfilters.professional.length; n++) {
        subfilter.append("span").attr("class", "c2subOption").attr("key", metrics[n]).text(subfilters.professional[n])
      }

      $(".c2subOption").click(function() {
        $(".c2subOption").removeClass("c2subOptionActive")
        $(this).addClass("c2subOptionActive")
        key = $(this).attr("key")
        if (key === "pro") $("#chart2headertext").text("Pro Sports")
        if (key === "mlb") $("#chart2headertext").text("Pro Baseball")
        if (key === "nba") $("#chart2headertext").text("Pro Basketball")
        if (key === "nfl") $("#chart2headertext").text("Pro Football")
        if (key === "nhl") $("#chart2headertext").text("Pro Hockey")
        if (key === "mls") $("#chart2headertext").text("Pro Soccer")
        if (key === "cfl") $("#chart2headertext").text("Canadian Football")
        d3.selectAll(".c2remove").remove();
        if (key != "pro") var newMetric = [key]
        if (key === "pro") var newMetric = metrics;
        chart2(key, newMetric, titleData, placeData);
        addLast(term, key, newMetric, titleData, placeData);
      })
    }

    if (key === "ncaa") {
      var subfilter = d3.selectAll(".c2filter").append("div").attr("class", "c2subfilter");
      subfilter.append("span").attr("class", "c2subOption c2subOptionActive").attr("key", "ncaa").text("All")

      for (var n = 0; n < subfilters.college.length; n++) {
        subfilter.append("span").attr("class", "c2subOption").attr("key", metrics[n]).text(subfilters.college[n])
      }

      $(".c2subOption").click(function() {
        $(".c2subOption").removeClass("c2subOptionActive")
        $(this).addClass("c2subOptionActive")
        key = $(this).attr("key")
        if (key === "ncaa") $("#chart2headertext").text("College Sports")
        if (key === "ncaa-baseball-m") $("#chart2headertext").text("Men's College Baseball")
        if (key === "ncaa-basketball-m") $("#chart2headertext").text("Men's College Basketball")
        if (key === "ncaa-basketball-w") $("#chart2headertext").text("Women's College Basketball")
        if (key === "ncaa-football-m") $("#chart2headertext").text("Men's College Football")
        if (key === "ncaa-soccer-w") $("#chart2headertext").text("Women's College Soccer")
        if (key === "ncaa-volleyball-w") $("#chart2headertext").text("Women's College Volleyball")
        d3.selectAll(".c2remove").remove();
        if (key != "ncaa") var newMetric = [key]
        if (key === "ncaa") var newMetric = metrics;
        chart2(key, newMetric, titleData, placeData);
        addLast(term, key, newMetric, titleData, placeData);
      })
    }

  }

  function chart2(key, metrics, titleData, placeData) {
    var data;

    data = placeData.sort(function(a, b) {
      return d3.descending(+a[key], +b[key]);
    }).slice(0, 10);

    var max = d3.max(data, function(d) {
      return +d[key]; //<-- convert to number
    })

    c2x = d3.scaleLinear().domain([0, 66])

    for (var i = 0; i < data.length; i++) {

      var row = d3.select(".chart2left").append("div").attr("class", "c2remove chart2row");

      h = 15
      w = $(".chart2row").width() - 160;

      c2x.range([1, w - 15])

      var rank = i + 1

      if (i > 0) {
        if (data[i][key] === data[i - 1][key]) rank = i
      }

      if (i > 2) {
        if (data[i][key] === data[i - 2][key]) rank = i - 1
      }

      if (i > 4) {
        if (data[i][key] === data[i - 3][key]) rank = i - 2
      }

      if (i > 4) {
        if (data[i][key] === data[i - 4][key]) rank = i - 3
      }

      row.append("div").attr("class", "c2remove chart2rank").text(rank)
      row.append("div").attr("class", "c2remove chart2city").text(data[i].city + ", " + data[i].stateAbb)
      var svg = row.append("svg").attr("class", "c2remove chart2svg").attr("height", h).attr("width", w);

      for (var j = 0; j < metrics.length; j++) {

        var x1 = 0;

        for (var k = 0; k < j; k++) {
          if (data[i][metrics[k]] > 0) x1 += c2x(data[i][metrics[k]])
        }

        if (data[i][metrics[j]] > 0) {
          svg.append("rect")
            .attr("class", "c2rect c2remove")
            .attr("id", "c2text" + camelize(data[i].city) + "-" + camelize(metrics[j]))
            .attr("x", x1)
            .attr("y", 3)
            .attr("height", h - 3)
            .attr("width", c2x(data[i][metrics[j]] - 1))
            .style("fill", "#333")
            .style("stroke", function() {
              if (key === "ncaa") return cLeagues["ncaa"]
              return cLeagues[metrics[j]]
            })
            .style("stroke-width", 2)
            .style("opacity", 0)
            .on("mouseover", function(i, j) {
              d3.select(this).style("opacity", 1)
              d3.selectAll("." + $(this).attr("id")).style("opacity", 1)
            })
            .on("mouseout", function() {
              d3.select(this).style("opacity", 0)
              d3.selectAll("." + $(this).attr("id")).style("opacity", 0)
            })

          for (var n = 0; n < data[i][metrics[j]]; n++) {
            svg.append("rect")
              .attr("class", "c2ticks c2remove")
              .attr("x", (x1 + c2x(n)) - 2)
              .attr("y", 3)
              .attr("width", 2)
              .attr("height", h - 3)
              .style("fill", function() {
                if (key === "ncaa") return cLeagues["ncaa"]
                return cLeagues[metrics[j]]
              })
          }

          if (metrics.length > 1) {
            svg.append("text")
              .attr("class", "c2text c2remove chart2label c2text" + camelize(data[i].city) + "-" + camelize(metrics[j]))
              .attr("x", x1)
              .attr("y", 0)
              .attr("dy", -3)
              .attr("dx", 0)
              .text(data[i][metrics[j]] + " (" + metrics[j] + ")")
              .style("fill", "none")
              .style("stroke", "#333")
              .style("stroke-width", 4)
              .style("opacity", 0)

            svg.append("text")
              .attr("class", "c2text c2remove chart2label c2text" + camelize(data[i].city) + "-" + camelize(metrics[j]))
              .attr("x", x1)
              .attr("y", 0)
              .attr("dy", -3)
              .attr("dx", 0)
              .text(data[i][metrics[j]] + " (" + metrics[j] + ")")
              .style("fill", "#efefef")
              .style("opacity", 0)
          }
        }
      }

      svg.append("text")
        .attr("class", "c2remove chart2label")
        .attr("x", c2x(data[i][key]))
        .attr("y", 3)
        .attr("dy", 9)
        .attr("dx", 7)
        .text(data[i][key])
        .style("fill", "#efefef")

    }
  } //end chart2

  function addLast(term, key, metrics, titleData, placeData) {

    d3.selectAll(".lastRemove").remove()

    var lastData = placeData.filter(function(placeData) {
      return camelize(placeData.city + ", " + placeData.stateAbb) === camelize(term);
    })

    var row = d3.select(".chart2left").append("div").attr("class", "lastRemove chart2row c2remove chart2lastrow");
    row.append("div").attr("class", "lastRemove c2remove chart2rank").text("")
    row.append("div").attr("class", "lastRemove c2remove chart2city").text(lastData[0].city + ", " + lastData[0].stateAbb)
    var lastsvg = row.append("svg").attr("class", "lastRemove c2remove chart2svg").attr("height", h).attr("width", w);

    for (var j = 0; j < metrics.length; j++) {

      var x1 = 0;

      for (var k = 0; k < j; k++) {
        if (lastData[0][metrics[k]] > 0) x1 += c2x(lastData[0][metrics[k]])
      }

      if (lastData[0][metrics[j]] > 0) {
        lastsvg.append("rect")
          .attr("class", "c2rect c2remove")
          .attr("id", "c2text" + camelize(lastData[0].city) + "-" + camelize(metrics[j]))
          .attr("x", x1)
          .attr("y", 3)
          .attr("height", h - 3)
          .attr("width", c2x(lastData[0][metrics[j]] - 1))
          .style("fill", "#333")
          .style("stroke", function() {
            if (key === "ncaa") return cLeagues["ncaa"]
            return cLeagues[metrics[j]]
          })
          .style("stroke-width", 2)
          .style("opacity", 0)
          .on("mouseover", function(i, j) {
            d3.select(this).style("opacity", 1)
            d3.selectAll("." + $(this).attr("id")).style("opacity", 1)
          })
          .on("mouseout", function() {
            d3.select(this).style("opacity", 0)
            d3.selectAll("." + $(this).attr("id")).style("opacity", 0)
          })

        for (var n = 0; n < lastData[0][metrics[j]]; n++) {
          lastsvg.append("rect")
            .attr("class", "c2ticks c2remove")
            .attr("x", (x1 + c2x(n)) - 2)
            .attr("y", 3)
            .attr("width", 2)
            .attr("height", h - 3)
            .style("fill", function() {
              if (key === "ncaa") return cLeagues["ncaa"]
              return cLeagues[metrics[j]]
            })
        }

        if (metrics.length > 1) {
          lastsvg.append("text")
            .attr("class", "c2text c2remove chart2label c2text" + camelize(lastData[0].city) + "-" + camelize(metrics[j]))
            .attr("x", x1)
            .attr("y", 0)
            .attr("dy", 0)
            .attr("dx", 0)
            .text(lastData[0][metrics[j]] + " (" + metrics[j] + ")")
            .style("fill", "none")
            .style("stroke", "#333")
            .style("stroke-width", 4)
            .style("opacity", 0)

          lastsvg.append("text")
            .attr("class", "c2text c2remove chart2label c2text" + camelize(lastData[0].city) + "-" + camelize(metrics[j]))
            .attr("x", x1)
            .attr("y", 0)
            .attr("dy", 0)
            .attr("dx", 0)
            .text(lastData[0][metrics[j]] + " (" + metrics[j] + ")")
            .style("fill", "#efefef")
            .style("opacity", 0)
        }
      }
    }

    lastsvg.append("text")
      .attr("class", "c2remove chart2label")
      .attr("x", c2x(lastData[0][key]))
      .attr("y", 3)
      .attr("dy", 9)
      .attr("dx", 7)
      .text(lastData[0][key])
      .style("fill", "#efefef")
  } // end addLast

} // end drawChart2

// supplementary functions
function camelize(str) {
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function countThis(array, value) {
  var n = -1;
  var i = -1;
  do {
    n++;
    i = array.indexOf(value, i + 1);
  } while (i >= 0);

  return n;
}

function parseCoord(value) {
  return JSON.parse("[" + value + "]")[0]
}

function Deg2Rad(deg) {
  return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
  lat1 = Deg2Rad(lat1);
  lat2 = Deg2Rad(lat2);
  lon1 = Deg2Rad(lon1);
  lon2 = Deg2Rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = (lat2 - lat1);
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
}

function ipLookUp() {
  $.ajax('http://ip-api.com/json')
    .then(
      function success(response) {
        userCoord.push(response.lat, response.lon)
      }
    );
}

function findClosest(places) {
  var mindif = 99999;
  var closest;

  for (i = 0; i < places.length; ++i) {
    var dif = PythagorasEquirectangular(userCoord[0], userCoord[1], places[i].Latitude, places[i].Longitude);
    if (dif < mindif) {
      closest = i;
      mindif = dif;
    }
  }
  userPlace = places[closest]
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}