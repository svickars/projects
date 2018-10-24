// MISSION WORLDWIDE
var small_screen, medium_screen, large_screen, windowW, windowH, leader = 0;
var local_coords = [],
  searchArray = [],
  sortmode = "descend_basic",
  sortmode2 = "descend_seasons",
  sortmode3 = "descend_basic",
  local, userlocal, searched, level, league, start, end;
var sideD, c1x, c1y, c1tip, c2x, c2y, c3x, c3y, c3r, c3c, num = 10,
  case2num = 10,
  case3num = 11,
  radius = d3.scaleLinear().domain([0, 148]).range([3, 2]),
  casetwodrawn = false,
  casethreestatus = "blank";

var c1rectO = 1,
  c1expO = 0,
  c1expO = 0;

var lowerSlider = document.querySelector('#lower-left'),
  upperSlider = document.querySelector('#upper-left'),
  start = parseInt(lowerSlider.value),
  end = parseInt(upperSlider.value),
  disp1 = 0,
  disp2 = 0;

var filters = {
  "all-levels": {
    "all-leagues": ["mlb", "nba", "nfl", "nhl", "mls", "cfl", "baseball_m", "basketball_m", "basketball_w", "football_m", "soccer_w", "volleyball_w"],
    "all-sports": ["mlb", "nba", "nfl", "nhl", "mls", "cfl", "baseball_m", "basketball_m", "basketball_w", "football_m", "soccer_w", "volleyball_w"]
  },
  "pro": {
    "all-leagues": ["mlb", "nba", "nfl", "nhl", "mls", "cfl"],
    "big4": ["mlb", "nba", "nfl", "nhl"],
    "mlb": ["mlb"],
    "nba": ["nba"],
    "nfl": ["nfl"],
    "nhl": ["nhl"],
    "mls": ["mls"],
    "cfl": ["cfl"],
  },
  "college": {
    "all-sports": ["baseball_m", "basketball_m", "basketball_w", "football_m", "soccer_w", "volleyball_w"],
    "baseball_m": ["baseball_m"],
    "basketball_m": ["basketball_m"],
    "basketball_w": ["basketball_w"],
    "football_m": ["football_m"],
    "soccer_w": ["soccer_w"],
    "volleyball_w": ["volleyball_w"]
  }
}

var league_colours = d3.scaleOrdinal()
  .range(["#beaed4", "#7fc97f", "#fdc086", "#ccba15", "#f0027f", "#bf5b17", "#386cb0", "#386cb0", "#386cb0", "#386cb0", "#386cb0", "#386cb0", "#386cb0"]).domain(["mlb", "cfl", "mls", "nba", "nfl", "nhl", "ncaa", "baseball_m", "basketball_m", "basketball_w", "football_m", "soccer_w", "volleyball_w"]),
  event_colours = d3.scaleOrdinal().range(["#f9ed35", "#a17bff", "#fc545d"]).domain(["title", "finals", "finalFour"])

var leagues = ["MLB", "NBA", "NFL", "NHL", "CFL", "MLS", "NCAA"],
  events = [{
    "event": "title",
    "colour": event_colours("title")
  }, {
    "event": "finals appearance",
    "colour": event_colours("finals")
  }, {
    "event": "final four appearance",
    "colour": event_colours("finalFour")
  }]

// DATA
// const case1 = [];
var case1data = [],
  case2data = [],
  case3data = [];

function resize() {
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

  if (!small_screen) {
    num = 20;
    case2num = 20;
    case3num = 21;
  }

  if (windowH < 900 && windowH >= 700) {
    num = 15;
    case2num = 15;
    case3num = 16;
  }

  sideD = {
    w: $(".side > figure").width() - 5 - 0,
    h: $(".side > figure").height() - 12 - 30,
    top: 12,
    right: 5,
    bottom: 30,
    left: 10
  }

  caseone_filter()
  casetwo_filter()
  casethree_filter()
} //end resize

function loadData() {
  queue()
    .defer(d3.csv, "data/metros.csv")
    .defer(d3.json, "data/case1_v2.json")
    .defer(d3.json, "data/case2.json")
    .await(processData)
  // .await(caseone())
} // end loadData

function processData(error, metros, titleData, seasonData) {
  Array.prototype.push.apply(case1data, titleData);
  Array.prototype.push.apply(case2data, seasonData);
  Array.prototype.push.apply(case3data, titleData);
  getLocal(metros);
  caseone();
  // casetwo();
  casethree();
} // end processData

function init() {
  ipLookup()
  window.addEventListener("resize", resize);
  setup()
  loadData();
  // caseone();
} // end init

init()

function setup() {

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

  if (!small_screen) {
    num = 20;
    case2num = 20;
    case3num = 21;
  }

  if (windowH < 900 && windowH >= 700) {
    num = 15;
    case2num = 15;
    case3num = 16;
  }

  sideD = {
    w: $(".side > figure").width() - 5 - 0,
    h: $(".side > figure").height() - 12 - 30,
    top: 12,
    right: 5,
    bottom: 30,
    left: 10
  }

  level = $("#filter-level :selected").data("value");
  league = $("#filter-league :selected").data("value");
  start = parseInt(lowerSlider.value);
  end = parseInt(upperSlider.value);

  // Global filter
  $(".f-header").on("click", function() {
    $(".filter-container").toggleClass("isvisible");
  })
  $(".step_blank").on("click", function() {
    $(".filter-container").toggleClass("isvisible");
  })
  $("#filter-level").change(function() {
    level = $("#filter-level :selected").data("value");
    if (level === "pro") {
      league = $("#filter-league :selected").data("value");
      d3.select("#filter-sport").style("display", "none");
      d3.select("#filter-league").style("display", "inline-block");
      d3.select("#filter-league-change").style("display", "block").html("League");
    } else if (level === "college") {
      league = $("#filter-sport :selected").data("value");
      d3.select("#filter-league").style("display", "none");
      d3.select("#filter-sport").style("display", "inline-block");
      d3.select("#filter-league-change").style("display", "block").html("Sport");
    } else {
      league = "all-leagues";
      d3.selectAll("#filter-sport, #filter-league, #filter-league-change").style("display", "none");
    };
    caseone_filter();
    if (casetwodrawn) casetwo_filter();
    casethree_filter()
  });
  $("#filter-league").change(function() {
    league = $("#filter-league :selected").data("value");
    caseone_filter();
    if (casetwodrawn) casetwo_filter();
    casethree_filter()
  });
  $("#filter-sport").change(function() {
    league = $("#filter-sport :selected").data("value");
    caseone_filter();
    if (casetwodrawn) casetwo_filter();
    casethree_filter()
  });

  var w = 213,
    h = $(".filter-year").height();

  $(".yearinput-left").width(w);

  var yearrange = d3.select(".yearrange-left").attr("width", w).attr("height", h);
  var yearrangeX = d3.scaleLinear().domain([1870, 2018]).range([3, w]);
  var yearrangefill = yearrange.append("line")
    .attr("class", "yearFilterHide")
    .attr("x1", yearrangeX(start))
    .attr("x2", yearrangeX(end))
    .attr("y1", -5)
    .attr("y2", -5);
  var yearrangestart = d3.select(".filter-year").append("div")
    .attr("class", "yearFilterHide yearFilter_label")
    .style("left", yearrangeX(start) + "px")
    .style("margin-right", 0)
    .html(start);
  var yearrangeend = d3.select(".filter-year").append("div")
    .attr("class", "yearFilterHide yearFilter_label")
    .style("left", yearrangeX(end) - 26 + "px")
    .style("margin-right", 0)
    .html(end);

  upperSlider.onchange = function() {
    caseone_filter();
    if (casetwodrawn) casetwo_filter();
    casethree_filter()
  };
  upperSlider.oninput = function() {
    start = parseInt(lowerSlider.value);
    end = parseInt(upperSlider.value);
    var l, r;

    l = yearrangeX(start) - 13;
    if (start < 1883) l = yearrangeX(start) - (start - 1870);
    if (start >= 1984 && end - start < 36) l = yearrangeX(end) - 26 - 30

    r = yearrangeX(end) - 13;
    if (end > 2006) r = yearrangeX(end) - 26 + (2018 - end);
    if (start <= 1883 && end - start < 30) r = yearrangeX(start) + 30;
    if (start >= 1877 && start < 1984 && end - start < 20) r = yearrangeX(start) + 17;

    if (end < start + 1) {
      lowerSlider.value = end - 1;
      if (start == lowerSlider.min) {
        upperSlider.value = 1871;
      };
    };

    yearrangefill.attr("x1", yearrangeX(start)).attr("x2", yearrangeX(end));
    yearrangestart.style("left", l + "px").html(start);
    yearrangeend.style("left", r + "px").html(end);
  }
  lowerSlider.onchange = function() {
    caseone_filter();
    if (casetwodrawn) casetwo_filter();
    casethree_filter()
  }
  lowerSlider.oninput = function() {
    start = parseInt(lowerSlider.value);
    end = parseInt(upperSlider.value);
    var l, r;

    l = yearrangeX(start) - 13;
    if (start < 1883) l = yearrangeX(start) - (start - 1870);
    if (start >= 1984 && end - start < 36) l = yearrangeX(end) - 26 - 30

    r = yearrangeX(end) - 13;
    if (end > 2006) r = yearrangeX(end) - 26 + (2018 - end);
    if (start <= 1883 && end - start < 30) r = yearrangeX(start) + 30;
    if (start >= 1877 && start < 1984 && end - start < 20) r = yearrangeX(start) + 17;


    if (start > end - 1) {
      upperSlider.value = start + 1;
      if (end == upperSlider.max) {
        lowerSlider.value = parseInt(upperSlider.max) - 1;
      };
    };

    yearrangefill.attr("x1", yearrangeX(start)).attr("x2", yearrangeX(end));
    yearrangestart.style("left", l + "px").html(start);
    yearrangeend.style("left", r + "px").html(end);
  };

  // Scrolly
  var container = d3.selectAll('body');
  var stepSel = container.selectAll('.step');

  enterView({
    selector: stepSel.nodes(),
    offset: 0.5,
    enter: function(el) {
      var index = +d3.select(el).attr("data-index");
      stepSel.classed("active", (d, i) => i === index);
      if (index < 5) caseone_update(index, index - 1)
      if (index > 4 && index < 11) casetwo_update(index, index - 1)
      if (index > 10) casethree_update(index, index - 1)
    },
    exit: function(el) {
      var index = +d3.select(el).attr("data-index");
      stepSel.classed("active", (d, i) => i === index);
      if (index < 5) caseone_update(index, index + 1)
      if (index > 4 && index < 11) casetwo_update(index, index + 1)
      if (index > 10) casethree_update(index, index + 1)
    }
  });

  // Search
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
        searched = $("#citysearch-left").val()
        caseone_filter();
        if (casetwodrawn) casetwo_filter();
        casethree_filter();
      },
      onKeyEnterEvent: function() {
        searched = $("#citysearch-left").val()
        caseone_filter();
        if (casetwodrawn) casetwo_filter();
        casethree_filter();
      }
    }
  };
  $("#citysearch-left").easyAutocomplete(options);

  // Tooltips
  c1tip = d3.tip().attr("class", "d3-tip").html(function(d) {
    return "<div class='tipH'><h1>" + d.year + "</h1></div><div class='tipH' style='background-color: " + league_colours(d.sport) + "'><h3>" + replaceSports(d.sport) + "</h3></div><h2>" + d.team + "</h2>";
  }).direction("e").offset([25, 0]);

  c2tip = d3.tip().attr("class", "d3-tip dark-tip").html(function(d) {
    var list = d.newteams;
    var titlesDisp = "",
      finalsDisp = "",
      finalFoursDisp = "";

    var titles = [],
      finals = [],
      finalFours = [];

    for (var j = 0; j < d.newteams.length; j++) {
      if (d.newteams[j].result === "title") titles.push(d.newteams[j].team + " (" + replaceSports(d.newteams[j].sport) + ")&nbsp;")
      if (d.newteams[j].result === "finals") finals.push(d.newteams[j].team + " (" + replaceSports(d.newteams[j].sport) + ")&nbsp;")
      if (d.newteams[j].result === "finalFour") finalFours.push(d.newteams[j].team + " (" + replaceSports(d.newteams[j].sport) + ")&nbsp;")
    }

    if (titles.length > 0) titlesDisp = "<h2 style='color:" + event_colours("title") + "'>Titles</h2><p>" + titles + "</p>";
    if (finals.length > 0) finalsDisp = "<h2 style='color:" + event_colours("finals") + "'>Finals Appearances</h2><p>" + finals + "</p>";
    if (finalFours.length > 0) finalFoursDisp = "<h2 style='color:" + event_colours("finalFour") + "'>Final Four Appearances</h2><p>" + finalFours + "</p>";
    return "<h1>" + d.season + "</h1>" + titlesDisp + finalsDisp + finalFoursDisp;
  }).direction("s").offset([25, 0]);

  // Case One Switches
  $("#switch_actual").on("click", function() {
    $("#switch_actual").addClass("isactive")
    $("#switch_high_diff").removeClass("isactive")
    $("#switch_low_diff").removeClass("isactive")
    caseone_update(1)
  })
  $("#switch_high_diff").on("click", function() {
    $("#switch_actual").removeClass("isactive")
    $("#switch_high_diff").addClass("isactive")
    $("#switch_low_diff").removeClass("isactive")
    caseone_update(7)
  })
  $("#switch_low_diff").on("click", function() {
    $("#switch_actual").removeClass("isactive")
    $("#switch_high_diff").removeClass("isactive")
    $("#switch_low_diff").addClass("isactive")
    caseone_update(8)
  })
  $("#showMoreC1").on("click", function() {
    num += 10;
    $("#case2_scrolly").css("margin-top", ((num - 1) * 30) - 500 + "px")
    caseone_filter()
  })

  // Case Two Switches
  $("#switch_dynasty").on("click", function() {
    $("#switch_dynasty").addClass("isactive");
    $("#switch_finalfour").removeClass("isactive");
    $("#switch_dryspell-long").removeClass("isactive");
    $("#switch_dryspell-short").removeClass("isactive");
    sortmode2 = "descend_max_dynasty";
    casetwo_filter()
  })
  $("#switch_finalfour").on("click", function() {
    $("#switch_dynasty").removeClass("isactive");
    $("#switch_finalfour").addClass("isactive");
    $("#switch_dryspell-long").removeClass("isactive");
    $("#switch_dryspell-short").removeClass("isactive");
    sortmode2 = "descend_max_prettygooddynasty";
    casetwo_filter()
  })
  $("#switch_dryspell-long").on("click", function() {
    $("#switch_dynasty").removeClass("isactive");
    $("#switch_finalfour").removeClass("isactive");
    $("#switch_dryspell-long").addClass("isactive");
    $("#switch_dryspell-short").removeClass("isactive");
    sortmode2 = "descend_max_dryspell";
    casetwo_filter()
  })
  $("#switch_dryspell-short").on("click", function() {
    $("#switch_dynasty").removeClass("isactive");
    $("#switch_finalfour").removeClass("isactive");
    $("#switch_dryspell-long").removeClass("isactive");
    $("#switch_dryspell-short").addClass("isactive");
    sortmode2 = "ascend_max_dryspell";
    casetwo_filter()
  })
  $("#showMoreC2").on("click", function() {
    case2num += 10;
    // $("#case3_scrolly").css("margin-top", ((case2num - 1) * 30) - 500 + "px")
    var newheight = $("#case2_scrolly").height();
    newheight += (case2num - 1) * 30
    $("#case2_scrolly").css("height", newheight + "px")
    casetwo_filter()
  })

  // Case Three Switches
  $("#casethree_los-angeles").on("mouseover", function() {
    userlocal = local;
    local = "Greater Los Angeles, CA";
    casethree_filter();
  }).on("mouseout", function() {
    local = userlocal;
    casethree_filter();
  })
  $("#casethree_newyork").on("mouseover", function() {
    userlocal = local;
    local = "New York Metro Area";
    casethree_filter();
  }).on("mouseout", function() {
    local = userlocal;
    casethree_filter();
  })
  $("#casethree_boston").on("mouseover", function() {
    userlocal = local;
    local = "Greater Boston, MA";
    casethree_filter();
  }).on("mouseout", function() {
    local = userlocal;
    casethree_filter();
  })
  $("#casethree_bay-area").on("mouseover", function() {
    userlocal = local;
    local = "San Francisco Bay Area, CA";
    casethree_filter();
  }).on("mouseout", function() {
    local = userlocal;
    casethree_filter();
  })
}

function caseone() {
  // local = "New York Metro Area"
  var filter = filters[level][league],
    total_titles = 0,
    total_seasons = 0,
    h = 30,
    rank, adjRank;
  leader = 0;
  var data = case1data
  data.forEach(function(d) {
    var local_seasons = 0;
    d.values = d.values.sort(function(a, b) {
      return d3.ascending(+a.year, +b.year);
    });
    d.newvalues = d.values.filter(function(d) {
      return d.year >= start && d.year <= end && $.inArray(d.sport, filter) > -1;
    });
    d.newvalues.forEach(function(d, i) {
      d.n = i;
    });
    for (var i = 0; i < filter.length; i++) {
      local_seasons += d.seasons[filter[i]];
    };
    d.local_seasons = local_seasons;
    total_titles += d.newvalues.length;
    total_seasons += local_seasons;
  })
  data = data.sort(function(a, b) {
    return d3.descending(+a.newvalues.length, +b.newvalues.length) || d3.ascending(a.key, b.key);
  })
  if (local != undefined) {
    var mainData = data.slice(0, num - 1);
    var leadingcity = mainData[0].key;
    data = data.filter(function(d, i) {
      if (d.key === local) rank = i;
      adjRank = rank;
      if (rank > num - 2) {
        adjRank = num - 1;
        return d.key === local
      };
    })
    Array.prototype.push.apply(mainData, data)
  } else {
    var mainData = data.slice(0, num);
    var leadingcity = mainData[0].key;
  }
  data = mainData;
  data.forEach(function(d, i) {
    d.newvalues.forEach(function(d) {
      d.i = i;
    });
    d.expected = (total_titles / total_seasons) * d.local_seasons;
  })

  var filtertext = filterConvert(league, level)
  $("#step0_filter").html(filtertext)
  $("#step0_start").html(start)
  $("#step0_end").html(end)
  if (local != undefined) {
    if (leadingcity === local) {
      $("#step1_local").html("");
      $("#step1_totalseasons_local").html("")
      $("#step2_local").html("")
      $("#step2_howmany_local").html("")
    } else {
      $("#step1_local").html("(" + local + " teams have played ");
      $("#step1_totalseasons_local").html(data[0].local_seasons + ")")
      $("#step2_local").html("(" + local + " has a ")
      $("#step2_howmany_local").html(((data[0].newvalues.length - data[0].expected).toFixed(1) < 0 ? "" : "+") + (data[0].newvalues.length - data[0].expected).toFixed(1) + " differential")
    }
    $("#step0_rank").html(rank);
    $("#step0_leader").html(data[leader].key);
  }

  $(".step1_leader").html(leadingcity.substring(0, leadingcity.length - 4))
  if (data[leader].key === "New York Metro Area") $(".step1_leader").html("New York Metro Area");
  $("#step1_totalseasons").html(data[leader].local_seasons)
  $("#step1_totaltitles").html(data[leader].newvalues.length)

  if (data[leader].expected < data[leader].newvalues.length) {
    if (data[leader].newvalues.length - data[leader].expected > 10) $("#step2_lessormore").html("a lot fewer")
    $("#step2_lessormore").html("fewer")
  } else {
    if (data[leader].expected - data[leader].newvalues.length > 10) $("#step2_lessormore").html("a lot more")
    $("#step2_lessormore").html("more")
  }
  $("#step2_howmany").html(data[leader].expected.toFixed(1))

  $("#step3_includes").html(data[leader + 9].key + ", " + data[leader + 8].key + ", and " + data[leader + 6].key)

  c1x = d3.scaleLinear().domain([0, 80]).range([150, sideD.w]);
  c1y = d3.scaleBand().domain(d3.range(num)).range([0, num * h]);

  var svg = d3.select(".case1").append("svg")
    .attr("width", sideD.w + sideD.left + sideD.right)
    .attr("height", num * h);
  var legend = d3.select("#case1_header").append("svg")
    .attr("width", sideD.w + sideD.left + sideD.right)
    .attr("height", h);
  var g = svg.append("g").attr("class", "group")
    .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")");
  var legendg = legend.append("g")
    .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")");
  var xAxis = d3.axisTop(c1x)
    .tickSize(num * h)
    .tickFormat(function(d) {
      if (d === 0) return d + " titles"
      return d
    });

  svg.append("g")
    .attr("class", "x axis c1axis")
    .attr("transform", "translate(" + sideD.left + "," + (num * h) + ")")
    .call(xAxis);

  g.call(c1tip)

  legendg.selectAll(".legend_case1_phase1.rect")
    .data(leagues)
    .enter().append("rect").attr("class", "legend_case1_phase1 rect legend")
    .attr("x", function(d, i) {
      return i * 50
    })
    .attr("y", -10)
    .attr("width", 3)
    .attr("height", 20)
    .style("opacity", c1rectO)
    .style("fill", function(d) {
      return league_colours(d.toLowerCase());
    })
  legendg.selectAll(".legend_case1_phase1.text")
    .data(leagues)
    .enter().append("text").attr("class", "legend_case1_phase1 text legend")
    .attr("x", function(d, i) {
      return i * 50
    })
    .attr("y", 0)
    .attr("dx", 7)
    .attr("dy", 4)
    .style("opacity", c1rectO)
    .text(function(d) {
      return replaceSports(d)
    })
  legendg.append("line")
    .attr("class", "legend_case1_phase2 legend")
    .attr("x1", 5)
    .attr("y1", 0)
    .attr("x2", c1x(0))
    .attr("y2", 0)
    .style("stroke", "#333")
    .style("opacity", c1expO)
    .style("stroke-width", 1)
  legendg.append("text")
    .attr("class", "legend_case1_phase2 legend")
    .attr("x", 5)
    .attr("y", 10)
    .attr("dy", 5)
    .attr("dx", -8)
    .style("text-anchor", "start")
    .style("font-family", "Inconsolata")
    .style("font-size", 12)
    .style("opacity", c1expO)
    .text("Expected Titles")
  legendg.append("text")
    .attr("class", "legend_case1_phase2 legend")
    .attr("x", c1x(0))
    .attr("y", 10)
    .attr("dy", 5)
    .attr("dx", -8)
    .style("text-anchor", "start")
    .style("font-family", "Inconsolata")
    .style("font-size", 12)
    .style("opacity", c1expO)
    .text("Actual Titles")
  legendg.append("circle")
    .attr("class", "legend_case1_phase2 legend")
    .attr("cx", 5)
    .attr("y", 0)
    .attr("r", 2)
    .style("fill", "#666")
    .style("opacity", c1expO)
  legendg.append("circle")
    .attr("class", "legend_case1_phase2 legend")
    .attr("cx", c1x(0))
    .attr("y", 0)
    .attr("r", 3)
    .style("fill", "green")
    .style("opacity", c1expO)

  var search_back = g.append("rect")
    .attr("id", "c1searchback")
    .attr("x", -50)
    .attr("y", c1y(0) - 5)
    .attr("width", sideD.w + 45)
    .attr("height", h)
    .style("fill", "#efefef")
    .style("opacity", 0)
  var text = g.selectAll(".label")
    .data(data)
    .enter().append("text").attr("class", function(d, i) {
      return "label c1label-" + i + " c1label-" + camelize(d.key);
    })
    .attr("x", c1x(0) - 10)
    .attr("y", function(d, i) {
      return c1y(i)
    })
    .attr("dy", 14)
    .style("text-anchor", "end")
    .text(function(d) {
      return d.key;
    });
  var text_count = g.selectAll(".count")
    .data(data)
    .enter().append("text").attr("class", function(d, i) {
      return "count c1label_count-" + i
    })
    .attr("x", function(d) {
      return c1x(d.newvalues.length)
    })
    .attr("y", function(d, i) {
      return c1y(i)
    })
    .attr("dy", 14)
    .attr("dx", 6)
    .text(function(d) {
      if (c1expO > 0) return ((d.newvalues.length - d.expected).toFixed(1) < 0 ? "" : "+") + (d.newvalues.length - d.expected).toFixed(1)
      return d.newvalues.length
    })
  var connect = g.selectAll(".c1connect")
    .data(data)
    .enter().append("line").attr("class", function(d, i) {
      return "c1connect c1connect-" + i
    })
    .attr("x1", function(d) {
      return c1x(d.newvalues.length)
    })
    .attr("y1", function(d, i) {
      return c1y(i) + (h / 2) - 4
    })
    .attr("x2", function(d) {
      return c1x(d.expected)
    })
    .attr("y2", function(d, i) {
      return c1y(i) + (h / 2) - 4
    })
    .style("opacity", c1expO)
    .style("stroke", "#333")
    .style("stroke-width", 1)
  var actual = g.selectAll(".c1act")
    .data(data)
    .enter().append("circle").attr("class", function(d, i) {
      return "c1act c1act-" + i
    })
    .attr("cx", function(d) {
      return c1x(d.newvalues.length)
    })
    .attr("cy", function(d, i) {
      return c1y(i) + (h / 2) - 4
    })
    .attr("r", 3)
    .style("opacity", c1expO)
    .style("fill", function(d) {
      if (c1expO > 0 && d.expected > d.newvalues.length) return "red"
      return "green"
    })
  var expected = g.selectAll(".c1exp")
    .data(data)
    .enter().append("circle").attr("class", function(d, i) {
      return "c1exp c1exp-" + i
    })
    .attr("cx", function(d) {
      return c1x(d.expected)
    })
    .attr("cy", function(d, i) {
      return c1y(i) + (h / 2) - 4
    })
    .attr("r", 2)
    .style("opacity", c1expO)
    .style("fill", "#666");
  var back = g.selectAll(".back")
    .data(data)
    .enter().append("rect").attr("class", function(d, i) {
      return "back back-" + i
    })
    .attr("x", 0)
    .attr("y", function(d, i) {
      return c1y(i)
    })
    .attr("width", sideD.w)
    .attr("height", h)
    .style("fill", "rgba(0,0,0,0)")
    .on("mouseover", function(d, i) {
      g.selectAll(".c1label-" + i + ", .c1label_count-" + i).style("font-weight", "bold");
    })
    .on("mouseout", function(d, i) {
      if (d.key != local) g.selectAll(".c1label-" + i + ", .c1label_count-" + i).style("font-weight", "normal");
    })
  var group = g.selectAll(".c1rect")
    .data(data)
    .enter().append("g").attr("class", "c1rect")
  var rect = group.selectAll(".c1rects")
    .data(function(d, i) {
      return d.newvalues;
    })
    .enter().append("rect")
    .attr("class", function(d) {
      return "c1rects c1rect-" + d.i
    })
    .attr("x", function(d) {
      return c1x(d.n + 1) - 1
    })
    .attr("y", function(d) {
      return c1y(d.i)
    })
    .attr("width", 2)
    .attr("height", 20)
    .style("fill", function(d) {
      return league_colours(d.sport)
    })
    .on("mouseover", function(d) {
      g.selectAll(".c1label-" + d.i + ", .c1label_count-" + d.i).style("font-weight", "bold");
    })
    .on("mouseout", function(d) {
      g.selectAll(".c1label-" + d.i + ", .c1label_count-" + d.i).style("font-weight", "normal");
    })
  var rect_back = group.selectAll(".c1rect_back")
    .data(function(d, i) {
      return d.newvalues;
    })
    .enter().append("rect")
    .attr("class", function(d) {
      return "c1rect_back c1rect_back-" + d.i
    })
    .attr("x", function(d) {
      return c1x(d.n + 1) - 1
    })
    .attr("y", function(d) {
      return c1y(d.i) - 3
    })
    .attr("width", 2)
    .attr("height", 26)
    .style("fill", "rgba(0,0,0,0)")
    .style("stroke", "rgba(0,0,0,0)")
    .style("stroke-width", 6)
    .on("mouseover", function(d) {
      g.selectAll(".c1label-" + d.i + ", .c1label_count-" + d.i).style("font-weight", "bold");
      c1tip.show(d);
    })
    .on("mouseout", function(d) {
      g.selectAll(".c1label-" + d.i + ", .c1label_count-" + d.i).style("font-weight", "normal");
      c1tip.hide();
    })
  if (local != undefined) {
    g.append("text")
      .attr("id", "c1location")
      .attr("class", "icon")
      .attr("x", c1x(0) - getTextWidth(data[adjRank].key, "bold 13px aktiv-grotesk") - 15)
      .attr("y", c1y(adjRank))
      .attr("dy", 14)
      .style("text-anchor", "end")
      .text("\uf124")
    g.select(".c1label-" + camelize(local)).style("font-weight", "bold")
    g.append("line")
      .attr("id", "c1locationLine")
      .attr("x1", c1x(0) - getTextWidth(data[adjRank].key, "bold 16px aktiv-grotesk"))
      .attr("x2", sideD.w)
      .attr("y1", c1y(adjRank) - 5)
      .attr("y2", c1y(adjRank) - 5)
      .style("opacity", 0);
  }
  g.append("text")
    .attr("id", "c1searched")
    .attr("class", "icon")
    .attr("x", -100)
    .attr("y", -100)
    .attr("dy", 14)
    .style("opacity", 0)
    .text("\uf002")
  if (adjRank > num - 2) {
    g.select("#c1locationLine")
      .transition()
      .style("opacity", 1)
  }
} //end caseone

function caseone_filter() {
  var filter = filters[level][league],
    total_titles = 0,
    total_seasons = 0,
    h = 30,
    rank, adjRank, searchedRank, searchedAdjRank;
  leader = 0;

  d3.select("#selected_filters").transition().duration(250)
    .style("opacity", 0)
    .transition().duration(250).delay(50)
    .text(level + " / " + league + " / " + start + "-" + end)
    .style("opacity", 1)

  var data = case1data
  data.forEach(function(d) {
    var local_seasons = 0;
    d.values = d.values.sort(function(a, b) {
      return d3.ascending(+a.year, +b.year);
    });
    d.newvalues = d.values.filter(function(d) {
      return d.year >= start && d.year <= end && $.inArray(d.sport, filter) > -1;
    });
    d.newvalues = d.newvalues.sort(function(a, b) {
      return d3.ascending(+a.year, +b.year) || d3.ascending(a.team, b.team);
    })
    d.newvalues.forEach(function(d, i) {
      d.n = i;
    });
    for (var i = 0; i < filter.length; i++) {
      local_seasons += d.seasons[filter[i]];
    };
    d.local_seasons = local_seasons;
    total_titles += d.newvalues.length;
    total_seasons += local_seasons;
  })
  data.forEach(function(d) {
    d.expected = (total_titles / total_seasons) * d.local_seasons;
  })
  data = data.sort(function(a, b) {
    if (sortmode === "descend_basic") return d3.descending(+a.newvalues.length, +b.newvalues.length) || d3.ascending(a.key, b.key);
    if (sortmode === "descend_diff") return d3.descending(+(a.newvalues.length - a.expected), +(b.newvalues.length - b.expected)) || d3.ascending(a.key, b.key);
    if (sortmode === "ascend_diff") return d3.ascending(+(a.newvalues.length - a.expected), +(b.newvalues.length - b.expected)) || d3.ascending(a.key, b.key);
  })
  data.forEach(function(d, i) {
    if (d.key === local) rank = i;
    if (d.key === searched) searchedRank = i;
  })

  adjRank = rank;
  searchedAdjRank = 0;
  if (rank > num - 2) adjRank = num - 1;
  if (searchedRank < num) searchedAdjRank = searchedRank;
  if (searched === local && rank > num - 2) searchedAdjRank = adjRank;
  if (searchedRank > num - 1 && searchedAdjRank === 0) leader = 1;
  if (adjRank > num - 2) {
    var mainData = data.slice(0, num - 1)
  } else {
    var mainData = data.slice(0, num)
  }
  if (searchedRank > num - 2 && searched != local) {
    mainData = mainData.slice(0, mainData.length - 1)
  }
  if (searched != undefined && searchedRank > num - 2 && searched != local) {
    var searchData = data.filter(function(d) {
      return d.key === searched;
    })
    mainData = mainData.filter(function(d) {
      return d.key != searched;
    })
    Array.prototype.push.apply(searchData, mainData)
    mainData = searchData;
  }
  var leadingcity = mainData[leader].key;
  if (local != undefined && rank > num - 2) {
    var localData = data.filter(function(d) {
      return d.key === local;
    })
    Array.prototype.push.apply(mainData, localData)
  }
  data = mainData;
  data.forEach(function(d, i) {
    d.newvalues.forEach(function(d) {
      d.i = i;
    });
    d.expected = (total_titles / total_seasons) * d.local_seasons;
  })

  var filtertext = filterConvert(league, level)
  $("#step0_filter").html(filtertext)
  $("#step0_start").html(start)
  $("#step0_end").html(end)
  if (local != undefined) {
    if (leadingcity === local) {
      $("#step1_local").html("");
      $("#step1_totalseasons_local").html("")
      $("#step2_local").html("")
      $("#step2_howmany_local").html("")
    } else {
      $("#step1_local").html("(" + local + " teams have played ");
      $("#step1_totalseasons_local").html(data[0].local_seasons + ")")
      $("#step2_local").html(", while " + local + " has a ")
      $("#step2_howmany_local").html(((data[adjRank].newvalues.length - data[adjRank].expected).toFixed(1) < 0 ? "" : "+") + (data[adjRank].newvalues.length - data[adjRank].expected).toFixed(1) + " differential")
    }
    $("#step0_rank").html(rank);
  }

  $("#step0_leader").html(leadingcity);
  $(".step1_leader").html(leadingcity.substring(0, leadingcity.length - 4))
  $("#step2_leader").html(leadingcity.substring(0, leadingcity.length - 4))
  if (leadingcity === "New York Metro Area") $(".step1_leader").html("New York Metro Area");
  if (leadingcity === "New York Metro Area") $("#step2_leader").html("New York Metro Area");
  $("#step1_totalseasons").html(data[leader].local_seasons)
  $("#step1_totaltitles").html(data[leader].newvalues.length)

  if (data[leader].expected < data[leader].newvalues.length) {
    if (data[leader].newvalues.length - data[leader].expected > 10) $("#step2_lessormore").html("a lot fewer")
    $("#step2_lessormore").html("fewer")
  } else {
    if (data[leader].expected - data[leader].newvalues.length > 10) $("#step2_lessormore").html("a lot more")
    $("#step2_lessormore").html("more")
  }
  $("#step2_howmany").html(data[leader].expected.toFixed(1))
  $("#step3_includes").html(data[leader + 8].key + ", " + data[leader + 7].key + ", and " + data[leader + 6].key)

  var svg = d3.select(".case1 svg").transition()
    .attr("width", sideD.w + sideD.left + sideD.right)
    .attr("height", num * h);
  var g = d3.select(".group")
  c1y.domain(d3.range(num)).range([0, num * h]);

  g.call(c1tip)

  var xAxis = d3.axisTop(c1x)
    .tickSize(num * h)
    .tickFormat(function(d) {
      if (d === 0) return d + " titles"
      return d
    });
  d3.select(".c1axis").transition()
    .attr("transform", "translate(" + sideD.left + "," + (num * h) + ")")
    .call(xAxis);

  var text = g.selectAll(".label")
    .data(data, function(d) {
      return d.key;
    })
  text.enter().append("text").attr("class", function(d, i) {
      return "label c1label-" + i + " c1label-" + camelize(d.key);
    })
    .attr("x", 0)
    .attr("y", function(d, i) {
      return c1y(i)
    })
    .attr("dy", 14)
    .style("text-anchor", "end")
    .style("opacity", 0)
    .text(function(d, i) {
      return d.key
    })
    .merge(text).transition().duration(500)
    .attr("class", function(d, i) {
      return "label c1label-" + i + " c1label-" + camelize(d.key);
    })
    .attr("x", c1x(0) - 10)
    .attr("y", function(d, i) {
      return c1y(i)
    })
    .style("opacity", function(d, i) {
      if (i === leader && c1expO > 0) return c1expO * 10
      if (i != leader && c1expO > 0) return c1expO
      1
    })
  text.exit().transition().duration(500)
    .attr("y", sideD.h)
    .style("opacity", 0)
    .remove();

  var text_count = g.selectAll(".count")
    .data(data, function(d) {
      return d.key
    })
  text_count.enter().append("text").attr("class", function(d, i) {
      return "count c1label_count-" + i
    })
    .attr("x", function(d) {
      return c1x(0)
    })
    .attr("y", function(d, i) {
      return c1y(i)
    })
    .style("opacity", 0)
    .merge(text_count)
    .attr("class", function(d, i) {
      return "count c1label_count-" + i
    })
    .transition().duration(500)
    .attr("dy", 14)
    .attr("dx", 6)
    .attr("y", function(d, i) {
      return c1y(i)
    })
    .attr("x", function(d) {
      if (c1expO > 0 && d.expected > d.newvalues.length) return c1x(d.expected)
      return c1x(d.newvalues.length)
    })
    .style("opacity", function(d, i) {
      if (i === leader && c1expO > 0) return c1expO * 10
      if (i != leader && c1expO > 0) return c1expO
      1
    })
    .style("text-anchor", "start")
    .text(function(d) {
      if (c1expO > 0) return ((d.newvalues.length - d.expected).toFixed(1) < 0 ? "" : "+") + (d.newvalues.length - d.expected).toFixed(1)
      return d.newvalues.length
    })
  text_count.exit().transition().duration(500).style("opacity", 0).remove();

  var connect = g.selectAll(".c1connect")
    .data(data, function(d) {
      return d.key;
    })
  connect.enter().append("line").attr("class", function(d, i) {
      return "c1connect c1connect-" + i
    })
    .attr("x1", function(d) {
      return c1x(d.newvalues.length)
    })
    .attr("y1", function(d, i) {
      return c1y(i) + (h / 2) - 4
    })
    .attr("x2", function(d) {
      return c1x(d.newvalues.length)
      // return c1x(d.expected)
    })
    .attr("y2", function(d, i) {
      return c1y(i) + (h / 2) - 4
    })
    .style("stroke", "#333")
    .style("stroke-width", 1)
    .style("opacity", 0)
    .merge(connect).transition().duration(500)
    .attr("class", function(d, i) {
      return "c1connect c1connect-" + i
    })
    .attr("x1", function(d) {
      return c1x(d.newvalues.length)
    })
    .attr("y1", function(d, i) {
      return c1y(i) + (h / 2) - 4
    })
    .attr("x2", function(d) {
      return c1x(d.expected)
    })
    .attr("y2", function(d, i) {
      return c1y(i) + (h / 2) - 4
    })
    .style("opacity", function(d, i) {
      if (i === leader) return c1expO * 10
      return c1expO;
    })
  connect.exit().transition().duration(500)
    .attr("x2", function(d) {
      return c1x(d.newvalues.length)
    })
    .style("opacity", 0)
    .remove();

  var actual = g.selectAll(".c1act")
    .data(data, function(d) {
      return d.key;
    })
  actual.enter().append("circle").attr("class", function(d, i) {
      return "c1act c1act-" + i
    })
    .attr("cx", c1x(0))
    .attr("cy", function(d, i) {
      return c1y(i)
    })
    .attr("r", 3)
    .style("fill", "white")
    .style("fill", function(d) {
      if (c1expO > 0 && d.expected > d.newvalues.length) return "red"
      return "green"
    })
    .style("opacity", 0)
    .merge(actual).transition().duration(500)
    .attr("class", function(d, i) {
      return "c1act c1act-" + i
    })
    .attr("cx", function(d) {
      return c1x(d.newvalues.length)
    })
    .attr("cy", function(d, i) {
      return c1y(i) + (h / 2) - 4
    })
    .style("opacity", function(d, i) {
      if (i === leader) return c1expO * 10
      return c1expO;
    })
  actual.exit().transition().duration(500)
    .attr("cy", sideD.h)
    .style("opacity", 0)
    .remove();

  var expected = g.selectAll(".c1exp")
    .data(data, function(d) {
      return d.key;
    })
  expected.enter().append("circle").attr("class", function(d, i) {
      return "c1exp c1exp-" + i
    })
    .attr("cx", c1x(0))
    .attr("cy", function(d, i) {
      return c1y(i)
    })
    .attr("r", 2)
    .style("fill", "#666")
    .style("opacity", 0)
    .merge(expected).transition().duration(500)
    .attr("class", function(d, i) {
      return "c1exp c1exp-" + i
    })
    .attr("cx", function(d) {
      return c1x(d.expected)
    })
    .attr("cy", function(d, i) {
      return c1y(i) + (h / 2) - 4
    })
    .style("opacity", function(d, i) {
      if (i === leader) return c1expO * 10
      return c1expO;
    })
  expected.exit().transition().duration(500)
    .attr("cy", sideD.h)
    .style("opacity", 0)
    .remove();

  var back = g.selectAll(".back").data(data)
  back.enter().append("rect").merge(back).attr("class", function(d, i) {
      return "back back-" + i;
    })
    .attr("x", 0)
    .attr("y", function(d, i) {
      return c1y(i);
    })
    .attr("width", sideD.w)
    .attr("height", h)
    .style("fill", "rgba(0,0,0,0)")
    .on("mouseover", function(d, i) {
      g.selectAll(".c1label-" + i + ", .c1label_count-" + i).style("font-weight", "bold");
    })
    .on("mouseout", function(d, i) {
      if (d.key != local && d.key != searched) g.selectAll(".c1label-" + i + ", .c1label_count-" + i).style("font-weight", "normal");
    })
  back.exit().remove();

  var group = g.selectAll(".c1rect").data(data)
  group.enter().append("g").attr("class", "c1rect").merge(group).attr("id", function(d) {
    return "";
  })
  group.exit().remove();

  var rect = g.selectAll(".c1rect").selectAll(".c1rects")
    .data(function(d) {
      return d.newvalues
    });
  rect.enter().append("rect")
    .attr("class", "c1rects")
    .attr("x", c1x(0))
    .attr("y", function(d, i) {
      return c1y(d.i)
    })
    .attr("width", 0)
    .attr("height", 20)
    .style("opacity", 0)
    .style("fill", function(d) {
      return league_colours(d.sport)
    })
    .merge(rect)
    .transition().duration(500).delay(function(d, i) {
      return i
    })
    .attr("class", function(d) {
      return "c1rects c1rect-" + d.i
    })
    .attr("x", function(d) {
      return c1x(d.n + 1) - 1
    })
    .attr("y", function(d, i) {
      return c1y(d.i)
    })
    .attr("width", 2)
    .style("fill", function(d) {
      return league_colours(d.sport)
    })
    .style("opacity", c1rectO)
  g.selectAll(".c1rects").style("fill", function(d) {
    return league_colours(d.sport);
  })
  rect.exit().transition().duration(250)
    .delay(function(d, i) {
      return 148 - i * 3
    })
    .attr("y", sideD.h)
    .style("opacity", 0)
    .remove();

  var back_rect = g.selectAll(".c1rect").selectAll(".c1rect_back")
    .data(function(d) {
      return d.newvalues
    })
  back_rect.enter().append("rect")
    .attr("class", function(d) {
      return "c1rect_back c1rect_back-" + d.i
    })
    .merge(back_rect)
    .attr("x", function(d) {
      return c1x(d.n + 1) - 3
    })
    .attr("y", function(d) {
      return c1y(d.i) - 3
    })
    .attr("width", 8)
    .attr("height", 26)
    .style("fill", "rgba(0,0,0,0)")
    .style("stroke", "rgba(0,0,0,0)")
    .style("opacity", c1rectO)
    .on("mouseover", function(d) {
      g.selectAll(".c1label-" + d.i + ", .c1label_count-" + d.i).style("font-weight", "bold");
      if (c1rectO === 1) c1tip.show(d);
    })
    .on("mouseout", function(d) {
      g.selectAll(".c1label-" + d.i + ", .c1label_count-" + d.i).style("font-weight", "normal");
      c1tip.hide();
    })
  back_rect.exit().remove();

  if (searched != undefined) {
    g.select("#c1searchback")
      .transition()
      .attr("x", function() {
        if (searched === local) return c1x(0) - getTextWidth(data[searchedAdjRank].key, "bold 13px aktiv-grotesk") - 45;
        return c1x(0) - getTextWidth(data[searchedAdjRank].key, "bold 13px aktiv-grotesk") - 30
      })
      .attr("y", c1y(searchedAdjRank) - 5)
      .attr("width", function() {
        if (searched === local) return sideD.w - (c1x(0) - getTextWidth(data[searchedAdjRank].key, "bold 13px aktiv-grotesk") - 45);
        return sideD.w - (c1x(0) - getTextWidth(data[searchedAdjRank].key, "bold 13px aktiv-grotesk") - 30)
      })
      .attr("height", h)
      .style("opacity", 1)

    g.select("#c1searched")
      .attr("x", function() {
        if (searched === local) return c1x(0) - getTextWidth(data[searchedAdjRank].key, "bold 13px aktiv-grotesk") - 40
        return c1x(0) - getTextWidth(data[searchedAdjRank].key, "bold 13px aktiv-grotesk") - 25
      })
      .attr("y", c1y(searchedAdjRank))
      .transition()
      .style("opacity", 1)
    g.selectAll(".label").style("font-weight", "normal")
    g.select(".c1label-" + camelize(searched)).style("font-weight", "bold")
  }
  if (local != undefined) {
    g.select("#c1location")
      .transition().duration(500)
      .attr("y", c1y(adjRank))
    g.select(".c1label-" + camelize(local)).style("font-weight", "bold")
    if (adjRank > num - 2) {
      g.select("#c1locationLine")
        .transition()
        .attr("x1", c1x(0) - getTextWidth(data[adjRank].key, "bold 16px aktiv-grotesk"))
        .attr("x2", sideD.w)
        .attr("y1", c1y(adjRank) - 5)
        .attr("y2", c1y(adjRank) - 5)
        .style("opacity", 1);
    } else {
      g.select("#c1locationLine").transition().style("opacity", 0)
    }
  }
}

function caseone_update(index, prev) {
  var g = d3.select(".group");
  var rect = g.selectAll(".c1rects");
  var actual = g.selectAll(".c1act");
  var expected = g.selectAll(".c1exp");
  var connect = g.selectAll(".c1connect");
  var text_count = g.selectAll(".count");
  var h = 30;

  c1x = d3.scaleLinear().domain([0, 80]).range([150, sideD.w]);
  c1y = d3.scaleBand().domain(d3.range(num)).range([0, num * h]);

  if (index === 0) {
    g.selectAll(".c1rects:not(.c1rect-" + leader + ")").transition().duration(250).style("opacity", 1)
    g.selectAll(".label:not(.c1label-" + leader + ")").transition().duration(250).style("opacity", 1)
    g.selectAll(".count:not(.c1label_count-" + leader + ")").transition().duration(250).style("opacity", 1)
    caseone_filter();
  } else if (index === 1) {
    c1rectO = 1;
    c1expO = 0;

    sortmode = "descend_basic";
    if (prev === 0) {
      // num = 21
      // if (small_screen) num = 11;
      caseone_filter();
      g.selectAll(".c1rects:not(.c1rect-" + leader + ")").transition().duration(250).style("opacity", .1)
      g.selectAll(".label:not(.c1label-" + leader + ")").transition().duration(250).style("opacity", .1)
      g.selectAll(".count:not(.c1label_count-" + leader + ")").transition().duration(250).style("opacity", .1)
    } else if (prev === 2) {
      // num = 21
      // if (small_screen) num = 11;
      caseone_filter();
      rect.transition().duration(500).delay(function(d) {
          return d.n * 3
        }).attr("y", function(d) {
          return c1y(d.i)
        }).attr("height", 20)
        .style("opacity", 1)
      g.selectAll("rect:not(.c1rect-" + leader + ")").transition().duration(250).delay(1000).style("opacity", .1)
      g.selectAll(".label:not(.c1label-" + leader + ")").transition().duration(250).delay(1000).style("opacity", .1)
      g.selectAll(".count:not(.c1label_count-" + leader + ")").transition().duration(250).delay(1000).style("opacity", .1)

      d3.selectAll(".c1act, .c1exp, .c1connect, .label_expected, .label_actual")
        .transition().duration(500).style("opacity", c1expO)

      d3.selectAll(".legend_case1_phase1").transition().style("opacity", c1rectO)
      d3.selectAll(".legend_case1_phase2").transition().style("opacity", c1expO)
    } else {
      caseone_filter();
      rect.transition().duration(500).delay(function(d) {
          return d.n * 3
        }).attr("y", function(d) {
          return c1y(d.i)
        }).attr("height", 20)
        .style("opacity", 1)
      d3.selectAll(".legend_case1_phase1").transition().style("opacity", c1rectO)
      d3.selectAll(".legend_case1_phase2").transition().style("opacity", c1expO)
    }

  } else if (index === 2) {
    $(".filter-container").addClass("ishidden");
    $(".filter-container").removeClass("isvisible");

    d3.select("#showMoreC1").style("display", "block").transition().style("opacity", 0)

    if (prev === 1) {
      c1rectO = 0;
      c1expO = .1;
    } else {
      c1rectO = 0;
      c1expO = 1;
    }

    d3.selectAll(".legend_case1_phase1").transition().style("opacity", c1rectO);
    d3.selectAll(".legend_case1_phase2").transition().style("opacity", c1expO);

    sortmode = "descend_basic";
    caseone_filter();

    // g.selectAll("rect").transition().duration(500).delay(function(d) {
    //     return d.n * 3
    //   })
    //   .attr("y", function(d) {
    //     if (d.metro === local) return c1y(0) + h / 2
    //     return c1y(d.i) + h / 2
    //   })
    //   .attr("height", 0);
    //
    // g.selectAll(".label:not(.c1label-" + leader + ")").transition().delay(250).style("opacity", c1expO)

  } else if (index === 3) {
    sortmode = "descend_diff";
    $(".filter-container").removeClass("ishidden");

    d3.select("#showMoreC1").style("display", "block").transition().style("opacity", 1)
    c1rectO = 0;
    c1expO = 1;
    d3.selectAll(".legend_case1_phase1").transition().style("opacity", c1rectO);
    d3.selectAll(".legend_case1_phase2").transition().style("opacity", c1expO);
    $("#switch_actual").removeClass("isactive")
    $("#switch_high_diff").addClass("isactive")
    $("#switch_low_diff").removeClass("isactive")
    caseone_filter()
    if (prev === 2 && !casetwodrawn) casetwo();
  } else if (index === 5) {

  } else if (index === 6) {
    caseone_filter();
  } else if (index === 7) {
    c1rectO = 0;
    c1expO = 1;
    d3.selectAll(".legend_case1_phase1").transition().style("opacity", c1rectO);
    d3.selectAll(".legend_case1_phase2").transition().style("opacity", c1expO);
    sortmode = "descend_diff";
    caseone_filter();
  } else if (index === 8) {
    c1rectO = 0;
    c1expO = 1;
    d3.selectAll(".legend_case1_phase1").transition().style("opacity", c1rectO);
    d3.selectAll(".legend_case1_phase2").transition().style("opacity", c1expO);
    sortmode = "ascend_diff";
    caseone_filter();
  }
}

function casetwo() {
  // local = "New York Metro Area"
  casetwodrawn = true;
  var filter = filters[level][league],
    h = 30,
    rank, adjRank;

  var data = case2data;
  data.forEach(function(d) {
    var teams = 0,
      results = 0;
    d.seasons.sort(function(a, b) {
      return d3.ascending(+a.season, +b.season);
    });
    d.newseasons = d.seasons.filter(function(d) {
      return d.season >= start && d.season <= end;
    });
    d.newseasons.forEach(function(d) {
      d.newteams = d.teams.filter(function(d) {
        return $.inArray(d.sport, filter) > -1
      })
      d.newteams.forEach(function(d) {
        teams += 1
        if (d.result != "season") results += 1
      })
    })
    d.newseasons = d.newseasons.filter(function(d) {
      return d.newteams.length > 0;
    })
    d.teams = teams;
    d.results = results;
  })
  data.sort(function(a, b) {
    return d3.descending(+a.newseasons.length, +b.newseasons.length) || d3.ascending(a.metro, b.metro);
  })
  data.forEach(function(d, i) {
    if (d.metro === local) rank = i;
  })

  if (local != undefined) {
    if (rank > case2num - 2) {
      adjRank = case2num - 1;
      var mainData = data.slice(0, case2num - 1);
      var localData = data.filter(function(d) {
        return d.metro === local
      })
      Array.prototype.push.apply(mainData, localData);
    } else {
      adjRank = rank;
      var mainData = data.slice(0, case2num);
    }
  } else {
    var mainData = data.slice(0, case2num);
  }
  data = mainData;
  data.forEach(function(d, i) {
    d.newseasons.forEach(function(d) {
      var row = i;
      d.i = row;
      var y = d.season
      d.newteams = d.newteams.filter(function(d) {
        return d.result != "season";
      });
      d.newteams.sort(function(a, b) {
        return d3.descending(a.result, b.result);
      });
      d.newteams.forEach(function(d) {
        d.row = row;
        d.y = y;
      });
    });
  })

  var DDdata = dynasties_and_droughts(case2data)

  c2x = d3.scaleLinear().domain([start, end]).range([150, sideD.w]);
  c2y = d3.scaleBand().domain(d3.range(case2num)).range([0, case2num * h]);

  var svg = d3.select(".case2").append("svg")
    .attr("width", sideD.w + sideD.left + sideD.right)
    .attr("height", case2num * h);
  var legend = d3.select("#case2_header").append("svg")
    .attr("width", sideD.w + sideD.left + sideD.right)
    .attr("height", h);
  var g = svg.append("g").attr("class", "group2")
    .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")");
  var legendg = legend.append("g")
    .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")");
  var xAxis = d3.axisTop(c2x)
    .tickSize(case2num * h)
    .tickFormat(d3.format(""));

  svg.call(c2tip)

  svg.append("g")
    .attr("class", "x axis c2axis")
    .attr("transform", "translate(" + sideD.left + "," + (case2num * h) + ")")
    .call(xAxis);

  legendg.selectAll(".legend_case2.circle")
    .data(events)
    .enter().append("circle").attr("class", "legend_case2 circle legend")
    .attr("cx", function(d, i) {
      if (d.event === "finals appearance") return 50
      if (d.event === "final four appearance") return 175
      return 0
    })
    .attr("cy", 0)
    .attr("r", 3)
    .style("fill", function(d) {
      return d.colour;
    })
  legendg.selectAll(".legend_case2.text")
    .data(events)
    .enter().append("text").attr("class", "legend_case2 text legend")
    .attr("x", function(d, i) {
      if (d.event === "finals appearance") return 50
      if (d.event === "final four appearance") return 175
      return 0
    })
    .attr("cy", 0)
    .attr("dx", 6)
    .attr("dy", 4)
    .style("fill", "#b5b5b5")
    .text(function(d) {
      return d.event
    })

  var search_back = g.append("rect")
    .attr("id", "c2searchback")
    .attr("x", 0)
    .attr("y", c1y(0) - 5)
    .attr("width", sideD.w)
    .attr("height", h)
    .style("fill", "rgba(255,255,255,.1)")
    .style("opacity", 0)
  var text = g.selectAll(".label")
    .data(data)
    .enter().append("text").attr("class", function(d, i) {
      return "label c2label c2label-" + camelize(d.metro) + " c2label-" + i
    })
    .attr("x", function(d) {
      if (d.newseasons[0].season === undefined) return c2x(end);
      return c2x(d.newseasons[0].season) - 10
    })
    .attr("y", function(d, i) {
      return c2y(i)
    })
    .attr("dy", 14)
    .style("text-anchor", "end")
    .text(function(d) {
      return d.metro;
    });
  var back = g.selectAll(".back")
    .data(data)
    .enter().append("rect").attr("class", function(d, i) {
      return "back c2back-" + i
    })
    .attr("x", 0)
    .attr("y", function(d, i) {
      return c2y(i)
    })
    .attr("width", sideD.w)
    .attr("height", h)
    .style("fill", "rgba(0,0,0,0)")
    .on("mouseover", function(d, i) {
      d3.select(".c2label-" + i).style("font-weight", "bold")
    })
    .on("mouseout", function(d, i) {
      if (d.metro != local && d.metro != searched) d3.select(".c2label-" + i).style("font-weight", "normal")
    });
  var group = g.selectAll(".c2rect")
    .data(data)
    .enter().append("g").attr("class", "c2rect")
  var rect = group.selectAll(".season")
    .data(function(d) {
      return d.newseasons
    })
    .enter().append("line").attr("class", "season")
    .attr("x1", function(d) {
      return c2x(d.season)
    })
    .attr("y1", function(d) {
      return c2y(d.i) + 10
    })
    .attr("x2", function(d) {
      return c2x(d.season + 1)
    })
    .attr("y2", function(d) {
      return c2y(d.i) + 10
    })
    .style("stroke-linecap", "round")
    .style("stroke", "#444")
    .style("stroke-width", 5)
  var subgroup = group.selectAll(".c2subrect")
    .data(function(d) {
      return d.newseasons
    })
    .enter().append("g").attr("class", "c2subrect")
  var subrect = subgroup.selectAll(".result")
    .data(function(d) {
      return d.newteams
    })
    .enter().append("circle").attr("class", "result")
    .attr("cx", function(d) {
      return c2x(d.y)
    })
    .attr("cy", function(d, i) {
      return (c2y(d.row) + 10) - (i * 4)
    })
    .attr("r", radius(end - start))
    .style("fill", function(d) {
      return event_colours(d.result)
    })
  var tiprect = group.selectAll(".tiprect")
    .data(function(d) {
      return d.newseasons
    })
    .enter().append("rect").attr("class", "tiprect")
    .attr("x", function(d) {
      return c2x(d.season - .5)
    })
    .attr("y", function(d) {
      return c2y(d.i) - 10
    })
    .attr("width", function(d) {
      return c2x(d.season + .5) - c2x(d.season - .5)
    })
    .attr("height", function(d) {
      return h
    })
    // .style("stroke-linecap", "round")
    // .style("stroke-width", 10)
    // .style("stroke", "rgba(0,0,0,1)")
    .style("fill", "rgba(0,0,0,0)")
    .style("opacity", function(d) {
      if (d.dry) return 0;
      return 1;
    })
    .on("mouseover", function(d) {
      d3.select(".c2label-" + d.i).style("font-weight", "bold")
      if (d.newteams.length > 0) c2tip.show(d);
    })
    .on("mouseout", function(d) {
      if (d.metro != local && d.metro != searched) d3.select(".c2label-" + d.i).style("font-weight", "normal")
      c2tip.hide()
    })
  if (local != undefined) {
    g.append("text")
      .attr("id", "c2location")
      .attr("class", "icon")
      .attr("x", function() {
        if (data[adjRank].newseasons[0].season === undefined) return c2x(end) - getTextWidth(data[adjRank].metro, "bold 13px aktiv-grotesk") - 15;
        return c2x(data[adjRank].newseasons[0].season) - getTextWidth(data[adjRank].metro, "bold 13px aktiv-grotesk") - 15;
      })
      .attr("y", c1y(adjRank))
      .attr("dy", 14)
      .style("text-anchor", "end")
      .text("\uf124")
    g.select(".c2label-" + camelize(local)).style("font-weight", "bold")
    g.append("line")
      .attr("id", "c2locationLine")
      .attr("x1", function() {
        if (data[adjRank].newseasons[0].season === undefined) return c2x(end) - getTextWidth(data[adjRank].metro, "bold 13px aktiv-grotesk") - 15;
        return c2x(data[adjRank].newseasons[0].season) - getTextWidth(data[adjRank].metro, "bold 13px aktiv-grotesk") - 15;
      })
      .attr("x2", c2x(end))
      .attr("y1", c2y(adjRank) - 5)
      .attr("y2", c2y(adjRank) - 5)
      .style("opacity", 0)
      .style("stroke", "rgba(255,255,255,0.5)");
  }
  g.append("text")
    .attr("id", "c2searched")
    .attr("class", "icon")
    .attr("x", -100)
    .attr("y", -100)
    .attr("dy", 14)
    .style("opacity", 0)
    .text("\uf002")
  if (adjRank > case2num - 2) {
    g.select("#c2locationLine")
      .transition()
      .style("opacity", 1)
  }
}

function casetwo_filter() {
  // searched
  var filter = filters[level][league],
    h = 30,
    rank, adjRank, searchedRank, searchedAdjRank;

  d3.select("#selected_filters").transition().duration(250)
    .style("opacity", 0)
    .transition().duration(250).delay(50)
    .text(level + " / " + league + " / " + start + "-" + end)
    .style("opacity", 1)

  var data = case2data;
  data.forEach(function(d) {
    var teams = 0,
      results = 0,
      titles = 0;
    d.seasons.sort(function(a, b) {
      return d3.ascending(+a.season, +b.season);
    });
    d.newseasons = d.seasons.filter(function(d) {
      return d.season >= start && d.season <= end;
    });
    d.newseasons.forEach(function(d) {
      d.newteams = d.teams.filter(function(d) {
        return $.inArray(d.sport, filter) > -1
      })
      d.newteams.forEach(function(d) {
        teams += 1;
        if (d.result != "season") results += 1;
        if (d.result === "title") titles += 1;
      })
    })
    d.newseasons = d.newseasons.filter(function(d) {
      return d.newteams.length > 0;
    })
    d.teams = teams;
    d.results = results;
    d.titles = titles;
    d.conversion = titles / d.newseasons.length
    if (isNaN(d.conversion)) d.conversion = 0;
  })
  if (sortmode2 === "ascend_max_dryspell" || sortmode2 === "descend_max_dryspell") {
    // data = data.filter(function(d) {
    //   return (d.titles > 0 && d.newseasons.length > 24) || (d.metro === local || d.metro === searched);
    // })
    data = data.filter(function(d) {
      return d.titles > 0 || d.metro === local || d.metro === searched;
    })
    data = data.filter(function(d) {
      return d.newseasons.length > 24 || d.metro === local || d.metro === searched;
    })
    // data = data.filter(function(d) {
    //   return d.newseasons.length > 24 || d.metro === local;
    // })
  } else {
    data = data;
  }
  data = dynasties_and_droughts(data);
  data.sort(function(a, b) {
    if (sortmode2 === "descend_seasons") return d3.descending(+a.newseasons.length, +b.newseasons.length) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_results") return d3.descending(+a.results, +b.results) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_teams") return d3.descending(+a.teams, +b.teams) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_titles") return d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_conversion_seasons") return d3.descending(+a.conversion, +b.conversion) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_max_dynasty") return d3.descending(+a.max_dynasty, +b.max_dynasty) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_max_prettygooddynasty") return d3.descending(+a.max_prettygooddynasty, +b.max_prettygooddynasty) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_max_dryspell") return d3.descending(+a.dryseasons.length, +b.dryseasons.length) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "ascend_max_dryspell") return d3.ascending(+a.dryseasons.length, +b.dryseasons.length) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_total_dynasties") return d3.descending(+a.dynasties.length, +b.dynasties.length) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_total_dryspells") return d3.descending(+a.dryspells.length, +b.dryspells.length) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_total_prettygooddynasties") return d3.descending(+a.prettygooddynasties.length, +b.prettygooddynasties.length) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
  })
  data.forEach(function(d, i) {
    if (d.metro === local) rank = i;
    if (d.metro === searched) searchedRank = i;
  })

  adjRank = rank;
  searchedAdjRank = 0;
  if (rank > case2num - 2) adjRank = case2num - 1;
  if (searchedRank < case2num) searchedAdjRank = searchedRank;
  if (searched === local && rank > case2num - 2) searchedAdjRank = adjRank;
  if (searchedRank > case2num - 1 && searchedAdjRank === 0) leader = 1;
  if (adjRank > case2num - 2) {
    var mainData = data.slice(0, case2num - 1)
  } else {
    var mainData = data.slice(0, case2num)
  }
  if (searchedRank > case2num - 2 && searched != local) {
    mainData = mainData.slice(0, mainData.length - 1)
  }
  if (searched != undefined && searchedRank > case2num - 1 && searched != local) {
    var searchData = data.filter(function(d) {
      return d.metro === searched;
    })
    mainData = mainData.filter(function(d) {
      return d.metro != searched;
    })
    Array.prototype.push.apply(searchData, mainData)
    mainData = searchData;
  }
  if (local != undefined && rank > case2num - 2) {
    var localData = data.filter(function(d) {
      return d.metro === local;
    })
    Array.prototype.push.apply(mainData, localData)
  }
  data = mainData;
  data.forEach(function(d, i) {
    d.newseasons.forEach(function(d) {
      var row = i;
      d.i = row;
      var y = d.season
      d.newteams = d.newteams.filter(function(d) {
        return d.result != "season";
      });
      d.newteams.sort(function(a, b) {
        return d3.descending(a.result, b.result);
      });
      d.newteams.forEach(function(d) {
        d.row = row;
        d.y = y;
      });
    });
    d.dynasties.forEach(function(d) {
      d.row = i;
    })
    d.prettygooddynasties.forEach(function(d) {
      d.row = i;
    })
    d.dryspells.forEach(function(d) {
      d.row = i;
    })
  })

  var svg = d3.select(".case2 svg").transition()
    .attr("width", sideD.w + sideD.left + sideD.right)
    .attr("height", case2num * h);
  var g = d3.select(".group2")
  c2x.domain([start, end]).range([150, sideD.w]);
  c2y.domain(d3.range(case2num)).range([0, case2num * h]);

  svg.call(c2tip)

  var xAxis = d3.axisTop(c2x)
    .tickFormat(d3.format(""))
    .tickSize(case2num * h);
  d3.select(".c2axis").transition()
    .attr("transform", "translate(" + sideD.left + "," + (case2num * h) + ")")
    .call(xAxis);

  var text = g.selectAll(".label")
    .data(data, function(d) {
      return d.metro;
    })
  text.enter().append("text").attr("class", function(d, i) {
      return "label c2label c2label-" + d.metro + " c2label-" + i
    })
    .attr("x", 0)
    .attr("y", function(d, i) {
      return c2y(i)
    })
    .attr("dy", 14)
    .style("text-anchor", "end")
    .style("opacity", 0)
    .text(function(d) {
      return d.metro
    })
    .merge(text)
    .attr("class", function(d, i) {
      return "label c2label c2label-" + d.metro + " c2label-" + i
    })
    .transition().duration(500)
    .attr("x", function(d) {
      if (d.newseasons[0] === undefined) return c2x(end);
      return c2x(d.newseasons[0].season) - 10
    })
    .attr("y", function(d, i) {
      return c2y(i)
    })
    .style("opacity", function(d) {
      if (d.titles > 0) return 1
      return 0.25
    })
  text.exit().transition().duration(500)
    .attr("y", sideD.h)
    .style("opacity", 0)
    .remove();

  var back = g.selectAll(".back").data(data)
  back.enter().append("rect").merge(back).attr("class", function(d, i) {
      return "back c2back-" + i;
    })
    .attr("x", 0)
    .attr("y", function(d, i) {
      return c1y(i);
    })
    .attr("width", sideD.w)
    .attr("height", h)
    .style("fill", "rgba(0,0,0,0)")
    .on("mouseover", function(d, i) {
      d3.select(".c2label-" + i).style("font-weight", "bold")
    })
    .on("mouseout", function(d, i) {
      if (d.metro != local && d.metro != searched) d3.select(".c2label-" + i).style("font-weight", "normal")
    })
  back.exit().remove();

  var group = g.selectAll(".c2rect").data(data);
  group.enter().append("g").attr("class", "c2rect").merge(group);
  group.exit().remove();

  var rect = g.selectAll(".c2rect").selectAll(".season")
    .data(function(d, i) {
      return d.newseasons
    })
  rect.enter().append("line").attr("class", "season")
    .attr("x1", function(d) {
      return c2x(d.season)
    })
    .attr("y1", function(d) {
      return c2y(d.i) + 10
    })
    .attr("x2", function(d) {
      return c2x(d.season)
    })
    .attr("y2", function(d) {
      return c2y(d.i) + 10
    })
    .style("stroke-linecap", "round")
    .style("stroke", "#444")
    .style("stroke-width", 5)
    .style("opacity", 0)
    .merge(rect).transition().duration(500).delay(function(d, i) {
      return i
    })
    .attr("x1", function(d) {
      return c2x(d.season)
    })
    .attr("y1", function(d) {
      return c2y(d.i) + 10
    })
    .attr("x2", function(d) {
      return c2x(d.season + 1)
    })
    .attr("y2", function(d) {
      return c2y(d.i) + 10
    })
    .style("opacity", 1)
  rect.exit().transition().duration(500)
    .delay(function(d, i) {
      return i
    })
    .attr("x2", function(d) {
      return c2x(d.season)
    })
    .style("opacity", 0)
    .remove();

  var subgroup = g.selectAll(".c2rect").selectAll(".c2subrect").data(function(d) {
    return d.newseasons;
  })
  subgroup.enter().append("g").attr("class", "c2subrect").merge(subgroup);
  subgroup.exit().remove();

  var subrect = g.selectAll(".c2rect").selectAll(".c2subrect").selectAll(".result")
    .data(function(d) {
      return d.newteams;
    });
  subrect.enter().append("circle").attr("class", "result")
    .attr("cx", function(d) {
      return c2x(d.y)
    })
    .attr("cy", function(d, i) {
      return (c2y(d.row) + 10) - (i * 4)
    })
    .attr("r", 2)
    .style("opacity", 0)
    .style("fill", "#444")
    .merge(subrect).transition().duration(500).delay(function(d, i) {
      return i
    })
    .attr("cx", function(d) {
      return c2x(d.y)
    })
    .attr("cy", function(d, i) {
      return (c2y(d.row) + 10) - (i * 4)
    })
    .attr("r", radius(end - start))
    .style("opacity", 1)
    .style("fill", function(d) {
      return event_colours(d.result)
    })
  subrect.exit().transition().duration(500).style("opacity", 0).remove();

  var tiprect = g.selectAll(".c2rect").selectAll(".tiprect")
    .data(function(d) {
      return d.newseasons
    })
  tiprect.enter().append("rect").attr("class", "tiprect")
    .attr("x", function(d) {
      return c2x(d.season - .5)
    })
    .attr("y", function(d) {
      return c2y(d.i) - 10
    })
    .attr("width", function(d) {
      return c2x(d.season + .5) - c2x(d.season - .5)
    })
    .attr("height", function(d) {
      return h
    })
    // .style("stroke-linecap", "round")
    .style("fill", "rgba(0,0,0,0)")
    .style("opacity", function(d) {
      if (d.dry) return 0;
      return 1
    })
    // .style("stroke-width", 10)
    .merge(tiprect)
    .attr("x", function(d) {
      return c2x(d.season - .5)
    })
    .attr("y", function(d) {
      return c2y(d.i) - 10
    })
    .attr("width", function(d) {
      return c2x(d.season + .5) - c2x(d.season - .5)
    })
    .attr("height", function(d) {
      return h
    })
    .on("mouseover", function(d) {
      d3.select(".c2label-" + d.i).style("font-weight", "bold")
      if (d.newteams.length > 0) c2tip.show(d);
    })
    .on("mouseout", function(d) {
      if (d.metro != local && d.metro != searched) d3.select(".c2label-" + d.i).style("font-weight", "normal")
      c2tip.hide()
    })
  tiprect.exit().remove();

  if (sortmode2 === "descend_max_dynasty") {
    var dyn_rect = g.selectAll(".c2rect").selectAll(".dyn_rect").data(function(d) {
      return d.dynasties;
    })
  } else if (sortmode2 === "descend_max_prettygooddynasty") {
    var dyn_rect = g.selectAll(".c2rect").selectAll(".dyn_rect").data(function(d) {
      return d.prettygooddynasties;
    })
  } else if (sortmode2 === "ascend_max_dryspell" || sortmode2 === "descend_max_dryspell") {
    var dyn_rect = g.selectAll(".c2rect").selectAll(".dyn_rect").data(function(d) {
      return d.dryspells;
    })
  }

  if (sortmode2 === "descend_max_dynasty" || sortmode2 === "descend_max_prettygooddynasty" || sortmode2 === "descend_max_dryspell" || sortmode2 === "ascend_max_dryspell") {
    dyn_rect.enter().append("line").attr("class", "dyn_rect")
      .attr("x1", function(d) {
        return c2x(d.start)
      })
      .attr("y1", function(d) {
        return c2y(d.row) + 15
      })
      .attr("x2", function(d) {
        return c2x(d.start)
      })
      .attr("y2", function(d) {
        return c2y(d.row) + 15
      })
      .style("stroke-linecap", "round")
      .style("stroke", "white")
      .style("stroke-width", 1.5)
      .style("opacity", 0)
      .merge(dyn_rect).transition().duration(500).delay(function(d, i) {
        return i + 500
      })
      .attr("x1", function(d) {
        return c2x(d.start)
      })
      .attr("y1", function(d) {
        return c2y(d.row) + 15
      })
      .attr("x2", function(d) {
        return c2x(d.end)
      })
      .attr("y2", function(d) {
        return c2y(d.row) + 15
      })
      .style("opacity", 1)
    dyn_rect.exit().transition().duration(500)
      .delay(function(d, i) {
        return i
      })
      .attr("x1", function(d) {
        return c2x(d.end)
      })
      .style("opacity", 0)
      .remove();
  } else {
    g.selectAll(".c2rect").selectAll(".dyn_rect").transition().duration(500)
      .delay(function(d, i) {
        return i
      })
      .attr("x1", function(d) {
        return c2x(d.end)
      })
      .style("opacity", 0)
      .remove();
  }



  if (searched != undefined) {
    g.select("#c2searchback")
      .transition()
      .attr("x", function() {
        var offset = 30;
        if (searched === local) offset = 45;
        if (data[searchedAdjRank].newseasons[0] === undefined) return c2x(end) - getTextWidth(data[searchedAdjRank].metro, "bold 13px aktiv-grotesk") - offset;
        return c2x(data[searchedAdjRank].newseasons[0].season) - getTextWidth(data[searchedAdjRank].metro, "bold 13px aktiv-grotesk") - offset;
      })
      .attr("y", c2y(searchedAdjRank) - 5)
      .attr("width", function() {
        var offset = 30;
        if (searched === local) offset = 45;
        if (data[searchedAdjRank].newseasons[0] === undefined) return sideD.w - (c2x(end) - getTextWidth(data[searchedAdjRank].metro, "bold 13px aktiv-grotesk") - offset) + 5;
        return sideD.w - (c2x(data[searchedAdjRank].newseasons[0].season) - getTextWidth(data[searchedAdjRank].metro, "bold 13px aktiv-grotesk") - offset) + 5;
      })
      .attr("height", h)
      .style("opacity", 1)

    g.select("#c2searched")
      .attr("x", function() {
        var offset = 25;
        if (searched === local) offset = 40;
        if (data[searchedAdjRank].newseasons[0] === undefined) return c2x(end) - getTextWidth(data[searchedAdjRank].metro, "bold 13px aktiv-grotesk") - offset;
        return c2x(data[searchedAdjRank].newseasons[0].season) - getTextWidth(data[searchedAdjRank].metro, "bold 13px aktiv-grotesk") - offset;
      })
      .attr("y", c1y(searchedAdjRank))
      .transition()
      .style("opacity", 1)
    g.selectAll(".label").style("font-weight", "normal")
    g.select(".c2label-" + camelize(searched)).style("font-weight", "bold")
  }
  if (local != undefined) {
    g.select("#c2location")
      .transition().duration(500)
      .attr("x", function() {
        if (data[adjRank].newseasons[0] === undefined) return c2x(end) - getTextWidth(data[adjRank].metro, "bold 13px aktiv-grotesk") - 15;
        return c2x(data[adjRank].newseasons[0].season) - getTextWidth(data[adjRank].metro, "bold 13px aktiv-grotesk") - 15;
      })
      .attr("y", c2y(adjRank))
    g.select(".c2label-" + camelize(local)).style("font-weight", "bold")
    if (adjRank > case2num - 2) {
      g.select("#c2locationLine")
        .transition()
        .attr("x1", function() {
          if (data[adjRank].newseasons[0] === undefined) return c2x(end) - getTextWidth(data[adjRank].metro, "bold 13px aktiv-grotesk") - 15;
          return c2x(data[adjRank].newseasons[0].season) - getTextWidth(data[adjRank].metro, "bold 13px aktiv-grotesk") - 15;
        })
        .attr("x2", c2x(end))
        .attr("y1", c2y(adjRank) - 5)
        .attr("y2", c2y(adjRank) - 5)
        .style("opacity", 1);
    } else {
      g.select("#c2locationLine").transition().style("opacity", 0)
    }
  }
}

function casetwo_update(index) {
  if (index === 5) {
    $(".filter-container").addClass("ishidden");
    $(".filter-container").removeClass("isvisible");
    sortmode2 = "descend_seasons";
    $("#lower-left").val(1870)
    $("#upper-left").val(2018)
    start = 1870;
    end = 2018;
    level = "all-levels";
    league = "all-leagues";
    casetwo_filter();
  } else if (index === 6) {
    sortmode2 = "descend_conversion_seasons";
    start = 1870;
    end = 1920;
    $("#lower-left").val(1870)
    $("#upper-left").val(1920)
    casetwo_filter();
  } else if (index === 7) {
    start = 1920;
    end = 1970;
    $("#lower-left").val(1920)
    $("#upper-left").val(1970)
    casetwo_filter();
  } else if (index === 8) {
    sortmode2 = "descend_conversion_seasons";
    start = 1970;
    end = 2018;
    $("#lower-left").val(1970)
    $("#upper-left").val(2018)
    casetwo_filter();
  } else if (index === 9) {
    $(".filter-container").addClass("ishidden");
    $(".filter-container").removeClass("isvisible");
    d3.select("#showMoreC2").transition().style("opacity", 0).style("display", "none")
    sortmode2 = "descend_max_dynasty";
    start = 1870;
    end = 2018;
    $("#lower-left").val(1870)
    $("#upper-left").val(2018)
    casetwo_filter();
  } else if (index === 10) {
    $(".filter-container").removeClass("ishidden");
    d3.select("#showMoreC2").style("display", "block").transition().style("opacity", 1)
    sortmode2 = "ascend_max_dryspell";
    casetwo_filter();
  }
}

function casethree() {
  var filter = filters[level][league],
    total_titles = 0,
    total_pop = 0,
    h = 30,
    leader = 0;
  // sideD.left = 50;

  var data = case3data;
  data.forEach(function(d) {
    d.values = d.values.sort(function(a, b) {
      return d3.ascending(+a.year, +b.year);
    });
    d.newvalues = d.values.filter(function(d) {
      return d.year >= start && d.year <= end && $.inArray(d.sport, filter) > -1;
    });
    total_titles += d.newvalues.length;
    total_pop += d.population;
  });
  data = data.filter(function(d) {
    return d.newvalues.length > 0;
  });
  data.forEach(function(d) {
    d.tlq = (d.newvalues.length / d.population) / (total_titles / total_pop)
  });
  data = data.sort(function(a, b) {
    // return d3.descending(+a.tlq, +b.tlq) || d3.ascending(a.key, b.key);
    return d3.ascending(+a.population, +b.population) || d3.ascending(a.key, b.key);
  })
  // var addData = data.slice(0, num - 1);
  // var leadingcity = addData[0].key;
  // if (local != undefined) {
  //   addData = addData.filter(function(d) {
  //     return d.key != local
  //   })
  //   data = data.filter(function(d, i) {
  //     if (d.key === local) rank = i;
  //     return d.key === local
  //   })
  //   Array.prototype.push.apply(data, addData);
  // } else {
  //   data = addData
  // }

  c3x = d3.scaleLinear().domain([0, 22000000]).range([0, sideD.w]);
  c3y = d3.scaleLinear().domain([0, 80]).range([(case3num * h), 0])
  c3r = d3.scaleLinear().domain([0, 1, 20, d3.max(data, function(d) {
    return d.tlq;
  })]).range([1, 3, 8, 10])
  c3c = d3.scaleLinear().domain([0, .5, 1, 10, d3.max(data, function(d) {
    return d.tlq;
  })]).range(["#fef198", "#cbb88b", "#9b827c", "#6f4d6b", "#500066"])

  if (casethreestatus === "blank") {
    c3y.domain([0, 0]).range([sideD.h / 2, sideD.h / 2]);
    c3r.domain([0, 200]).range([3, 3]);
    var x_translate = sideD.left + "," + ((sideD.h / 2) + sideD.top + 10)
  } else if (casethreestatus === "scatter") {
    c3y.domain([0, 0]).range([sideD.h / 2, sideD.h / 2]);
    c3r.domain([0, 200]).range([3, 3]);
    var x_translate = sideD.left + "," + (sideD.h + sideD.top);
  }
  // c3y = d3.scaleBand().domain(d3.range(case3num)).range([0, case3num * h]);

  var svg = d3.select(".case3").append("svg")
    .style("overlow", "visible")
    .attr("width", sideD.w + sideD.left + sideD.right)
    .attr("height", sideD.h + sideD.bottom + sideD.top);
  var legend = d3.select("#case3_header").append("svg")
    .attr("width", sideD.w + sideD.left + sideD.right)
    .attr("height", h)
    .style("margin-bottom", ".5rem")
    .style("margin-top", "1rem");
  svg.append("g").attr("class", "grect")
    .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")");
  svg.append("g").attr("class", "group3-behind")
    .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")");
  var g = svg.append("g").attr("class", "group3")
    .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")");
  var legendg = legend.append("g").attr("class", "c3legend")
    .attr("transform", "translate(" + sideD.left + ")");
  var xAxis = d3.axisBottom(c3x)
    // .tickSize(case3num * h)
    .tickSize(0)
    .tickFormat(d3.format(".2s"))
    .tickValues([2000000, 4000000, 6000000, 8000000, 10000000, 12000000, 14000000, 16000000, 18000000, 20000000, 22000000]);
  var yAxis = d3.axisLeft(c3y)
    .tickFormat(function(d) {
      if (casethreestatus === "blank") {
        return ""
      } else {
        if (d === 80) return d + " titles";
        return d;
      }
    })
    .tickSize(-sideD.w)

  // legendg.selectAll(".c3_legend_phase1_rect")
  //   .data(c3c.range())
  //   .enter().append("rect").attr("class", "c3_legend_phase1_rect")
  //   .attr("x", function(d, i) {
  //     return 30 + (15 * i);
  //   })
  //   .attr("y", 20)
  //   .attr("width", 15)
  //   .attr("height", 10)
  //   .style("fill", function(d) {
  //     return d;
  //   })
  //
  // legendg.append("text")
  //   .attr("class", "c3_legend_phase1_text")
  //   .attr("x", 0)
  //   .attr("y", 10)
  //   .style("font-weight", "bold")
  //   .text("PERFORMANCE VS EXPECATION")
  //
  // legendg.append("text")
  //   .attr("class", "c3_legend_phase1_text")
  //   .attr("x", 35)
  //   .attr("y", 25)
  //   .attr("dx", -3)
  //   .attr("dy", 4)
  //   .style("text-anchor", "end")
  //   .text("BELOW")
  //
  // legendg.append("text")
  //   .attr("class", "c3_legend_phase1_text")
  //   .attr("x", 30 + (15 * c3c.range().length) + 15)
  //   .attr("y", 25)
  //   .attr("dx", 3)
  //   .attr("dy", 4)
  //   .style("text-anchor", "start")
  //   .text("ABOVE")

  svg.append("g")
    .attr("class", "x axis c3axis")
    .attr("transform", "translate(" + x_translate + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "xlabel")
    .attr("x", sideD.w / 2)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .text("Population");
  svg.append("g")
    .attr("class", "y axis c3axis")
    .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")")
    .call(yAxis);

  var circle = g.selectAll(".city-circle")
    .data(data)
    .enter().append("circle").attr("class", "city-circle")
    .attr("cx", function(d) {
      return c3x(d.population)
    })
    .attr("cy", function(d) {
      return c3y(d.newvalues.length)
    })
    .attr("r", function(d) {
      return c3r(d.tlq)
    })
    .style("fill", function(d) {
      return c3c(d.tlq)
    })
  // .style("stroke", "#b5b5b5")
  // .style("opacity", .75)

}

function casethree_filter() {
  var filter = filters[level][league],
    total_titles = 0,
    total_pop = 0,
    h = 30,
    leader = 0,
    x_translate = sideD.left + "," + (sideD.h + 300);

  var data = case3data;
  data.forEach(function(d) {
    d.values = d.values.sort(function(a, b) {
      return d3.ascending(+a.year, +b.year);
    });
    d.newvalues = d.values.filter(function(d) {
      return d.year >= start && d.year <= end && $.inArray(d.sport, filter) > -1;
    });
    total_titles += d.newvalues.length;
    total_pop += d.population;
  });
  data = data.filter(function(d) {
    return d.newvalues.length > 0;
  });
  data.forEach(function(d) {
    d.tlq = (d.newvalues.length / d.population) / (total_titles / total_pop)
  });
  data = data.sort(function(a, b) {
    if (sortmode3 === "descend_tlq") return d3.descending(+a.tlq, +b.tlq) || d3.ascending(a.key, b.key)
    if (sortmode3 === "ascend_tlq") return d3.ascending(+a.tlq, +b.tlq) || d3.ascending(a.key, b.key)
    return d3.ascending(+a.population, +b.population) || d3.ascending(a.key, b.key);
  })
  if (casethreestatus === "ordered" || casethreestatus === "ordering") {
    var addData = data.slice(0, num - 1);
    var leadingcity = addData[0].key;
    if (local != undefined) {
      addData = addData.filter(function(d) {
        return d.key != local
      })
      data = data.filter(function(d, i) {
        if (d.key === local) rank = i;
        return d.key === local
      })
      Array.prototype.push.apply(data, addData);
    } else {
      data = addData
    }
  }

  c3y = d3.scaleLinear().domain([0, 80]).range([300, 0]);
  c3x = d3.scaleLinear().domain([0, 22000000]).range([0, sideD.w]);
  c3r = d3.scaleLinear().domain([0, 1, 20, d3.max(data, function(d) {
    return d.tlq;
  })]).range([2, 4, 8, 12])
  c3c = d3.scaleLinear().domain([0, .5, 1, 10, d3.max(data, function(d) {
    return d.tlq;
  })]).range(["#500066", "#6f4d6b", "#9b827c", "#cbb88b", "#fef198"])

  if (casethreestatus === "blank") {
    c3y.domain([0, 80]).range([150, 150]);
    c3r.domain([0, 200]).range([3, 3]);
    x_translate = sideD.left + "," + ((150) + sideD.top + 10);
  } else if (casethreestatus === "scattering" || casethreestatus === "scatter") {
    c3y.domain([0, 80]).range([300, 0]);
    c3r.domain([0, 200]).range([3, 3]);
    x_translate = sideD.left + "," + (300 + sideD.top);
  } else if (casethreestatus === "scattersized") {
    c3r.domain([0, 1, 20, d3.max(data, function(d) {
      return d.tlq;
    })]).range([1, 3, 8, 12]);
    x_translate = sideD.left + "," + (300 + sideD.top);
  } else if (casethreestatus === "ordered" || casethreestatus === "ordering") {
    var extent = d3.extent(data, function(d) {
      return d.tlq;
    });
    c3x = d3.scaleLinear().domain([0, 1, 10, extent[1]]).range([0, sideD.w / 3, sideD.w * (3 / 6), sideD.w - 25]);
    c3y = d3.scaleBand().domain(d3.range(case3num)).range([0, case3num * h]);
    x_translate = sideD.left + "," + (case3num * h);
  }

  var svg = d3.select(".case3 svg").transition()
    .attr("width", sideD.w + sideD.left + sideD.right)
    .attr("height", 300 + sideD.bottom + sideD.top);
  var g = d3.select(".group3");
  var legendg = d3.select(".c3legend")
  var gbehind = d3.select(".group3-behind");
  var grect = d3.select(".grect");
  var yAxis = d3.axisLeft(c3y)
    .tickFormat(function(d) {
      if (casethreestatus === "blank" || casethreestatus === "ordered" || casethreestatus === "ordering") {
        return ""
      } else {
        if (d === 80) return d + " titles";
        return d;
      }
    });


  if (casethreestatus === "ordered" || casethreestatus === "ordering") {
    yAxis.tickSize(0);

    var xAxis = d3.axisTop(c3x)
      .tickSize(0)
      // .tickValues([0, .5, 1, 5, 10, 120])
      .tickFormat(function(d) {
        return "";
      })

    svg.select(".y.axis.c3axis").transition().duration(250).call(yAxis);
    svg.select(".x.axis.c3axis").transition().duration(250).attr("transform", "translate(" + x_translate + ")").call(xAxis);
    svg.select(".xlabel").transition().style("opacity", 0)
  } else {
    yAxis.tickSize(-sideD.w);

    var xAxis = d3.axisBottom(c3x).tickValues([2000000, 4000000, 6000000, 8000000, 10000000, 12000000, 14000000, 16000000, 18000000, 20000000, 22000000])
      .tickSize(0)
      .tickFormat(d3.format(".2s"));

    svg.select(".y.axis.c3axis").transition().duration(250).call(yAxis);
    svg.select(".x.axis.c3axis").transition().duration(250).attr("transform", "translate(" + x_translate + ")").call(xAxis);
    svg.select(".xlabel").transition().style("opacity", 1)
  }

  if (casethreestatus === "scattering") {
    g.selectAll(".city-circle").transition().duration(250)
      .delay(250)
      .attr("cy", c3y(0))
      .transition().duration(function(d) {
        return 500 + (d.newvalues.length)
      })
      .delay(function(d, i) {
        return 250 + (i * 10);
      })
      .attr("cy", function(d) {
        return c3y(d.newvalues.length);
      });
  } else if (casethreestatus === "ordering") {
    var connect = gbehind.selectAll("line")
      .data(data, function(d) {
        return d.key;
      });
    connect.enter().append("line")
      .merge(connect).transition().duration(250)
      .attr("x1", c3x(1))
      .attr("x2", c3x(1))
      .attr("y1", function(d, i) {
        return c3y(i) + (h / 2)
      })
      .attr("y2", function(d, i) {
        return c3y(i) + (h / 2)
      })
      .style("stroke", function(d) {
        return c3c(d.tlq)
      })
      .style("stroke-width", 2)
      .transition().duration(250)
      .delay(function(d, i) {
        return 100 * i;
      })
      .attr("x2", function(d) {
        return c3x(d.tlq)
      })
      .style("stroke", function(d) {
        return c3c(d.tlq)
      });
    connect.exit().transition().duration(250).style("opacity", 0).remove();

    var circle = g.selectAll(".city-circle")
      .data(data, function(d) {
        return d.key
      })
    circle.enter().append("circle").attr("class", "city-circle")
      .merge(circle).transition().duration(250)
      .attr("cx", c3x(1))
      .attr("cy", function(d, i) {
        return c3y(i) + (h / 2)
      })
      .transition().duration(250)
      .delay(function(d, i) {
        return 100 * i
      })
      .attr("cx", function(d) {
        return c3x(d.tlq)
      })
    circle.exit().transition().duration(250).style("opacity", 0).remove();
  } else if (casethreestatus === "ordered") {
    var connect = gbehind.selectAll("line")
      .data(data, function(d) {
        return d.key;
      });
    connect.enter().append("line")
      .attr("x1", c3x(1))
      .attr("x2", c3x(1))
      .attr("y1", function(d, i) {
        return c3y(i) + (h / 2)
      })
      .attr("y2", function(d, i) {
        return c3y(i) + (h / 2)
      })
      .style("opacity", 0)
      .style("stroke", function(d) {
        return c3c(d.tlq)
      })
      .style("stroke-width", 2)
      .merge(connect).transition().duration(250)
      .attr("y1", function(d, i) {
        return c3y(i) + (h / 2)
      })
      .attr("y2", function(d, i) {
        return c3y(i) + (h / 2)
      })
      .attr("x2", function(d) {
        return c3x(d.tlq)
      })
      .style("stroke", function(d) {
        return c3c(d.tlq)
      })
      .style("opacity", 1);
    connect.exit().transition().duration(250).style("opacity", 0).remove();
  }

  if (casethreestatus === "ordering") {
    legendg.selectAll(".c3_legend_phase2_circle")
      .data(c3r.domain())
      .enter().append("circle").attr("class", "c3_legend_phase2_circle")
      .attr("cx", function(d, i) {
        if (d > 20) return (c3x(1) + ((c3r(d) * 4) + 8)) - 30;
        return (c3x(1) + (c3r(d) * 4)) - 30;
      })
      .attr("cy", 24)
      .attr("r", function(d) {
        return c3r(d);
      })
      .style("fill", function(d) {
        return c3c(d);
      })
      .style("opacity", 0)
      .transition().style("opacity", 1)

    // legendg.append("text")
    //   .attr("class", "c3_legend_phase2_text")
    //   .attr("x", c3x(1))
    //   .attr("y", 10)
    //   .attr("dx", 10)
    //   .style("font-weight", "bold")
    //   .style("text-anchor", "middle")
    //   .style("letter-spacing", "1px")
    //   .text("PERFORMANCE")
    //   .style("opacity", 0)
    //   .transition().style("opacity", 1)

    legendg.append("text")
      .attr("class", "c3_legend_phase2_text")
      .attr("x", c3x(1) - 25)
      .attr("y", 25)
      .attr("dx", -3)
      .attr("dy", 2)
      .style("text-anchor", "end")
      .style("font-size", 10)
      .style("opacity", 0)
      .text("BELOW EXPECTATION")
      .transition().style("opacity", 1)

    legendg.append("text")
      .attr("class", "c3_legend_phase2_text fontawesome")
      .attr("x", c3x(1) + 135)
      .attr("y", 25)
      .attr("dy", 2)
      .style("text-anchor", "start")
      .style("font-size", 10)
      .style("opacity", 0)
      .text("\uf178")
      .transition().style("opacity", 1)

    legendg.append("text")
      .attr("class", "c3_legend_phase2_text")
      .attr("x", c3x(1) + 40)
      .attr("y", 25)
      .attr("dx", 6)
      .attr("dy", 2)
      .style("text-anchor", "start")
      .style("font-size", 10)
      .style("opacity", 0)
      .text("ABOVE EXPECTATION")
      .transition().style("opacity", 1)

    legendg.append("text")
      .attr("class", "c3_legend_phase2_text fontawesome")
      .attr("x", c3x(1) - 120)
      .attr("y", 25)
      .attr("dy", 2)
      .style("text-anchor", "end")
      .style("font-size", 10)
      .style("opacity", 0)
      .text("\uf177")
      .transition().style("opacity", 1)

    var rect = grect.selectAll("rect")
      .data(data)
      .enter().append("rect")
      .attr("x", 0)
      .attr("y", function(d, i) {
        return c3y(i)
      })
      .attr("width", sideD.w)
      .attr("height", h)
      .style("fill", "rgba(247,247,247,0)")
      .on("mouseover", function(d, i) {
        d3.select("#label-count-" + i).style("opacity", 1)
        d3.select("#label-" + i).style("font-weight", "bold")
      })
      .on("mouseout", function() {
        d3.selectAll(".label-count").style("opacity", 0)
        d3.selectAll(".label").style("font-weight", "normal")
      });
  }

  if (casethreestatus === "ordering" || casethreestatus === "ordered") {

    var text_count = g.selectAll(".label-count")
      .data(data, function(d) {
        return d.key;
      })
    text_count.enter().append("text").attr("class", "label-count")
      .merge(text_count)
      .attr("id", function(d, i) {
        return "label-count-" + i;
      })
      .attr("x", function(d) {
        if (d.tlq > 1) return c3x(d.tlq) + c3r(d.tlq)
        return c3x(d.tlq) - c3r(d.tlq);
      })
      .attr("y", function(d, i) {
        return c3y(i) + h / 2;
      })
      .attr("dx", function(d) {
        if (d.tlq > 1) return 12;
        return -12;
      })
      .attr("dy", 5)
      .style("text-anchor", function(d) {
        if (d.tlq > 1) return "start";
        return "end";
      })
      .style("opacity", 0)
      .text(function(d) {
        return d.tlq.toFixed(1) + "x";
      })
    text_count.exit().remove();

    var text = g.selectAll(".label")
      .data(data, function(d) {
        return d.key;
      });
    text.enter().append("text").attr("class", "label")
      .attr("id", function(d, i) {
        return "label-" + i;
      })
      .attr("x", c3x(1))
      .attr("y", function(d, i) {
        return c3y(i) + (h / 2)
      })
      .style("opacity", 0)
      .merge(text).transition().duration(500)
      .attr("id", function(d, i) {
        return "label-" + i;
      })
      .attr("x", c3x(1))
      .attr("y", function(d, i) {
        return c3y(i) + (h / 2)
      })
      .attr("dx", function(d) {
        if (d.tlq > 1) return -12;
        return 12;
      })
      .attr("dy", 5)
      .style("text-anchor", function(d) {
        if (d.tlq > 1) return "end";
        return "start";
      })
      .style("opacity", 1)
      .text(function(d) {
        return d.key;
      });
    text.exit().transition().duration(500).attr("y", sideD.h).style("opacity", 0).remove();

    var basecircle = gbehind.selectAll(".base-circle")
      .data(data, function(d) {
        return d.key;
      });
    basecircle.enter().append("circle").attr("class", "base-circle")
      .attr("cx", c3x(1))
      .attr("cy", function(d, i) {
        return c3y(i) + (h / 2)
      })
      .attr("r", 3)
      .style("fill", "black")
      .style("opacity", 0)
      .merge(basecircle).transition().duration(250)
      .attr("cy", function(d, i) {
        return c3y(i) + (h / 2)
      })
      .style("opacity", 1);
    basecircle.exit().transition().duration(250).style("opacity", 0).remove();
  }

  if (casethreestatus != "ordered" && casethreestatus != "ordering") {
    g.selectAll(".label").transition().attr("y", sideD.h).style("opacity", 0).remove();
    gbehind.selectAll("line").transition().style("opacity", 0).remove();
    gbehind.selectAll("circle").transition().style("opacity", 0).remove();
    grect.selectAll("rect").remove();
    g.selectAll(".label-count").remove();
    d3.selectAll(".c3_legend_phase2_circle, .c3_legend_phase2_text").transition().style("opacity", 0).style("display", "none").remove();
  }

  if (casethreestatus != "scattering" && casethreestatus != "ordering") {
    var circle = g.selectAll(".city-circle")
      .data(data, function(d) {
        return d.key;
      })
    circle.enter().append("circle").attr("class", "city-circle")
      .attr("cx", 0)
      .attr("cy", function(d, i) {
        if (casethreestatus === "ordered") return c3y(i) + (h / 2)
        return c3y(d.newvalues.length);
      })
      .attr("r", 0)
      .style("opacity", 0)
      .merge(circle).transition().duration(250)
      .delay(function(d, i) {
        return i * 3;
      })
      .attr("cx", function(d) {
        if (casethreestatus === "ordered") return c3x(d.tlq)
        return c3x(d.population);
      })
      .attr("cy", function(d, i) {
        if (casethreestatus === "ordered") return c3y(i) + (h / 2)
        return c3y(d.newvalues.length);
      })
      .attr("r", function(d) {
        return c3r(d.tlq);
      })
      .style("fill", function(d) {
        return c3c(d.tlq);
      })
      // .style("stroke", "black")
      .style("opacity", 1)
    circle.exit().transition().duration(1000).delay(function(d, i) {
        return i * 3;
      })
      .attr("cy", sideD.h)
      .attr("r", 0)
      .style("opacity", 0)
      .remove();
  };
}

function casethree_update(index, prev) {
  if (index === 11) {
    casethreestatus = "blank";
    casethree_filter();
  } else if (index === 12) {
    if (prev === 11) {
      casethreestatus = "scattering";
      casethree_filter();
      casethreestatus = "scatter";
    } else {
      casethreestatus = "scatter";
      casethree_filter();
    }
  } else if (index === 13) {
    casethreestatus = "scattersized";
    sortmode3 = "descend_basic";
    casethree_filter();
  } else if (index === 14) {
    if (prev === 13) {
      casethreestatus = "ordering"
      sortmode3 = "descend_tlq";
      casethree_filter();
      casethreestatus = "ordered";
    } else {
      sortmode3 = "descend_tlq";
      casethreestatus = "ordered";
      casethree_filter();
    }
  } else if (index === 15) {
    sortmode3 = "ascend_tlq";
    casethree_filter();
  }
}

function dynasties_and_droughts(data) {
  data.forEach(function(d, i) {
    var index = i;
    var dynasties = {
        startyears: [],
        endyears: [],
        teams: [],
        dynasties: []
      },
      prettygooddynasties = {
        startyears: [],
        endyears: [],
        teams: [],
        prettygooddynasties: []
      },
      dryspells = {
        startyears: [],
        endyears: [],
        teams: [],
        dryspells: []
      }

    d.newseasons.forEach(function(d, i) {
      var title = false,
        prettygood = false,
        dry = true;
      d.newteams.forEach(function(d) {
        if (d.result === "title") title = true;
        if (d.result === "title" || d.result === "finals" || d.result === "finalFour") prettygood = true;
      })
      if (title || prettygood) dry = false;
      d.title = title;
      d.prettygood = prettygood;
      d.dry = dry;
    })
    d.dynastyseasons = d.newseasons.filter(function(d) {
      return d.title === true;
    })
    d.prettygoodseasons = d.newseasons.filter(function(d) {
      return d.prettygood === true;
    })
    d.dryseasons = d.newseasons.filter(function(d) {
      return d.dry === true;
    })
    for (var n = 0; n < d.dynastyseasons.length; n++) {
      d.dynastyseasons[n].dynasty = false;
      if (n > 0 && d.dynastyseasons[n - 1].season === d.dynastyseasons[n].season - 1) d.dynastyseasons[n].dynasty = true;
      if (n < d.dynastyseasons.length - 1 && d.dynastyseasons[n + 1].season === d.dynastyseasons[n].season + 1) d.dynastyseasons[n].dynasty = true;
    }
    for (var n = 0; n < d.prettygoodseasons.length; n++) {
      d.prettygoodseasons[n].prettygood = false;
      if (n > 0 && d.prettygoodseasons[n - 1].season === d.prettygoodseasons[n].season - 1) d.prettygoodseasons[n].prettygood = true;
      if (n < d.prettygoodseasons.length - 1 && d.prettygoodseasons[n + 1].season === d.prettygoodseasons[n].season + 1) d.prettygoodseasons[n].prettygood = true;
    }
    for (var n = 0; n < d.dryseasons.length; n++) {
      d.dryseasons[n].dry = false;
      if (n > 0 && d.dryseasons[n - 1].season === d.dryseasons[n].season - 1) d.dryseasons[n].dry = true;
      if (n < d.dryseasons.length - 1 && d.dryseasons[n + 1].season === d.dryseasons[n].season + 1) d.dryseasons[n].dry = true;
    }
    d.dynastyseasons = d.dynastyseasons.filter(function(d) {
      return d.dynasty === true;
    })
    d.prettygoodseasons = d.prettygoodseasons.filter(function(d) {
      return d.prettygood === true;
    })
    d.dryseasons = d.dryseasons.filter(function(d) {
      return d.dry === true;
    })
    for (var n = 0; n < d.dynastyseasons.length; n++) {
      var seasonteams = {
        year: d.dynastyseasons[n].season,
        teams: []
      };
      if (n === 0) d.dynastyseasons[n].status = "start";
      if (n > 0 && d.dynastyseasons[n].season - d.dynastyseasons[n - 1].season === 1) d.dynastyseasons[n].status = "mid";
      if (n < d.dynastyseasons.length - 1 && d.dynastyseasons[n + 1].season - d.dynastyseasons[n].season > 1) d.dynastyseasons[n].status = "end";
      if (n > 0 && d.dynastyseasons[n].season - d.dynastyseasons[n - 1].season > 1) d.dynastyseasons[n].status = "start";
      if (n === d.dynastyseasons.length - 1) d.dynastyseasons[n].status = "end";
      if (d.dynastyseasons[n].status === "start") dynasties.startyears.push(d.dynastyseasons[n].season);
      if (d.dynastyseasons[n].status === "end") dynasties.endyears.push(d.dynastyseasons[n].season);

      d.dynastyseasons[n].teams.forEach(function(d) {
        if (d.result === "title") seasonteams.teams.push(d.team)
      })
      dynasties.teams.push(seasonteams)
    }
    for (var n = 0; n < d.prettygoodseasons.length; n++) {
      var seasonteams = {
        year: d.prettygoodseasons[n].season,
        teams: []
      };
      if (n === 0) d.prettygoodseasons[n].status = "start";
      if (n > 0 && d.prettygoodseasons[n].season - d.prettygoodseasons[n - 1].season === 1) d.prettygoodseasons[n].status = "mid";
      if (n < d.prettygoodseasons.length - 1 && d.prettygoodseasons[n + 1].season - d.prettygoodseasons[n].season > 1) d.prettygoodseasons[n].status = "end";
      if (n > 0 && d.prettygoodseasons[n].season - d.prettygoodseasons[n - 1].season > 1) d.prettygoodseasons[n].status = "start";
      if (n === d.prettygoodseasons.length - 1) d.prettygoodseasons[n].status = "end";
      if (d.prettygoodseasons[n].status === "start") prettygooddynasties.startyears.push(d.prettygoodseasons[n].season);
      if (d.prettygoodseasons[n].status === "end") prettygooddynasties.endyears.push(d.prettygoodseasons[n].season);

      d.prettygoodseasons[n].teams.forEach(function(d) {
        if (d.result === "title" || d.result === "finals" || d.result === "finalFour") seasonteams.teams.push(d.team)
      })
      prettygooddynasties.teams.push(seasonteams)
    }
    for (var n = 0; n < d.dryseasons.length; n++) {
      var seasonteams = {
        year: d.dryseasons[n].season,
        teams: []
      };
      if (n === 0) d.dryseasons[n].status = "start";
      if (n > 0 && d.dryseasons[n].season - d.dryseasons[n - 1].season === 1) d.dryseasons[n].status = "mid";
      if (n < d.dryseasons.length - 1 && d.dryseasons[n + 1].season - d.dryseasons[n].season > 1) d.dryseasons[n].status = "end";
      if (n > 0 && d.dryseasons[n].season - d.dryseasons[n - 1].season > 1) d.dryseasons[n].status = "start";
      if (n === d.dryseasons.length - 1) d.dryseasons[n].status = "end";
      if (d.dryseasons[n].status === "start") dryspells.startyears.push(d.dryseasons[n].season);
      if (d.dryseasons[n].status === "end") dryspells.endyears.push(d.dryseasons[n].season);

      d.dryseasons[n].teams.forEach(function(d) {
        if (d.result != "title" && d.result != "finals" && d.result != "finalFour") seasonteams.teams.push(d.team)
      })
      dryspells.teams.push(seasonteams)
    }
    dynasties.startyears.forEach(function(d, i) {
      var dynastyteams = [];
      for (var j = 0; j < dynasties.teams.length; j++) {
        if (dynasties.teams[j].year >= d && dynasties.teams[j].year <= dynasties.endyears[i]) Array.prototype.push.apply(dynastyteams, dynasties.teams[j].teams);
      }
      var dynasty = {
        start: d,
        end: dynasties.endyears[i],
        time: dynasties.endyears[i] - d + 1,
        teams: Array.from(new Set(dynastyteams))
      }
      dynasties.dynasties.push(dynasty)
    })
    prettygooddynasties.startyears.forEach(function(d, i) {
      var dynastyteams = [];
      for (var j = 0; j < prettygooddynasties.teams.length; j++) {
        if (prettygooddynasties.teams[j].year >= d && prettygooddynasties.teams[j].year <= prettygooddynasties.endyears[i]) Array.prototype.push.apply(dynastyteams, prettygooddynasties.teams[j].teams);
      }
      var dynasty = {
        start: d,
        end: prettygooddynasties.endyears[i],
        time: prettygooddynasties.endyears[i] - d + 1,
        teams: Array.from(new Set(dynastyteams))
      }
      prettygooddynasties.prettygooddynasties.push(dynasty)
    })
    dryspells.startyears.forEach(function(d, i) {
      var dynastyteams = [];
      for (var j = 0; j < dryspells.teams.length; j++) {
        if (dryspells.teams[j].year >= d && dryspells.teams[j].year <= dryspells.endyears[i]) Array.prototype.push.apply(dynastyteams, dryspells.teams[j].teams);
      }
      var dynasty = {
        start: d,
        end: dryspells.endyears[i],
        time: dryspells.endyears[i] - d + 1,
        teams: Array.from(new Set(dynastyteams))
      }
      dryspells.dryspells.push(dynasty)
    })
    d.dynasties = dynasties.dynasties;
    d.prettygooddynasties = prettygooddynasties.prettygooddynasties;
    d.dryspells = dryspells.dryspells;
  })
  data.forEach(function(d) {
    d.dynasties.sort(function(a, b) {
      return d3.descending(+a.time, +b.time)
    })
    d.prettygooddynasties.sort(function(a, b) {
      return d3.descending(+a.time, +b.time)
    })
    d.dryspells.sort(function(a, b) {
      return d3.descending(+a.time, +b.time)
    })
    d.max_dynasty = 0;
    d.max_dryspell = 0;
    d.max_prettygooddynasty = 0;
    if (d.dynasties.length > 0) d.max_dynasty = d.dynasties[0].time;
    if (d.dryspells.length > 0) d.max_dryspell = d.dryspells[0].time;
    if (d.prettygooddynasties.length > 0) d.max_prettygooddynasties = d.prettygooddynasties[0].time;
  })
  data.sort(function(a, b) {
    if (sortmode2 === "descend_max_dynasty") return d3.descending(+a.max_dynasty, +b.max_dynasty) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_max_prettygooddynasty") return d3.descending(+a.max_prettygooddynasty, +b.max_prettygooddynasty) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_max_dryspell") return d3.descending(+a.dryseasons.length, +b.dryseasons.length) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "ascend_max_dryspell") return d3.ascending(+a.dryseasons.length, +b.dryseasons.length) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_total_dynasties") return d3.descending(+a.dynasties.length, +b.dynasties.length) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_total_dryspells") return d3.descending(+a.dryspells.length, +b.dryspells.length) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_total_prettygooddynasties") return d3.descending(+a.prettygooddynasties.length, +b.prettygooddynasties.length) || d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
  })
  return data;
}

function getLocal(metros) {
  var mindif = 99999;
  var closest;

  metros.forEach(function(metros) {
    searchArray.push(metros.metro)
  })

  for (i = 0; i < metros.length; ++i) {
    var dif = PythagorasEquirectangular(local_coords[0], local_coords[1], parseArray(metros[i].lngLat)[1], parseArray(metros[i].lngLat)[0]);
    if (dif < mindif) {
      closest = i;
      mindif = dif;
    }
  }
  if (metros[closest] != undefined) local = metros[closest].metro
  // local = "New York Metro Area";

  if (local != undefined) {
    $("#citysearch-left").attr("value", local)
    $("#subtitle-user-city").html("And is " + local + " the winningest city in North American sports?")
    d3.select("#subtitle-user-city").transition().duration(500).delay(100).style("opacity", 1);
    $("#groundrules-user-city").html(local + "? Or maybe it&rsquo;s Green Bay, Wisconsin")
    d3.select("#subtitle-user-city").transition().duration(500).delay(100).style("opacity", 1);
    $("#groundrules-filter-city").html("It looks like you&rsquo;re in " + local + ". Is this right?")
    if (local === "New York Metro Area") $("#groundrules-user-biggercity").html("Los Angeles, California")
  } else {
    $("#subtitle-user-city").html("The Winningest Cities in North American Sports")
    d3.select("#subtitle-user-city").transition().duration(500).delay(0).style("opacity", 1);
    $("#groundrules-user-city").html("Is it Green Bay, Wisconsin")
  }

  d3.selectAll(".intro-fade").transition().duration(500).delay(500).style("opacity", 1);

  for (var i = 0; i < 4; i++) {
    d3.select("#intro-emoji-" + i).transition().duration(500).delay(500 + 100 * i).style("opacity", 1)
  }
}

// SUPPLEMENTARY, MY DEAR WATSON
function camelize(str) {
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function parseArray(value) {
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

function ipLookup() {
  $.ajax('http://ip-api.com/json')
    .then(
      function success(response) {
        local_coords.push(response.lat, response.lon)
      }
    );
}

function getTextWidth(text, font) {
  var canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}

function remove_duplicates(arr) {
  var obj = {};
  var ret_arr = [];
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]] = true;
  }
  for (var key in obj) {
    ret_arr.push(key);
  }
  return ret_arr;
}

function replaceSports(str) {
  return str.replace("mlb", "MLB").replace("nba", "NBA").replace("nfl", "NFL").replace("nhl", "NHL").replace("mls", "MLS").replace("cfl", "CFL").replace("baseball_m", "Baseball (M)").replace("basketball_w", "Basketball (W)").replace("basketball_m", "Basketball (M)").replace("football_m", "Football (M)").replace("soccer_w", "Soccer (W)").replace("volleyball_w", "Volleyball (W)");
}

function filterConvert(league, level) {
  if (level === "all-levels") return "all sports"
  if (level === "pro" && league === "all-leagues") return "pro sports"
  if (level === "pro" && league === "big4") return "the big 4 leagues"
  if (level === "pro" && league != "all-leagues" && league != "big4") return "the " + replaceSports(league)
  if (level === "college" && league === "all-sports") return "college sports"
  if (level === "college" && league != "all-sports") return "college " + replaceSports(league)
}

function getTextWidth(text, font) {
  var canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}
//