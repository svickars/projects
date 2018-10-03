// MISSION WORLDWIDE
var small_screen, medium_screen, large_screen, windowW, windowH, leader = 0;
var local_coords = [],
  searchArray = [],
  sortmode = "descend_basic",
  sortmode2 = "descend_seasons",
  sortmode3 = "descend_basic",
  local, level, league, start, end;
var sideD, c1x, c1y, c2x, c2y, c3x, c3y, c3r, c3c, num = 11,
  case2num = 11,
  case3num = 11,
  radius = d3.scaleLinear().domain([0, 148]).range([3, 2]),
  casetwodrawn = false,
  casethreestatus = "blank";

var c1rectO = 1,
  c1expO = 0

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

var cLeagues = {
    mlb: "#beaed4",
    cfl: "#7fc97f",
    mls: "#fdc086",
    nba: "#ccba15",
    nfl: "#f0027f",
    nhl: "#bf5b17",
    ncaa: "#386cb0",
    baseball_m: "#386cb0",
    basketball_m: "#386cb0",
    basketball_w: "#386cb0",
    football_m: "#386cb0",
    soccer_w: "#386cb0",
    volleyball_w: "#386cb0"
  },
  cEvents = {
    title: "#f9ed35",
    finals: "#a17bff",
    finalFour: "#fc545d"
  }

var leagues = ["MLB", "NBA", "NFL", "NHL", "CFL", "MLS", "NCAA"],
  events = [{
    "event": "title",
    "colour": cEvents.title
  }, {
    "event": "finals appearance",
    "colour": cEvents.finals
  }, {
    "event": "final four appearance",
    "colour": cEvents.finalFour
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
    num = 21;
    case2num = 21;
    case3num = 21;
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
        local = $("#citysearch-left").val()
        caseone_filter();
        if (casetwodrawn) casetwo_filter();
      },
      onKeyEnterEvent: function() {
        local = $("#citysearch-left").val()
        caseone_filter();
        if (casetwodrawn) casetwo_filter();
      }
    }
  };
  $("#citysearch-left").easyAutocomplete(options);

  // Case One Switches
  $("#switch_actual").on("click", function() {
    $("#switch_actual").toggleClass("isactive")
    $("#switch_expected").toggleClass("isactive")
    caseone_update(1)
  })
  $("#switch_expected").on("click", function() {
    $("#switch_actual").toggleClass("isactive")
    $("#switch_expected").toggleClass("isactive")
    caseone_update(2)
  })
  $("#switch_high_diff").on("click", function() {
    $("#switch_high_diff").toggleClass("isactive")
    $("#switch_low_diff").toggleClass("isactive")
    sortmode = "descend_diff"
    caseone_filter()
  })
  $("#switch_low_diff").on("click", function() {
    $("#switch_high_diff").toggleClass("isactive")
    $("#switch_low_diff").toggleClass("isactive")
    sortmode = "ascend_diff"
    caseone_filter()
  })
  $("#showMoreC1").on("click", function() {
    num += 10
    $("#case2_scrolly").css("margin-top", ((num - 1) * 30) - 500 + "px")
    caseone_filter()
  })
}

function caseone() {
  var filter = filters[level][league],
    total_titles = 0,
    total_seasons = 0,
    h = 30,
    rank;
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
      leader = 0;
      $("#step1_local").html("");
      $("#step1_totalseasons_local").html("")
      $("#step2_local").html("")
      $("#step2_howmany_local").html("")
    } else {
      leader = 1;
      $("#step1_local").html("(" + local + " teams have played ");
      $("#step1_totalseasons_local").html(data[0].local_seasons + ")")
      $("#step2_local").html("(" + local + " has a ")
      $("#step2_howmany_local").html(((data[0].newvalues.length - data[0].expected).toFixed(1) < 0 ? "" : "+") + (data[0].newvalues.length - data[0].expected).toFixed(1) + " differential)")
    }
    $("#step0_rank").html(rank);
    $("#step0_leader").html(data[leader].key);
  }

  $("#step1_leader").html(leadingcity.substring(0, leadingcity.length - 4))
  if (data[leader].key === "New York Metro Area") $("#step1_leader").html("New York Metro Area");
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
      return cLeagues[d.toLowerCase()]
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

  var text = g.selectAll(".label")
    .data(data)
    .enter().append("text").attr("class", function(d, i) {
      return "label c1label-" + i
    })
    .attr("x", c1x(0) - 10)
    .attr("y", function(d, i) {
      return c1y(i)
    })
    .attr("dy", 16)
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
  var group = g.selectAll(".c1rect")
    .data(data)
    .enter().append("g").attr("class", "c1rect")
  var rect = group.selectAll("rect").attr("class", "rect")
    .data(function(d, i) {
      return d.newvalues
    })
    .enter().append("rect")
    .attr("class", function(d) {
      return "c1rect-" + d.i
    })
    .attr("x", function(d) {
      return c1x(d.n)
    })
    .attr("y", function(d) {
      return c1y(d.i)
    })
    .attr("width", 2)
    .attr("height", 20)
    .style("fill", function(d) {
      return cLeagues[d.sport]
    })

} //end caseone

function caseone_filter() {
  var filter = filters[level][league],
    total_titles = 0,
    total_seasons = 0,
    h = 30,
    rank;
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
  var addData = data.slice(0, num - 1);
  if (addData[0] != undefined) {
    var leadingcity = addData[0].key;
  } else {
    var leadingcity = "Greater Los Angeles, CA"
  }
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
  data.forEach(function(d, i) {
    d.newvalues.forEach(function(d) {
      d.i = i;
    });
  })

  var filtertext = filterConvert(league, level)
  $("#step0_filter").html(filtertext)
  $("#step0_start").html(start)
  $("#step0_end").html(end)
  if (local != undefined) {
    if (leadingcity === local) {
      leader = 0;
      $("#step1_local").html("");
      $("#step1_totalseasons_local").html("")
      $("#step2_local").html("")
      $("#step2_howmany_local").html("")
    } else {
      leader = 1;
      $("#step1_local").html("(" + local + " teams have played ");
      $("#step1_totalseasons_local").html(data[0].local_seasons + ")")
      $("#step2_local").html("(" + local + " has a ")
      $("#step2_howmany_local").html(((data[0].newvalues.length - data[0].expected).toFixed(1) < 0 ? "" : "+") + (data[0].newvalues.length - data[0].expected).toFixed(1) + " differential)")
    }
    $("#step0_rank").html(rank);
  }

  $("#step0_leader").html(leadingcity);
  $("#step1_leader").html(leadingcity.substring(0, leadingcity.length - 4))
  $("#step2_leader").html(leadingcity.substring(0, leadingcity.length - 4))
  if (leadingcity === "New York Metro Area") $("#step1_leader").html("New York Metro Area");
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

  var xAxis = d3.axisTop(c1x)
    .tickSize(num * h);
  d3.select(".c1axis").transition()
    .attr("transform", "translate(" + sideD.left + "," + (num * h) + ")")
    .call(xAxis);

  var text = g.selectAll(".label")
    .data(data, function(d) {
      return d.key;
    })
  text.enter().append("text").attr("class", function(d, i) {
      return "label c1label-" + i
    })
    .attr("x", 0)
    .attr("y", function(d, i) {
      return c1y(i)
    })
    .attr("dy", 16)
    .style("text-anchor", "end")
    .style("opacity", 0)
    .text(function(d, i) {
      return d.key
    })
    .merge(text).transition().duration(500)
    .attr("class", function(d, i) {
      return "label c1label-" + i
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

  var group = g.selectAll(".c1rect").data(data)

  group.enter().append("g").attr("class", "c1rect").merge(group)
  group.exit().remove()

  var rect = group.selectAll("rect")
    .data(function(d, i) {
      return d.newvalues
    });
  rect.enter().append("rect")
    .attr("x", c1x(0))
    .attr("y", function(d, i) {
      return c1y(d.i)
    })
    .attr("width", 0)
    .attr("height", 20)
    .style("fill", function(d) {
      return cLeagues[d.sport]
    })
    .style("opacity", 0)
    .merge(rect).transition().duration(500).delay(function(d, i) {
      return i
    })
    .attr("class", function(d) {
      return "c1rect-" + d.i
    })
    .attr("x", function(d) {
      return c1x(d.n)
    })
    .attr("y", function(d) {
      return c1y(d.i)
    })
    .attr("width", 2)
    .style("fill", function(d) {
      return cLeagues[d.sport]
    })
    .style("opacity", c1rectO)
  rect.exit().transition().duration(500)
    .delay(function(d, i) {
      return 148 - i * 3
    })
    // .ease(d3.easeSin)
    .attr("y", sideD.h)
    .style("opacity", 0)
    .remove();

}

function caseone_update(index, prev) {
  var g = d3.select(".group");
  var rect = g.selectAll("rect");
  var actual = g.selectAll(".c1act");
  var expected = g.selectAll(".c1exp");
  var connect = g.selectAll(".c1connect");
  var text_count = g.selectAll(".count");
  var h = 30;

  c1x = d3.scaleLinear().domain([0, 80]).range([150, sideD.w]);
  c1y = d3.scaleBand().domain(d3.range(num)).range([0, num * h]);

  if (index === 0) {
    g.selectAll("rect:not(.c1rect-" + leader + ")").transition().duration(250).style("opacity", 1)
    g.selectAll(".label:not(.c1label-" + leader + ")").transition().duration(250).style("opacity", 1)
    g.selectAll(".count:not(.c1label_count-" + leader + ")").transition().duration(250).style("opacity", 1)
  } else if (index === 1) {
    c1rectO = 1;
    c1expO = 0;

    sortmode = "descend_basic";
    if (prev === 0) {
      num = 21
      if (small_screen) num = 11;
      caseone_filter();
      g.selectAll("rect:not(.c1rect-" + leader + ")").transition().duration(250).style("opacity", .1)
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

    g.selectAll("rect").transition().duration(500).delay(function(d) {
        return d.n * 3
      })
      .attr("y", function(d) {
        if (d.metro === local) return c1y(0) + h / 2
        return c1y(d.i) + h / 2
      })
      .attr("height", 0);

    g.selectAll(".label:not(.c1label-" + leader + ")").transition().delay(250).style("opacity", c1expO)

  } else if (index === 3) {
    sortmode = "descend_diff";
    d3.select("#showMoreC1").transition().style("opacity", 0).style("display", "none")
    c1rectO = 0;
    c1expO = 1;
    d3.selectAll(".legend_case1_phase1").transition().style("opacity", c1rectO);
    d3.selectAll(".legend_case1_phase2").transition().style("opacity", c1expO);
    caseone_filter()
  } else if (index === 4) {
    if (prev === 3 && !casetwodrawn) casetwo();
    // sortmode = "ascend_diff";
    sortmode = "descend_basic";
    d3.select("#showMoreC1").style("display", "block").transition().style("opacity", 1)
    caseone_filter()
  } else if (index === 5) {} else if (index === 6) {
    caseone_filter();
  }
}

function casetwo() {
  casetwodrawn = true;
  var filter = filters[level][league],
    h = 30;

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
  var addData = data.slice(0, case2num - 1);
  if (local != undefined) {
    addData = addData.filter(function(d) {
      return d.metro != local
    })
    data = data.filter(function(d) {
      return d.metro === local
    })
    Array.prototype.push.apply(data, addData);
  } else {
    data = addData
  }
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

  tip = d3.tip().attr("class", "d3-tip").html(function(d) {
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

    if (titles.length > 0) titlesDisp = "<h2 style='color:" + cEvents.title + "'>Titles</h2><p>" + titles + "</p>";
    if (finals.length > 0) finalsDisp = "<h2 style='color:" + cEvents.finals + "'>Finals Appearances</h2><p>" + finals + "</p>";
    if (finalFours.length > 0) finalFoursDisp = "<h2 style='color:" + cEvents.finalFour + "'>Final Four Appearances</h2><p>" + finalFours + "</p>";
    return "<h1>" + d.season + "</h1>" + titlesDisp + finalsDisp + finalFoursDisp;
  }).direction("e").offset([25, 0]);

  svg.call(tip)

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

  var text = g.selectAll(".label")
    .data(data)
    .enter().append("text").attr("class", "label")
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
      return cEvents[d.result]
    })

  var tiprect = group.selectAll(".tiprect")
    .data(function(d) {
      return d.newseasons
    })
    .enter().append("line").attr("class", "tiprect")
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
      return c2y(d.i) + 10 - (d.newteams.length * 4)
    })
    .style("stroke-linecap", "round")
    .style("stroke-width", 10)
    .style("stroke", "rgba(0,0,0,0)")
    .on("mouseover", function(d) {
      if (d.newteams.length > 0) tip.show(d);
    })
    .on("mouseout", tip.hide)
}

function casetwo_filter() {
  var filter = filters[level][league],
    h = 30;

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
  data.sort(function(a, b) {
    if (sortmode2 === "descend_seasons") return d3.descending(+a.newseasons.length, +b.newseasons.length) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_results") return d3.descending(+a.results, +b.results) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_teams") return d3.descending(+a.teams, +b.teams) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_titles") return d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro);
    if (sortmode2 === "descend_conversion_seasons") return d3.descending(+a.conversion, +b.conversion) || d3.ascending(a.metro, b.metro);
  })
  var addData = data.slice(0, case2num - 1);
  if (local != undefined) {
    addData = addData.filter(function(d) {
      return d.metro != local
    })
    data = data.filter(function(d) {
      return d.metro === local
    })
    Array.prototype.push.apply(data, addData);
  } else {
    data = addData
  }
  data.forEach(function(d, i) {
    d.newseasons.forEach(function(d) {
      var row = i;
      d.i = row;
      var y = d.season
      d.newteams = d.newteams.filter(function(d) {
        return d.result != "season"
      })
      d.newteams.sort(function(a, b) {
        return d3.descending(a.result, b.result);
      });
      d.newteams.forEach(function(d) {
        d.row = row
        d.y = y
      })
    });
  })

  var svg = d3.select(".case2 svg").transition()
    .attr("width", sideD.w + sideD.left + sideD.right)
    .attr("height", case2num * h);
  var g = d3.select(".group2")
  c2x.domain([start, end]).range([150, sideD.w]);
  c2y.domain(d3.range(case2num)).range([0, case2num * h]);

  tip = d3.tip().attr("class", "d3-tip").html(function(d) {
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

    if (titles.length > 0) titlesDisp = "<h2 style='color:" + cEvents.title + "'>Titles</h2><p>" + titles + "</p>";
    if (finals.length > 0) finalsDisp = "<h2 style='color:" + cEvents.finals + "'>Finals Appearances</h2><p>" + finals + "</p>";
    if (finalFours.length > 0) finalFoursDisp = "<h2 style='color:" + cEvents.finalFour + "'>Final Four Appearances</h2><p>" + finalFours + "</p>";
    return "<h1>" + d.season + "</h1>" + titlesDisp + finalsDisp + finalFoursDisp;
  }).direction("s").offset([25, 0]);

  svg.call(tip)

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
  text.enter().append("text").attr("class", "label")
    .attr("x", 0)
    .attr("y", function(d, i) {
      return c1y(i)
    })
    .attr("dy", 16)
    .style("text-anchor", "end")
    .style("opacity", 0)
    .text(function(d, i) {
      return d.metro
    })
    .merge(text).transition().duration(500)
    .attr("x", function(d) {
      if (d.newseasons[0] === undefined) return c2x(end);
      return c2x(d.newseasons[0].season) - 10
    })
    .attr("y", function(d, i) {
      return c1y(i)
    })
    .style("opacity", 1)
  text.exit().transition().duration(500)
    .attr("y", sideD.h)
    .style("opacity", 0)
    .remove();

  var group = g.selectAll(".c2rect").data(data);
  group.enter().append("g").attr("class", "c1rect").merge(group);
  group.exit().remove();

  var rect = group.selectAll(".season")
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

  var subgroup = group.selectAll(".c2subrect").data(function(d) {
    return d.newseasons;
  })
  subgroup.enter().append("g").attr("class", "c2subrect").merge(subgroup);
  subgroup.exit().remove();

  var subrect = subgroup.selectAll(".result")
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
      return cEvents[d.result]
    })
  subrect.exit().transition().duration(500).style("opacity", 0).remove();

  var tiprect = group.selectAll(".tiprect")
    .data(function(d) {
      return d.newseasons
    })
  tiprect.enter().append("line").attr("class", "tiprect")
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
      return c2y(d.i) + 10 - (d.newteams.length * 4)
    })
    .style("stroke-linecap", "round")
    .style("stroke", "rgba(0,0,0,0)")
    .style("stroke-width", 10)
    .merge(tiprect)
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
      return c2y(d.i) + 10 - (d.newteams.length * 4)
    })
    .on("mouseover", function(d) {
      if (d.newteams.length > 0) tip.show(d);
    })
    .on("mouseout", tip.hide)
  tiprect.exit().remove();
}

function casetwo_update(index) {
  if (index === 5) {
    sortmode2 = "descend_seasons";
    upperSlider.value = 2018;
    end = 2018;
    level = "all-levels";
    league = "all-leagues";
    casetwo_filter();
  } else if (index === 6) {
    sortmode2 = "descend_conversion_seasons";
    // upperSlider.value = 1920;
    $("#upper-left").val(1920)
    start = 1870;
    end = 1920;
    casetwo_filter();
  } else if (index === 7) {
    start = 1920;
    end = 1970;
    $("#lower-left").val(1920)
    $("#upper-left").val(1970)
    casetwo_filter();
  } else if (index === 10) {
    start = 1870;
    end = 2018;
    $("#lower-left").val(1870)
    $("#upper-left").val(2018)
    casetwo_filter();
  }
}

function casethree() {
  var filter = filters[level][league],
    total_titles = 0,
    total_pop = 0,
    h = 30,
    leader = 0;

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
  c3r = d3.scaleLinear().domain([0, 1, 20, 200]).range([1, 3, 15, 16])
  c3c = d3.scaleLinear().domain([d3.min(data, function(d) {
    return d.tlq;
  }), 1, 5, d3.max(data, function(d) {
    return d.tlq;
  })]).range(["#d7191c", "#fdae61", "#abdda4", "#2b83ba"])

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
    .attr("height", sideD.h);
  // var legend = d3.select("#case3_header").append("svg")
  //   .attr("width", sideD.w + sideD.left + sideD.right)
  //   .attr("height", h);
  var g = svg.append("g").attr("class", "group3")
    .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")");
  // var legendg = legend.append("g")
  //   .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")");
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

  svg.append("g")
    .attr("class", "x axis c3axis")
    .attr("transform", "translate(" + x_translate + ")")
    .call(xAxis)
    .append("text")
    // .attr("class", "label")
    .attr("x", sideD.w / 2)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .text("Population");

  svg.append("g")
    .attr("class", "y axis c3axis")
    .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")")
    .call(yAxis);

  var circle = g.selectAll("circle")
    .data(data)
    .enter().append("circle").attr("class", "c3circle")
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
    .style("stroke", "#b5b5b5")
    .style("opacity", .75)

}

function casethree_filter() {
  var filter = filters[level][league],
    total_titles = 0,
    total_pop = 0,
    h = 30,
    leader = 0,
    x_translate = sideD.left + "," + (sideD.h + sideD.top);

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
    return d3.ascending(+a.population, +b.population) || d3.ascending(a.key, b.key);
  })
  if (sortmode3 === "descend_tlq" || sortmode3 === "ascend_tlq") {
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

  c3y = d3.scaleLinear().domain([0, 80]).range([sideD.h, 0]);
  c3x = d3.scaleLinear().domain([0, 22000000]).range([0, sideD.w]);
  c3r = d3.scaleLinear().domain([0, 1, 20, 200]).range([1, 3, 15, 16])
  c3c = d3.scaleLinear().domain([d3.min(data, function(d) {
    return d.tlq;
  }), 1, 5, d3.max(data, function(d) {
    return d.tlq;
  })]).range(["#d7191c", "#fdae61", "#abdda4", "#2b83ba"])

  if (casethreestatus === "blank") {
    c3y.domain([0, 80]).range([sideD.h / 2, sideD.h / 2]);
    c3r.domain([0, 200]).range([3, 3]);
    x_translate = sideD.left + "," + ((sideD.h / 2) + sideD.top + 10)
  } else if (casethreestatus === "scattering" || casethreestatus === "scatter") {
    c3y.domain([0, 80]).range([sideD.h, 0]);
    c3r.domain([0, 200]).range([3, 3]);
    x_translate = sideD.left + "," + (sideD.h + sideD.top);
  } else if (casethreestatus === "scattersized") {
    c3r.domain([0, 1, 20, 200]).range([1, 3, 15, 16]);
  } else if (casethreestatus === "ordered") {
    var extent = d3.extent(data, function(d) {
      return d.tlq;
    });
    c3x = d3.scaleLog().domain([0, 1, extent[1]]).rangeRound([0, sideD.w / 4, sideD.w]);
    c3y = d3.scaleBand().domain(d3.range(case3num)).range([0, case3num * h]);
  }

  var svg = d3.select(".case3 svg").style("overlow", "visible").transition()
    .attr("width", sideD.w + sideD.left + sideD.right)
    .attr("height", sideD.h);
  var g = d3.select(".group3")
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
    .tickSize(-sideD.w);

  svg.select(".x.axis.c3axis").transition().duration(250).attr("transform", "translate(" + x_translate + ")").call(xAxis);
  svg.select(".y.axis.c3axis").transition().duration(250).call(yAxis);

  if (casethreestatus === "scattering") {
    g.selectAll("circle").transition().duration(250)
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
  } else {
    var circle = g.selectAll("circle")
      .data(data, function(d) {
        return d.key;
      })
    circle.enter().append("circle").attr("class", "c3circle")
      .attr("cx", 0)
      .attr("cy", function(d, i) {
        if (casethreestatus === "ordered") return c3y(i)
        return c3y(d.newvalues.length);
      })
      .attr("r", 0)
      .style("opacity", 0)
      .merge(circle).transition().duration(500)
      .delay(function(d, i) {
        return i * 3;
      })
      .attr("cx", function(d) {
        if (casethreestatus === "ordered") return c3x(d.tlq)
        return c3x(d.population);
      })
      .attr("cy", function(d, i) {
        if (casethreestatus === "ordered") return c3y(i)
        return c3y(d.newvalues.length);
      })
      .attr("r", function(d) {
        return c3r(d.tlq);
      })
      .style("fill", function(d) {
        return c3c(d.tlq);
      })
      .style("stroke", "#b5b5b5")
      .style("opacity", .75)
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
    casethreestatus = "ordered"
    sortmode3 = "descend_tlq";
    casethree_filter();
  }
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

  if (local != undefined) {
    $("#citysearch-left").attr("value", local)
    $("#subtitle-user-city").html("And is " + local + " the winningest city in North American sports?")
    d3.select("#subtitle-user-city").transition().duration(1000).delay(500).style("opacity", 1);
    $("#groundrules-user-city").html(local + "? Or maybe it&rsquo;s Green Bay, Wisconsin")
    d3.select("#subtitle-user-city").transition().duration(1000).delay(500).style("opacity", 1);
    $("#groundrules-filter-city").html("It looks like you&rsquo;re in " + local + ". Is this right?")
    if (local === "New York Metro Area") $("#groundrules-user-biggercity").html("Los Angeles, California")
  } else {
    $("#subtitle-user-city").html("The Winningest Cities in North American Sports")
    d3.select("#subtitle-user-city").transition().duration(1000).delay(0).style("opacity", 1);
    $("#groundrules-user-city").html("Is it Green Bay, Wisconsin")
  }

  d3.selectAll(".intro-fade").transition().duration(1000).delay(1000).style("opacity", 1);

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
//