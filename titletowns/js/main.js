var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');

var stepheight,
  bodyWidth,
  textWidth,
  graphicWidth,
  chartMargin,
  chartWidth,
  chartHeight;

var scroller = scrollama();


d3.select(".title-wrapper").style("background-image", "url('./img/backgrounds/" + getRandomInt(1, 7) + ".jpg')")

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
    right: 25,
    bottom: 30,
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

var windowW, windowH, projection, path, smallprojectio, smallpath, mediumprojection, mediumpath, line, targetValue, x;

var trophyList = ["NBA", "NHL", "NFL", "MLB", "CFL", "MLS", "volleyball-w", "baseball-m", "basketball-w", "basketball-m", "football-m", "soccer-w"],
  leagueList = ["MLB", "NBA", "NFL", "NHL"],
  levelList = ["pro", "NCAA"],
  opacityScale = d3.scaleLinear().domain([1, 64]).range([.25, .05]);


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
    c1m.right = 15
    c1D.w = windowW - 16 - c1m.left - c1m.right
    c1D.h = windowW * .66 - c1m.top - c1m.bottom
    smallmapD.w = (windowW / 2) - 8
    smallmapD.h = (windowW / 2) * .66
    mediummapD.w = (windowW - 20)
    mediummapD.h = windowW * .66
    d3.selectAll(".nomobile").style("display", "none").remove();
    d3.selectAll(".onlymobile").style("display", "block")
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
    d3.selectAll(".mobileMap0").style("display", "none")
    d3.selectAll(".onlymobile").style("display", "block")
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
    d3.selectAll(".mobileMap0").style("display", "none")
  }

  // SCROLLAMA
  stepHeight = Math.floor(window.innerHeight * 0.75);
  step.style('height', stepHeight + 'px');

  bodyWidth = d3.select('body').node().offsetWidth;
  textWidth = text.node().offsetWidth;
  graphicWidth = mapD.w;

  graphic
    .style('width', graphicWidth + 'px')
    .style('height', window.innerHeight + 'px');

  chartMargin = mapD.m;
  chartWidth = graphic.node().offsetWidth - chartMargin;
  chartHeight = mapD.h;

  chart
    .style('width', chartWidth + 'px')
    .style('height', chartHeight + 'px');

  scroller.resize();

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
    .curve(d3.curveStepAfter)
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
    // .style("transform", "translate(" + (mapD.m + margin.left) + "px)")
  }

  for (var i = 0; i < smallmapCount; i++) {
    d3.select("#smallmap" + i).attr("height", smallmapD.h)
      .attr("width", smallmapD.w)
      .style("transform", "translate(" + (smallmapD.m + margin.left) + "px)")
  }

  for (var i = 0; i < mediummapCount; i++) {
    d3.select("#mediummap" + i).attr("height", mediummapD.h)
      .attr("width", mediummapD.w)
      .style("transform", "translate(" + (mediummapD.m + margin.left) + "px)")
  }

  d3.select("#chart1").attr("height", c1D.h + c1m.top + c1m.bottom)
    .attr("width", c1D.w + c1m.left + c1m.right)
    .style("transform", "translate(" + margin.left + "px)")

  d3.select(".c1close")
    .style("width", c1D.w + c1m.left + c1m.right + "px")
    .style("transform", "translate(" + margin.left + "px)")

  d3.selectAll(".overchart").style("transform", "translate(" + (margin.left + c1m.left) + "px)")

  d3.selectAll(".mapcaptionsmall").style("left", margin.left + ((smallmapD.w * .25) / 2) + "px").style("width", smallmapD.w * .75 + "px")
  d3.selectAll(".mapcaptionmedium").style("left", margin.left + ((mediummapD.w * .25) / 2) + "px").style("width", mediummapD.w * .75 + "px")

  if (!small_screen) {
    d3.select("#chart-overtext1").style("left", margin.left + 100 + "px")
  }

  // SLIDER
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
  drawChart1(matrix, titles);
  drawChart2(places);
} // end processData

function drawMaps(world, us, canada) {
  for (var i = 0; i < mapCount; i++) {
    var svg = d3.select("#map" + i);
    var g = svg.append("g")
      .style("transform", "translate(" + mapD.m + "," + mapD.m + ")")

    var defs = svg.append("defs");

    var filter = defs.append("filter")
      .attr("id", "glow")
      .attr("filterUnits", "userSpaceOnUse");
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
      // .style("stroke", "#000")
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

function drawMap0(titles, placeData) {

  var svg = d3.select("#map0");
  var gCircle = svg.append("g").attr("transform", "translate(" + mapD.m + "," + mapD.m + ")"),
    gTrophy = svg.append("g").attr("transform", "translate(" + mapD.m + "," + mapD.m + ")");
  svg.append("g")
    .attr("class", "map0annotation-group");
  var gTT = svg.append("g").attr("transform", "translate(" + mapD.m + "," + mapD.m + ")");

  var firstpause = false;
  var includeThis = ["american_football-men", "baseball", "canadian_football", "ice_hockey", "american_football", "basketball-men", "basketball", "baseball-men", "volleyball-women", "basketball-women", "soccer-women", "soccer"]

  $(".m0option").click(function() {
    $(".m0option").removeClass("m0optionActive")
    $(this).addClass("m0optionActive")
    key = $(this).attr("key")
    if (key === "everything") includeThis = ["american_football-men", "baseball", "canadian_football", "ice_hockey", "american_football", "basketball-men", "basketball", "baseball-men", "volleyball-women", "basketball-women", "soccer-women", "soccer"]
    if (key === "pro") includeThis = ["baseball", "canadian_football", "ice_hockey", "american_football", "basketball", "soccer"]
    if (key === "ncaa") includeThis = ["american_football-men", "basketball-men", "baseball-men", "volleyball-women", "basketball-women", "soccer-women"]
    d3.selectAll(".m0subfilter").remove();
    if (key === "everything") {
      d3.selectAll(".map0Annotation2018").transition().duration(200).style("opacity", 1)
    } else if (key === "pro") {
      drawM0Subfilter(key)
      d3.selectAll(".map0Annotation2018").transition().duration(200).style("opacity", 0)
    } else if (key === "ncaa") {
      drawM0Subfilter(key)
      d3.selectAll(".map0Annotation2018").transition().duration(200).style("opacity", 0)
    }
    update(parseYear(2018), includeThis, true)
  })

  function drawM0Subfilter(key) {
    if (key === "everything") var subs = []
    if (key === "pro") var subs = ["MLB", "NBA", "NFL", "NHL", "CFL", "MLS"]
    if (key == "ncaa") var subs = ["Baseball (M)", "Basketball (M)", "Basketball (W)", "Football (M)", "Soccer (W)", "Volleyball (W)"]

    var m0subfilters = {
        pro: ["MLB", "NBA", "NFL", "NHL", "CFL", "MLS"],
        ncaa: ["Baseball (M)", "Basketball (M)", "Basketball (W)", "Football (M)", "Soccer (W)", "Volleyball (W)"]
      },
      m0keys = {
        pro: ["baseball", "basketball", "american_football", "ice_hockey", "canadian_football", "soccer"],
        ncaa: ["baseball-men", "basketball-men", "basketball-women", "american_football-men", "soccer-women", "volleyball-women"]
      }

    var subfilter = d3.selectAll(".m0filter").append("div").attr("class", "m0subfilter");
    subfilter.append("span").attr("class", "m0subOption m0subOptionActive").attr("key", key).text("All")

    for (var n = 0; n < m0subfilters[key].length; n++) {
      subfilter.append("span").attr("class", "m0subOption").attr("key", m0keys[key][n]).text(m0subfilters[key][n])
    }

    $(".m0subOption").click(function() {
      $(".m0subOption").removeClass("m0subOptionActive")
      $(this).addClass("m0subOptionActive")
      var filterBy = $(this).attr("key")
      if (filterBy === "pro") {
        includeThis = ["baseball", "canadian_football", "ice_hockey", "american_football", "basketball", "soccer"]
      } else if (filterBy === "ncaa") {
        includeThis = ["american_football-men", "basketball-men", "baseball-men", "volleyball-women", "basketball-women", "soccer-women"]
      } else {
        includeThis = [filterBy]
      }
      update(x.invert(currentValue), includeThis, true)
    })

  }

  svg.on("click", function() {
    $("#play-button").click();
  })

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
        update(x.invert(currentValue), includeThis, false);
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
      // } else if (e.which == "27") {
      //   clearSearched()
    }
  }

  function step() {
    update(x.invert(currentValue), includeThis, false);
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
    update(x.invert(currentValue), includeThis, false);
    if (currentValue > targetValue) {
      moving = false;
      currentValue = 0;
      clearInterval(timer);
      // timer = 0;
      playButton.text("Play");
    }
  } // end step

  function drawPlot(data, placeData, filtered) {
    if (filtered) d3.selectAll(".city").remove();

    var winnerNth = []

    data.forEach(function(d) {
      winnerNth.push(d.t1loc)
      d.newNth = countThis(winnerNth, d.t1loc)
    })

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
        return opacityScale(d.newNth)
      })
      .attr("r", 0)
      .transition().duration(400)
      .attr("r", function(d) {
        return d.newNth
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

    var scrollLabels = {
      cities: ["Princeton, NJ", "Boston, MA", "Toronto, ON", "Berkeley, CA", "Eugene, OR", "Green Bay, WI", "New York, NY", "Los Angeles, CA"],
      coords: [
        [-74.6672226, 40.3572976],
        [-71.0588801, 42.3600825],
        [-79.3831843, 43.653226],
        [-122.272747, 37.8715926],
        [-123.0867536, 44.0520691],
        [-88.0132958, 44.5133188],
        [-74.0059728, 40.7127753],
        [-118.2436849, 34.0522342]
      ]
    }

    for (var i = 0; i < scrollLabels.cities.length; i++) {
      svg.append("text")
        .attr("class", "cityAnnoBG scrollLabel scrollLabel" + i)
        .attr("x", projection(scrollLabels.coords[i])[0] + 8)
        .attr("y", projection(scrollLabels.coords[i])[1] + 8)
        .attr("text-anchor", "middle")
        .attr("dy", function() {
          return 20
        })
        .style("opacity", 0)
        .text(scrollLabels.cities[i])

      svg.append("text")
        .attr("class", "mainAnno scrollLabel scrollLabel" + i)
        .attr("x", projection(scrollLabels.coords[i])[0] + 8)
        .attr("y", projection(scrollLabels.coords[i])[1] + 8)
        .attr("text-anchor", "middle")
        .attr("dy", function() {
          return 20
        })
        .style("opacity", 0)
        .text(scrollLabels.cities[i])
    }

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

  function update(h, included, filtered) {
    handle.attr("cx", x(h));
    handleStroke.attr("cx", x(h))
    d3.select("#sliderYear").html(formatDateIntoYear(h))

    if (d3.select("#sliderYear").html() == "2018") {
      $("#play-button").removeClass("paused").removeClass("played").addClass("ended")
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
      return d.year <= formatDateIntoYear(h) && included.indexOf(d.sport) > -1
    })

    // var filterednewData = newData.filter(function(d) {
    //   return included.indexOf(d.sport) > -1
    // })
    if (!filtered) {
      drawPlot(newData, placeData, false);
    } else {
      drawPlot(newData, placeData, true);
    }
  } //end update

  var scrollIndex = [1870, 1875, 1903, 1918, 1921, 1939, 1967, 1985, 2002, 2018];

  // SCROLLAMA
  // setupStickyfill();
  // 2. setup the scroller passing options
  // this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller.setup({
      container: '#scroll',
      graphic: '.scroll__graphic',
      text: '.scroll__text',
      step: '.scroll__text .step',
      debug: false,
    })
    .onStepEnter(handleStepEnter)
    .onContainerEnter(handleContainerEnter)
    .onContainerExit(handleContainerExit);



  // scrollama event handlers
  function handleStepEnter(response) {
    // $("#play-button").click();
    var year = scrollIndex[response.index]
    // if (response.direction === "down") var year = scrollIndex[response.index]
    // if (response.direction === "up") var year = scrollIndex[response.index - 1]

    update(parseYear(year), includeThis, false)
    d3.selectAll(".scrollLabel").style("opacity", 0)
    d3.selectAll(".scrollLabel" + (response.index - 1).toString()).style("opacity", 1)
  }

  function handleContainerEnter(response) {
    // response = { direction }
  }

  function handleContainerExit(response) {
    // response = { direction }
  }

  function setupStickyfill() {
    d3.selectAll('.sticky').each(function() {
      Stickyfill.add(this);
    });
  }

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
        title: "1. Los Angeles",
        label: "25 PRO/39 NCAA",
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
  d3.selectAll(".map-footer").style("width", "275px").style("min-width", "275px")

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

  var map0t5 = {
    cities: ["1. Los Angeles, CA", "2. New York, NY", "3. Toronto, ON", "4. Boston, MA", "5. Montreal, QC"],
    counts: [64, 55, 40, 37, 36],
    coords: [
      [-118.2436849, 34.0522342],
      [-74.0059728, 40.7127753],
      [-79.3831843, 43.653226],
      [-71.0588801, 42.3600825],
      [-73.567256, 45.5016889]
    ]
  }

  for (var i = 0; i < map0t5.cities.length; i++) {
    svg.append("text")
      .attr("class", "cityAnnoBG")
      .attr("x", projection(map0t5.coords[i])[0] + 8)
      .attr("y", projection(map0t5.coords[i])[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", function() {
        return (map0t5.counts[i] / 3) * 2
      })
      .text(map0t5.cities[i] + " (" + map0t5.counts[i] + ")")

    svg.append("text")
      .attr("class", "mainAnno")
      .attr("x", projection(map0t5.coords[i])[0] + 8)
      .attr("y", projection(map0t5.coords[i])[1] + 8)
      .attr("text-anchor", "middle")
      .attr("dy", function() {
        return (map0t5.counts[i] / 3) * 2
      })
      .text(map0t5.cities[i] + " (" + map0t5.counts[i] + ")")
  }





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
      ranks: [54, 37, 25, 29],
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

function drawChart1(matrix, titleData) {

  var startDate = new Date(1870, 0, 1),
    endDate = new Date(2018, 11, 31),
    clicked = false;

  var svg = d3.select("#chart1");
  var g = svg.append("g").attr("transform", "translate(" + c1m.left + "," + c1m.top + ")");

  svg.on("mouseover", function() {
    d3.selectAll(".c1labels").transition().duration(200).style("opacity", 0)
  }).on("mouseout", function() {
    d3.selectAll(".c1labels").transition().duration(200).style("opacity", 1)
  }).on("click", function() {
    clearSearched();
  })

  var cities = matrix.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: matrix.filter(function(k) {
        return !isNaN(+k[id]);
      }).map(function(d) {
        return {
          date: parseYear(d.date),
          wins: +(d[id]),
          city: id
        };
      })
    };
  });

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
        term = $("#c1search").val()
        c1searched(term)
      },
      onKeyEnterEvent: function() {
        term = $("#c1search").val()
        c1searched(term)
      }
    }
  };

  var options2 = {
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
        term = $("#c1search2").val()
        c1searched(term)
      },
      onKeyEnterEvent: function() {
        term = $("#c1search2").val()
        c1searched(term)
      }
    }
  };

  $("#c1search").easyAutocomplete(options);
  $("#c1search2").easyAutocomplete(options2);
  d3.select("#c1LA").on("mouseover", function() {
      c1mover("losAngelesCA")
    }).on("mouseout", function() {
      if (!clicked) {
        c1mout()
      }
    })
    .on("click", function() {
      c1searched("losAngelesCA")
      clicked = true;
      $("#c1search2").val("Los Angeles, CA")
      $("#c1search").val("Los Angeles, CA")
    })
  d3.select("#c1Philly").on("mouseover", function() {
      c1mover("philadelphiaPA")
    }).on("mouseout", function() {
      if (!clicked) {
        c1mout()
      }
    })
    .on("click", function() {
      c1searched("philadelphiaPA")
      clicked = true;
      $("#c1search2").val("Philadelphia, PA")
      $("#c1search").val("Philadelphia, PA")
    })
  d3.select("#c1BatonRouge").on("mouseover", function() {
      c1mover("batonRougeLA")
    }).on("mouseout", function() {
      if (!clicked) {
        c1mout()
      }
    })
    .on("click", function() {
      c1searched("batonRougeLA")
      clicked = true;
      $("#c1search2").val("Baton-Rouge, LA")
      $("#c1search").val("Baton-Rouge, LA")
    })
  d3.select("#c1NewHaven").on("mouseover", function() {
      c1mover("newHavenCT")
    }).on("mouseout", function() {
      if (!clicked) {
        c1mout()
      }
    })
    .on("click", function() {
      c1searched("newHavenCT")
      clicked = true;
      $("#c1search2").val("New Haven, CT")
      $("#c1search").val("New Haven, CT")
    })
  d3.select("#c1CollegeStation").on("mouseover", function() {
      c1mover("collegeStationTX")
    }).on("mouseout", function() {
      if (!clicked) {
        c1mout()
      }
    })
    .on("click", function() {
      c1searched("collegeStationTX")
      clicked = true;
      $("#c1search2").val("College Station, CT")
      $("#c1search").val("College Station, CT")
    })

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

  var voronoi = d3.voronoi()
    .x(function(d) {
      return xscale(d.date);
    })
    .y(function(d) {
      return yscale(d.wins);
    })
    .extent([
      [-c1m.left, -c1m.top],
      [c1D.w + c1m.right, c1D.h + c1m.bottom]
    ]);

  var xAxis = d3.axisBottom(xscale)
    .tickSize(0)
    .tickFormat(function(d) {
      return formatDateIntoYear(d)
    })
    .tickValues([parseYear(1870), parseYear(1900), parseYear(1930), parseYear(1960), parseYear(1990), parseYear(2018)])

  var yAxis = d3.axisLeft(yscale)
    .tickSize(-c1D.w)
    .tickFormat(function(d) {
      if (d === 60) return d + " titles"
      return d
    })
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

  var focus = g.append("g")
    .attr("transform", "translate(-100,-100)")
    .attr("class", "focus");

  focus.append("circle")
    .attr("r", 3.5)
    .style("fill", "#fff");

  focus.append("text")
    .attr("class", "focustextBG")
    .attr("y", 25);

  focus.append("text")
    .attr("class", "focustext")
    .attr("y", 25);


  var c1labelArray = {
    cities: ["Los Angeles, CA", "New York, NY", "Toronto, ON", "Boston, MA", "Montreal, QC"],
    coords: [
      [2014, 64],
      [2012, 55],
      [2017, 40],
      [2017, 37],
      [2006, 34]
    ]
  }

  for (var l = 0; l < 5; l++) {
    g.append("circle")
      .attr("class", "c1labels")
      .attr("r", 2)
      .attr("cx", xscale(parseYear(c1labelArray.coords[l][0])))
      .attr("cy", yscale(c1labelArray.coords[l][1]))
      .style("fill", "#fff")
      .style("opacity", .75)

    g.append("text")
      .attr("class", "c1labels")
      .attr("x", xscale(parseYear(c1labelArray.coords[l][0])))
      .attr("y", yscale(c1labelArray.coords[l][1]))
      .attr("dx", -10)
      .attr("dy", 5)
      .text(c1labelArray.cities[l])
  }


  // voroni! https://bl.ocks.org/mbostock/8033015
  var voronoiGroup = g.append("g")
    .attr("class", "voronoi");

  voronoiGroup.selectAll("path")
    .data(voronoi.polygons(d3.merge(cities.map(function(d) {
      return d.values;
    }))))
    .enter().append("path")
    .attr("class", function(d) {
      if (d != undefined) return "vor-" + camelize(d.data.city);
    })
    .attr("d", function(d) {
      return d ? "M" + d.join("L") + "Z" : null;
    })
    .on("mouseover", mouseover)
    .on("click", mouseover)
    .on("mouseout", mouseout);

  function c1mover(term) {
    d3.selectAll(".c1labels").transition().duration(200).style("opacity", 0)
    var thisline = d3.select("#chart1-" + camelize(term));
    if (large_screen) {
      d3.selectAll(".cityline").transition().duration(200).style("stroke-width", 1).style("opacity", .2).style("stroke", "#555")
      thisline.transition().duration(200).style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
      thisline.moveToFront();
    } else {
      d3.selectAll(".cityline").style("stroke-width", 1).style("opacity", .2).style("stroke", "#555")
      thisline.style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
      thisline.moveToBack();
    }
  }

  function c1mout() {
    d3.selectAll(".c1labels").transition().duration(200).style("opacity", 1)
    if (large_screen) {
      d3.selectAll(".cityline").transition().duration(200).style("stroke-width", 1).style("opacity", .5).style("stroke", "#555")
      d3.selectAll("#chart1-losAngelesCA, #chart1-newYorkNY, #chart1-torontoON, #chart1-bostonMA, #chart1-montrealQC").transition().duration(200).style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
    } else {
      d3.selectAll(".cityline").style("stroke-width", 1).style("opacity", .5).style("stroke", "#555")
      d3.selectAll("#chart1-losAngelesCA, #chart1-newYorkNY, #chart1-torontoON, #chart1-bostonMA, #chart1-montrealQC").style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
    }
  }

  function c1searched(term) {
    d3.select(".c1close").style("opacity", 1)
    d3.selectAll(".c1labels").transition().duration(200).style("opacity", 0)
    var thisline = d3.select("#chart1-" + camelize(term));
    if (large_screen) {
      d3.selectAll(".cityline").transition().duration(200).style("stroke-width", 1).style("opacity", .2).style("stroke", "#555")
      thisline.transition().duration(200).style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
      thisline.moveToFront();
    } else {
      d3.selectAll(".cityline").style("stroke-width", 1).style("opacity", .2).style("stroke", "#555")
      thisline.style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
      thisline.moveToBack();
    }
    svg.on("mouseover", function() {})
      .on("mouseout", function() {})
    voronoiGroup.selectAll("path")
      .on("mouseover", function() {})
      .on("mouseout", function() {});
    d3.selectAll(".vor-" + camelize(term))
      .on("mouseover", mouseover);

    d3.selectAll(".c1searchsubmitIcon").html('<i id="c1searchsubmit" class="fas fa-times"></i>').on("click", clearSearched)
  }

  function clearSearched() {
    clicked = false;
    d3.select(".c1close").style("opacity", 0)
    $("#c1search").val("")
    if (large_screen) {
      d3.selectAll(".cityline").transition().duration(200).style("stroke-width", 1).style("opacity", .5).style("stroke", "#555")
      d3.selectAll("#chart1-losAngelesCA, #chart1-newYorkNY, #chart1-torontoON, #chart1-bostonMA, #chart1-montrealQC").transition().duration(200).style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
      focus.attr("transform", "translate(-100,-100)");
    } else {
      d3.selectAll(".cityline").style("stroke-width", 1).style("opacity", .5).style("stroke", "#555")
      d3.selectAll("#chart1-losAngelesCA, #chart1-newYorkNY, #chart1-torontoON, #chart1-bostonMA, #chart1-montrealQC").style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
      focus.attr("transform", "translate(-100,-100)");
    }
    svg.on("mouseover", function() {
      d3.selectAll(".c1labels").transition().duration(200).style("opacity", 0)
    }).on("mouseout", function() {
      d3.selectAll(".c1labels").transition().duration(200).style("opacity", 1)
    })
    voronoiGroup.selectAll("path")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

    d3.select(".c1searchsubmitIcon").html('<i id="c1searchsubmit" class="fas fa-search"></i>').on("click", function() {})
  }

  function mouseover(d) {
    if (large_screen) {
      d3.selectAll(".cityline").transition().duration(200).style("stroke-width", 1).style("opacity", .5).style("stroke", "#555")
      var thisline = d3.select("#chart1-" + camelize(d.data.city));
      thisline.transition().duration(200).style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
    } else {
      d3.selectAll(".cityline").style("stroke-width", 1).style("opacity", .5).style("stroke", "#555")
      var thisline = d3.select("#chart1-" + camelize(d.data.city));
      thisline.style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
    }

    var moData = titleData.filter(function(titleData) {
      return camelize(titleData.t1cityState) === camelize(d.data.city) && titleData.year === formatDateIntoYear(d.data.date);
    })

    var winners = [],
      winnerleagues = [];

    moData.forEach(function(moData) {
      winners.push(moData.t1)
      winnerleagues.push(moData.leagueLevel)
    })

    var textanchor = "start";
    if (d3.mouse(this)[0] <= c1D.w / 10) textanchor = "start";
    if (d3.mouse(this)[0] > c1D.w / 10 && d3.mouse(this)[0] < c1D.w * .9) textanchor = "middle";
    if (d3.mouse(this)[0] >= c1D.w * .9) textanchor = "end";

    focus.attr("transform", "translate(" + xscale(d.data.date) + "," + yscale(d.data.wins) + ")");
    if (winnerleagues.length > 0) {
      focus.select("circle").style("fill", cLeagues[winnerleagues[0].toLowerCase()])
    } else {
      focus.select("circle").style("fill", "#fff")
    }
    focus.select(".focustext").text(d.data.city + " - " + formatDateIntoYear(d.data.date) + " (" + d.data.wins + ")").style("text-anchor", textanchor);
    focus.select(".focustextBG").text(d.data.city + " - " + formatDateIntoYear(d.data.date) + " (" + d.data.wins + ")").style("text-anchor", textanchor).style("fill", "none").style("stroke", "#333").style("stroke-width", 6);

    d3.selectAll(".subFocus").remove();

    for (var i = 0; i < winners.length; i++) {
      focus.append("text")
        .attr("class", "subFocus")
        .attr("dy", i * 15 + 40)
        .text(winners[i])
        .style("text-anchor", textanchor)
        .style("stroke", "#333")
        .style("stroke-width", 6)
      focus.append("text")
        .attr("class", "subFocus")
        .attr("dy", i * 15 + 40)
        .text(winners[i])
        .style("fill", cLeagues[winnerleagues[i].toLowerCase()])
        .style("text-anchor", textanchor)
    }
  }

  function mouseout(d) {
    if (large_screen) {
      d3.selectAll(".cityline").transition().duration(200).style("stroke-width", 1).style("opacity", .5).style("stroke", "#555")
      d3.selectAll("#chart1-losAngelesCA, #chart1-newYorkNY, #chart1-torontoON, #chart1-bostonMA, #chart1-montrealQC").transition().duration(200).style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
      focus.attr("transform", "translate(-100,-100)");
    } else {
      d3.selectAll(".cityline").style("stroke-width", 1).style("opacity", .5).style("stroke", "#555")
      d3.selectAll("#chart1-losAngelesCA, #chart1-newYorkNY, #chart1-torontoON, #chart1-bostonMA, #chart1-montrealQC").style("stroke", "#fff").style("stroke-width", 2).style("opacity", .75);
      focus.attr("transform", "translate(-100,-100)");
    }
  }
} // end drawChart1

function drawChart2(placeData) {

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
        term = $("#search-bar").val()
        addLast(term, key, metrics[key], placeData, false);
      },
      onKeyEnterEvent: function() {
        term = $("#search-bar").val()
        addLast(term, key, metrics[key], placeData, false);
      }
    }
  };

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

  chart2(key, metrics[key], placeData);
  addLast(term, key, metrics[key], placeData, true);

  $(".c2option").click(function() {
    $(".c2option").removeClass("c2optionActive")
    $(this).addClass("c2optionActive")
    key = $(this).attr("key")
    if (key === "count") $("#chart2headertext").text("Sports")
    if (key === "pro") $("#chart2headertext").text("Pro Sports")
    if (key === "ncaa") $("#chart2headertext").text("College Sports")
    d3.selectAll(".c2remove").remove();
    d3.selectAll(".c2subfilter").remove();
    drawSubfilter(key, metrics[key], placeData)
    chart2(key, metrics[key], placeData);
    addLast(term, key, metrics[key], placeData, true);
  })

  function drawSubfilter(key, metrics, placeData) {
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
        chart2(key, newMetric, placeData);
        addLast(term, key, newMetric, placeData, false);
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
        if (key === "ncaa-baseball-m") $("#chart2headertext").html("Men&rsquo;s College Baseball")
        if (key === "ncaa-basketball-m") $("#chart2headertext").html("Men&rsquo;s College Basketball")
        if (key === "ncaa-basketball-w") $("#chart2headertext").html("Women&rsquo;s College Basketball")
        if (key === "ncaa-football-m") $("#chart2headertext").html("Men&rsquo;s College Football")
        if (key === "ncaa-soccer-w") $("#chart2headertext").html("Women&rsquo;s College Soccer")
        if (key === "ncaa-volleyball-w") $("#chart2headertext").html("Women&rsquo;s College Volleyball")
        d3.selectAll(".c2remove").remove();
        if (key != "ncaa") var newMetric = [key]
        if (key === "ncaa") var newMetric = metrics;
        chart2(key, newMetric, placeData);
        addLast(term, key, newMetric, placeData, false);
      })
    }

  }

  function chart2(key, metrics, placeData) {
    var data;

    data = placeData.sort(function(a, b) {
      return d3.descending(+a[key], +b[key]);
    }).slice(0, 10);

    updateRight(0)

    function updateRight(n) {
      $("#c2city").text(data[n].city + ", " + data[n].stateAbb)
      $("#c2numTitles").text(data[n].count)
      $("#c2numTeams").text(parseCoord(data[n].teams).length)
      d3.selectAll(".c2winListRow").remove();

      for (var i = 0; i < parseCoord(data[n].teams).length; i++) {
        var c2winListRow = d3.select("#c2winList").append("div").attr("class", "c2winListRow").text(parseCoord(data[n].teams)[i])
        if (c2winListRow.text().includes("MLB")) c2winListRow.style("color", cLeagues.mlb)
        if (c2winListRow.text().includes("NBA")) c2winListRow.style("color", cLeagues.nba)
        if (c2winListRow.text().includes("NFL")) c2winListRow.style("color", cLeagues.nfl)
        if (c2winListRow.text().includes("NHL")) c2winListRow.style("color", cLeagues.nhl)
        if (c2winListRow.text().includes("MLS")) c2winListRow.style("color", cLeagues.mls)
        if (c2winListRow.text().includes("CFL")) c2winListRow.style("color", cLeagues.cfl)
        if (c2winListRow.text().includes("NCAA")) c2winListRow.style("color", cLeagues.ncaa)
      }
    }

    var max = d3.max(data, function(d) {
      return +d[key]; //<-- convert to number
    })

    c2x = d3.scaleLinear().domain([0, 64])

    for (var i = 0; i < data.length; i++) {

      var row = d3.select(".chart2left").append("div").attr("class", "c2remove chart2row chart2rowMain").attr("id", "row" + i);

      row.on("mouseover", function() {
        d3.selectAll(".chart2rowMain").style("background-color", "#333")
        d3.select(this).style("background-color", "#444")
        updateRight(d3.select(this).attr("id").replace("row", ""))
      })

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
              .style("stroke-linejoin", "round")
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

  function addLast(term, key, metrics, placeData, first) {

    d3.selectAll(".lastRemove").remove()

    var lastData = placeData.filter(function(placeData) {
      return camelize(placeData.city + ", " + placeData.stateAbb) === camelize(term);
    })

    if (!first) {

      $("#c2city").text(lastData[0].city + ", " + lastData[0].stateAbb)
      $("#c2numTitles").text(lastData[0].count)
      d3.selectAll(".c2winListRow").remove();

      if (parseCoord(lastData[0].teams) != undefined) {
        $("#c2numTeams").text(parseCoord(lastData[0].teams).length)
        for (var i = 0; i < parseCoord(lastData[0].teams).length; i++) {
          var c2winListRow = d3.select("#c2winList").append("div").attr("class", "c2winListRow").text(parseCoord(lastData[0].teams)[i])
          if (c2winListRow.text().includes("MLB")) c2winListRow.style("color", cLeagues.mlb)
          if (c2winListRow.text().includes("NBA")) c2winListRow.style("color", cLeagues.nba)
          if (c2winListRow.text().includes("NFL")) c2winListRow.style("color", cLeagues.nfl)
          if (c2winListRow.text().includes("NHL")) c2winListRow.style("color", cLeagues.nhl)
          if (c2winListRow.text().includes("MLS")) c2winListRow.style("color", cLeagues.mls)
          if (c2winListRow.text().includes("CFL")) c2winListRow.style("color", cLeagues.cfl)
          if (c2winListRow.text().includes("NCAA")) c2winListRow.style("color", cLeagues.ncaa)
        }
      }
    }

    var row = d3.select(".chart2left").append("div").attr("class", "lastRemove chart2row c2remove chart2lastrow");
    row.append("div").attr("class", "lastRemove c2remove chart2rank").html('<i id="searchsubmit" class="fas fa-search"></i>')
    row.append("div").attr("class", "lastRemove c2remove chart2city").html('<input type="text" id="search-bar" class="search-bar" placeholder="' + lastData[0].city + ", " + lastData[0].stateAbb + '" />')
    var lastsvg = row.append("svg").attr("class", "lastRemove c2remove chart2svg").attr("height", h).attr("width", w);

    $("#search-bar").easyAutocomplete(options);

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
            .style("stroke", "#444")
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

// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function() {
  return this.each(function() {
    var firstChild = this.parentNode.firstChild;
    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
};