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

  windowW = window.innerWidth;
  windowH = window.innerHeight;

  large_screen = false
  medium_screen = false
  small_screen = false

  if (windowW >= 900) {
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
    d3.select("#chart-overtext1").style("display", "none")
    d3.select("#c1story").style("display", "block")
    d3.select(".chart-container").style("margin-top", "25px")
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
} // end loadData

function processData(error, world, us, canada, titles, places, matrix) {
  handleResize();
  window.addEventListener("resize", handleResize);
  drawMaps(world, us, canada);
  if (small_screen) drawMap0small(titles);
  if (!small_screen) drawMap0(titles);
  drawProMaps(titles);
  drawProVsCollegeMaps(titles);
  drawChart1(matrix);
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

  // map0scene.on("enter", function() {
  //   if (!map0) {
  //     map0 = true;
  //     $("#play-button").click();
  //   }
  // })

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

function drawMap0(titles) {

  var svg = d3.select("#map0");
  var gCircle = svg.append("g").attr("transform", "translate(" + mapD.m + "," + mapD.m + ")"),
    gTrophy = svg.append("g").attr("transform", "translate(" + mapD.m + "," + mapD.m + ")");

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
  var currentValue = 30;

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
    .attr("class", "handle")
    .attr("r", 5)
    .attr("cx", x(startDate));

  var handleStroke = slider.insert("circle", ".track-overlay")
    .attr("class", "handleStroke")
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

  function drawPlot(data) {
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
        return opacityScale(d.nth) / 2
      })
      .attr("r", 0)
      .transition().duration(400)
      .attr("r", function(d) {
        return d.nth
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

    var newData = titles.filter(function(d) {
      return d.year <= formatDateIntoYear(h);
    })
    drawPlot(newData);
  } //end update
} // end drawMap0

function drawMap0small(titles) {

  var data = titles;

  var cityList = [];

  var svg = d3.select("#map0");
  var g = svg.append("g").attr("transform", "translate(" + mapD.m + "," + mapD.m + ")");
  d3.select("#play-button").style("display", "none")
  d3.select("#sliderYear").style("display", "none")

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
      .attr("class", "city" + league)
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
    d3.selectAll(".cityMLB").attr("cx", function(d) {
      return smallprojection(parseCoord(d.t1coord))[0]
    }).attr("cy", function(d) {
      return smallprojection(parseCoord(d.t1coord))[1]
    })
    d3.selectAll(".cityNBA").attr("cx", function(d) {
      return smallprojection(parseCoord(d.t1coord))[0]
    }).attr("cy", function(d) {
      return smallprojection(parseCoord(d.t1coord))[1]
    })
    d3.selectAll(".cityNFL").attr("cx", function(d) {
      return smallprojection(parseCoord(d.t1coord))[0]
    }).attr("cy", function(d) {
      return smallprojection(parseCoord(d.t1coord))[1]
    })
    d3.selectAll(".cityNHL").attr("cx", function(d) {
      return smallprojection(parseCoord(d.t1coord))[0]
    }).attr("cy", function(d) {
      return smallprojection(parseCoord(d.t1coord))[1]
    })
  });


} // end drawProMaps

function drawProVsCollegeMaps(titles) {

  for (var i = 0; i < levelList.length; i++) {
    var level = levelList[i]

    var data = titles.filter(function(d) {
      return d.level === level
    })

    var cityList = [];

    var svg = d3.select("#mediummap" + i);
    var g = svg.append("g").attr("transform", "translate(" + mediummapD.m + "," + mediummapD.m + ")");

    var cities = g.selectAll(".city" + level)
      .data(data);

    cities.enter()
      .append("circle")
      .attr("class", "city" + level)
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
        if (small_screen) return nth / 4
        if (!small_screen) return nth / 2
      })
  }

  window.addEventListener("resize", function() {
    d3.selectAll(".citypro").attr("cx", function(d) {
      return mediumprojection(parseCoord(d.t1coord))[0]
    }).attr("cy", function(d) {
      return mediumprojection(parseCoord(d.t1coord))[1]
    })
    d3.selectAll(".cityNCAA").attr("cx", function(d) {
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