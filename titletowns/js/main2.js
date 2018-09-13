const container = d3.select('#scrolly-overlay');
const stepSel = container.selectAll('.step');

// d3.select(".title-wrapper").style("background-image", "url('./img/backgrounds/" + getRandomInt(1, 7) + ".jpg')")

// I DO DECLARE
var userCoord = [],
  searchArray = [],
  userPlace, windowW, windowH, large_screen, medium_screen, small_screen, margin, c1m, scatterM, scatterD, c1d, w, c1x, scatterX, scatterY, swarmX,
  radius = d3.scaleLinear().range([3.5, 20]);

var cLeagues = {
    mlb: "#beaed4",
    cfl: "#7fc97f",
    mls: "#fdc086",
    nba: "#ffff99",
    nfl: "#f0027f",
    nhl: "#bf5b17",
    ncaa: "#386cb0",
    "ncaa_baseball_m": "#386cb0",
    "ncaa_basketball_m": "#386cb0",
    "ncaa_basketball_w": "#386cb0",
    "ncaa_football_m": "#386cb0",
    "ncaa_soccer_w": "#386cb0",
    "ncaa_volleyball_w": "#386cb0"
  },
  cEvents = {
    title: "#f9ed35",
    final: "#a17bff",
    finalFour: "#fc545d"
  }

var years = [1870, 1885, 1900, 1915, 1930, 1945, 1960, 1975, 1990, 2005, 2020],
  years2 = [1870, 1900, 1930, 1960, 1990, 2020]

// HANDLE RESIZE
function handleResize() {

  Stickyfill.add(d3.select('.sticky').node());

  // enterView({
  //   selector: stepSel.nodes(),
  //   offset: 0.5,
  //   enter: el => {
  //     const index = +d3.select(el).attr('data-index');
  //     console.log(index);
  //   },
  //   exit: el => {
  //     let index = +d3.select(el).attr('data-index');
  //     index = Math.max(0, index - 1);
  //   }
  // });

  windowW = window.innerWidth;
  windowH = window.innerHeight;

  large_screen = false
  medium_screen = false
  small_screen = false

  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
  c1m = {
    top: 12,
    right: 25,
    bottom: 30,
    left: 25
  }
  c1D = {
    w: 0,
    h: 0,
    m: 8
  }
  scatterM = {
    top: 12,
    right: 25,
    bottom: 30,
    left: 25
  }
  scatterD = {
    w: 0,
    h: 0,
    m: 8
  }

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
    c1m.right = 15
    c1D.w = windowW - 16 - c1m.left - c1m.right
    c1D.h = windowW * .66 - c1m.top - c1m.bottom
    scatterM.right = 15
    scatterD.w = windowW - 16 - scatterM.left - scatterM.right
    scatterD.h = 400
  } else if (medium_screen) {
    margin.left = (windowW * .125) - 8
    margin.right = (windowW * .125) - 8
    c1D.w = windowW * .75 - c1m.left - c1m.right
    c1D.h = (windowW * .75) * .66 - c1m.top - c1m.bottom
    scatterD.w = windowW * .75 - scatterM.left - scatterM.right
    scatterD.h = 400
  } else {
    margin.left = (windowW * .125) - 8
    margin.right = (windowW * .125) - 8
    c1D.w = windowW * .75 - c1m.left - c1m.right
    c1D.h = (windowW * .75) * .66 - c1m.top - c1m.bottom
    scatterD.w = windowW * .75 - scatterM.left - scatterM.right
    scatterD.h = 400
  }

  w = $(".chart1").width() - c1m.right;
  c1x = d3.scaleLinear().domain([1870, 2018]).range([75, w]);

  d3.selectAll(".searchM,.c1seasonM")
    .transition().duration(500)
    .attr("x1", function(d) {
      return c1x(d.season + .5)
    })
    .attr("x2", function(d) {
      return c1x(d.season + 1.5)
    })
  d3.selectAll(".searchSeason,.c1season")
    .transition().duration(500)
    .attr("x1", function(d) {
      return c1x(d.season)
    })
    .attr("x2", function(d) {
      return c1x(d.season + 1.1)
    })
  d3.selectAll(".searchData,.c1seasonD")
    .transition().duration(200).style("opacity", 0).attr("x1", function(d) {
      return c1x(d)
    })
    .attr("x2", function(d) {
      return c1x(d + .25)
    })
    .transition().duration(250).style("opacity", 1)
  d3.selectAll(".c1label")
    .transition().duration(500)
    .attr("x", function(d) {
      return c1x(d.seasons[0].season)
    });
  d3.selectAll(".c1tickmain,.c1tick")
    .attr("x1", function(d) {
      return c1x(d)
    })
    .attr("x2", function(d) {
      return c1x(d)
    })
  d3.selectAll(".c1axis")
    .attr("x", function(d) {
      return c1x(d)
    })
  d3.selectAll(".c1axisRect")
    .attr("x", function(d) {
      return c1x(d) - 15
    })

} // end handleResize


// GET SOME
loadData();

function loadData() {
  queue()
    .defer(d3.csv, "data/metros.csv")
    .defer(d3.json, "data/seasons.json")
    .defer(d3.csv, "data/pops.csv")
    .defer(d3.json, "data/tlq.json")
    .await(processData);
  ipLookUp()
} // end loadData

function processData(error, metros, seasons, pops, tlq) {
  handleResize();
  window.addEventListener("resize", handleResize);
  findClosest(metros);
  drawTLQ(tlq)
  drawChart1(metros, seasons);
  drawChart2(metros);
} // end processData


// DRAW THIS BITCH

// function tlqData(seasons, metros, pops) {
//
//   var proL = ["MLB", "NBA", "NFL", "NHL", "MLS", "CFL"],
//     big4L = ["MLB", "NBA", "NFL", "NHL"],
//     collL = ["Baseball (M)", "Basketball (M)", "Basketball (W)", "Football (M)", "Soccer (W)", "Volleyball (W)"]
//
//   var arr = [];
//
//   // for (var n = 0; n < 9; n++) {
//   for (var n = 0; n < seasons.length; n++) {
//     var titleYears = [],
//       big4years = [],
//       proYears = [],
//       collegeYears = [];
//     for (var j = 0; j < seasons[n].seasons.length; j++) {
//       if (seasons[n].seasons[j].titles.length > 0) {
//         for (var k = 0; k < seasons[n].seasons[j].titles.length; k++) {
//           titleYears.push(seasons[n].seasons[j].season)
//           if (contains(seasons[n].seasons[j].titles[k], proL)) proYears.push(seasons[n].seasons[j].season)
//           if (contains(seasons[n].seasons[j].titles[k], big4L)) big4years.push(seasons[n].seasons[j].season)
//           if (contains(seasons[n].seasons[j].titles[k], collL)) collegeYears.push(seasons[n].seasons[j].season)
//         }
//       }
//     }
//
//     var item = {
//       "metro": seasons[n].metro,
//       "titleYears": titleYears,
//       "proYears": proYears,
//       "big4years": big4years,
//       "collegeYears": collegeYears,
//       "population": parseInt(pops[n].population)
//     }
//
//     arr.push(item)
//   }
//
//   console.log(JSON.stringify(arr))
//
//
// } // end TLQ data

function drawTLQ(tlq) {

  var start = 1870,
    end = 2018,
    metric = "proYears";

  var svg = d3.select(".scatter").append("svg")
    .attr("class", "scatter")
    .attr("width", scatterD.w + scatterM.left)
    .attr("height", scatterD.h + scatterM.top + scatterM.bottom)
    .append("g")
    .attr("transform", "translate(" + scatterM.left + "," + scatterM.top + ")");

  $(".leagueToggleVS").change(function() {
    var val = $('input[name="switch1"]:checked').val()
    filterChart(tlq, start, end, val)
  })

  $(".leagueToggleTLQ").change(function() {
    var val = $('input[name="switch2"]:checked').val()
    filterSwarm(tlq, start, end, val)
    // filterChart(tlq, start, end, val)
  })

  var voronoi = d3.voronoi()
    .x(function(d) {
      return scatterX(d.population);
    })
    .y(function(d) {
      return scatterY(d.count);
    })
    .extent([
      [0, 0],
      [scatterD.w, scatterD.h]
    ]);

  var swarmvoronoi = d3.voronoi()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
    .extent([
      [0, 0],
      [scatterD.w, scatterD.h]
    ]);

  var voronoiG = svg.append("g")
    .attr("class", "voronoi");

  scatter(tlq, start, end, metric)

  function filterChart(data, start, end, metric) {
    data.forEach(function(data) {
      var count = 0;
      for (var i = 0; i < data[metric].length; i++) {
        if (data[metric][i] >= start && data[metric][i] <= end) count += 1
      }
      data.count = count;
    })
    data = data.filter(function(d) {
      return d.count > 0
    })

    d3.selectAll(".s1annT, .s1annST").transition().style("opacity", 0).remove();

    scatterY.range([scatterD.h, 0]).domain([0, 80])
    scatterX = d3.scaleLinear().range([0, scatterD.w]).domain([0, 22000000])

    var xAxis = d3.axisBottom(scatterX)
      .tickSize(0)
      .tickFormat(d3.format(".2s"))
      .tickValues([2000000, 4000000, 6000000, 8000000, 10000000, 12000000, 14000000, 16000000, 18000000, 20000000, 22000000])

    svg.select(".x.axis").transition().duration(250)
      .attr("transform", "translate(0," + scatterD.h + ")").call(xAxis)
    svg.select(".y.axis").transition().duration(250).style("opacity", 1);
    svg.select(".x.axis .label")
      .text("Population")
      .attr("dy", 0)
      .attr("y", 30)
      .attr("x", scatterD.w)
      .attr("dx", 0)

    var dots = svg.selectAll(".dot").data(data, function(d) {
      return d.metro
    });
    var labels = svg.selectAll(".s1label").data(data)
    var labelBGs = svg.selectAll(".s1labelBG").data(data)

    voronoiG.selectAll("path").remove();
    voronoiG.selectAll("path")
      .data(voronoi(data).polygons())
      .enter().append("path")
      .attr("d", function(d) {
        return d ? "M" + d.join("L") + "Z" : null;
      })
      .style("pointer-events", "all")
      .on("mouseover", s1showtooltip)
      .on("mouseout", s1hidetooltip)

    dots.enter().append("circle")
      .attr("class", "dot")
      .attr("id", function(d) {
        return "scatterDot-" + camelize(d.metro)
      })
      .attr("cy", scatterY(0))
      .attr("cx", function(d) {
        return scatterX(d.population)
      })
      .style("opacity", 0)
      .merge(dots)
      .transition().duration(250)
      .attr("r", 3.5)
      .style("opacity", .5)
      .attr("cy", function(d) {
        return scatterY(d.count);
      })
      .attr("cx", function(d) {
        return scatterX(d.population)
      })
    dots.exit().transition().duration(250)
      .attr("cy", scatterY(0))
      .style("opacity", 0).remove();

    labelBGs.enter().append("text")
      .attr("dy", 15)
      .text(function(d) {
        return d.metro
      })
      .style("opacity", 0)
      .merge(labelBGs)
      .attr("class", "s1labelBG")
      .attr("id", function(d) {
        return "s1labelBG-" + camelize(d.metro)
      })
      .attr("x", function(d) {
        return scatterX(d.population)
      })
      .attr("y", function(d) {
        return scatterY(d.count)
      })
    labelBGs.exit().remove();

    labels.enter().append("text")
      .attr("dy", 15)
      .style("opacity", 0)
      .merge(labels)
      .text(function(d) {
        return d.metro
      })
      .attr("class", "s1label")
      .attr("id", function(d) {
        return "s1label-" + camelize(d.metro)
      })
      .attr("x", function(d) {
        return scatterX(d.population)
      })
      .attr("y", function(d) {
        return scatterY(d.count)
      })
    labels.exit().remove();
  }

  function scatter(data, start, end, metric) {
    scatterX = d3.scaleLinear().range([0, scatterD.w])
    scatterY = d3.scaleLinear().range([scatterD.h / 2, scatterD.h / 2])

    var xAxis = d3.axisBottom(scatterX)
      .tickSize(0)
      .tickFormat(d3.format(".2s"))
      .tickValues([100000, 200000, 300000, 400000, 500000])
    var yAxis = d3.axisLeft(scatterY)
      .tickSize(0)
      .tickFormat(function(d) {
        return ""
      })
      .tickValues([5, 10, 15, 20])

    data.forEach(function(data) {
      var count = 0;
      for (var i = 0; i < data[metric].length; i++) {
        if (data[metric][i] >= start && data[metric][i] <= end) count += 1
      }
      data.count = count;
    })
    data = data.filter(function(d) {
      return d.count > 0
    })


    var annData = [{
      metro: "Green Bay, WI",
      population: 320025,
      titles: 14,
      proTLQ: 14.34
    }, {
      metro: "New York Metro Area, NY",
      population: 20320876,
      titles: 57,
      proTLQ: 0.92
    }, {
      metro: "Greater Boston, MA",
      population: 4836531,
      titles: 37,
      proTLQ: 2.51
    }, {
      metro: "Edmonton, AB",
      population: 1321426,
      titles: 19,
      proTLQ: 4.71
    }]
    scatterX.domain([0, 500000]).nice();
    scatterY.domain(d3.extent(data, function(d) {
      return d.count;
    })).nice();

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + scatterD.h / 2 + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", scatterD.w)
      .attr("y", 30)
      .style("text-anchor", "middle")
      .text("Population");
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("id", function(d) {
        return "scatterDot-" + camelize(d.metro)
      })
      .attr("r", 3.5)
      .attr("cx", function(d) {
        return scatterX(0)
      })
      .attr("cy", function(d) {
        return scatterY(0);
      })
      .style("opacity", 0)
    svg.selectAll(".s1labelBG")
      .data(data)
      .enter().append("text").attr("class", "s1labelBG")
      .attr("id", function(d) {
        return "s1labelBG-" + camelize(d.metro)
      })
      .attr("dy", 15)
      .style("opacity", 0)
      .text(function(d) {
        return d.metro
      })
    svg.selectAll(".s1label")
      .data(data)
      .enter().append("text").attr("class", "s1label")
      .attr("id", function(d) {
        return "s1label-" + camelize(d.metro)
      })
      .attr("dy", 15)
      .style("opacity", 0)
      .text(function(d) {
        return d.metro
      })
    svg.selectAll(".s1annT")
      .data(annData)
      .enter().append("text").attr("class", "s1annT")
      .attr("id", function(d) {
        return "s1ann-" + camelize(d.metro)
      })
      .attr("x", function(d) {
        return scatterX(d.population)
      })
      .attr("y", function(d) {
        return scatterY(d.titles)
      })
      .attr("dy", function(d) {
        if (d.metro === "Edmonton, AB") return -30
        return 25
      })
      .style("opacity", 0)
      .text(function(d) {
        return d.metro
      })
    svg.selectAll(".s1annST")
      .data(annData)
      .enter().append("text").attr("class", "s1annST")
      .attr("id", function(d) {
        return "s1annST-" + camelize(d.metro)
      })
      .attr("x", function(d) {
        return scatterX(d.population)
      })
      .attr("y", function(d) {
        return scatterY(d.titles)
      })
      .attr("dy", function(d) {
        if (d.metro === "Edmonton, AB") return -15
        return 40
      })
      .style("opacity", 0)
      .text(function(d) {
        return "(" + d.proTLQ + " LQ)"
      })
    svg.selectAll(".s1ann-pop")
      .data(annData)
      .enter().append("line").attr("class", "s1ann s1ann-pop")
      .attr("id", function(d) {
        return "s1ann-pop-" + camelize(d.metro)
      })
      .attr("x1", function(d) {
        return scatterX(d.population)
      })
      .attr("x2", function(d) {
        return scatterX(d.population)
      })
      .attr("y1", function(d) {
        return scatterY(d.titles)
      })
      .attr("y2", function(d) {
        return scatterY(d.titles)
      })
      .style("opacity", 0)
    svg.selectAll(".s1ann-count")
      .data(annData)
      .enter().append("line").attr("class", "s1ann s1ann-count")
      .attr("id", function(d) {
        return "s1ann-count-" + camelize(d.metro)
      })
      .attr("x1", function(d) {
        return scatterX(d.population)
      })
      .attr("x2", function(d) {
        return scatterX(d.population)
      })
      .attr("y1", function(d) {
        return scatterY(d.titles)
      })
      .attr("y2", function(d) {
        return scatterY(d.titles)
      })
      .style("opacity", 0)

    // var voronoi = d3.voronoi()
    //   .x(function(d) {
    //     return scatterX(d.population);
    //   })
    //   .y(function(d) {
    //     return scatterY(d.count);
    //   })
    //   .extent([
    //     [0, 0],
    //     [scatterD.w, scatterD.h]
    //   ]);
    //
    // var voronoiG = svg.append("g")
    //   .attr("class", "voronoi");

    enterView({
      selector: stepSel.nodes(),
      offset: 0.2,
      enter: function(el) {
        var index = +d3.select(el).attr("data-index");
        updateChart(index);
      },
      once: false
    });

    function updateChart(index) {
      if (index === 0) {
        svg.select("#scatterDot-greenBayWI").style("fill", "#E00000")
          .transition().duration(500)
          .style("opacity", 1)
          .attr("cx", function(d) {
            return scatterX(d.population)
          })
          .attr("cy", function(d) {
            return scatterY(d.count)
          })
          .attr("r", 4)

      } else if (index === 1) {
        scatterY.range([scatterD.h * .75, scatterD.h * .25]).domain([0, 20])
        yAxis.tickFormat(function(d) {
          if (d === 20) return d + " titles"
          return d
        }).tickSize(-scatterD.w)

        svg.select(".y.axis").transition().duration(250).call(yAxis);
        svg.select(".x.axis").transition().duration(250)
          .attr("transform", "translate(0," + scatterD.h * .75 + ")")

        svg.selectAll(".dot")
          .transition().duration(250)
          .attr("cx", function(d) {
            return scatterX(d.population)
          })
          .attr("cy", function(d) {
            return scatterY(d.count)
          })
        svg.selectAll(".s1annT, .s1annST")
          .attr("y", function(d) {
            return scatterY(d.titles)
          })
        svg.selectAll("#s1ann-pop-greenBayWI")
          .style("opacity", .25)
          .attr("x1", function(d) {
            return scatterX(d.population)
          })
          .attr("x2", function(d) {
            return scatterX(d.population)
          })
          .attr("y1", scatterY(0))
          .attr("y2", scatterY(0))
          .transition().duration(250)
          .attr("y1", scatterY(0))
          .attr("y2", function(d) {
            return scatterY(d.titles)
          })
          .attr("x1", function(d) {
            return scatterX(d.population)
          })
          .attr("x2", function(d) {
            return scatterX(d.population)
          })
          .transition().duration(500)
          .style("opacity", 0)
        svg.selectAll("#s1ann-count-greenBayWI")
          .style("opacity", .25)
          .attr("x1", scatterX(0))
          .attr("x2", scatterX(0))
          .attr("y1", scatterY(0))
          .attr("y2", scatterY(0))
          .transition().duration(250)
          .attr("y1", function(d) {
            return scatterY(d.titles)
          })
          .attr("y2", function(d) {
            return scatterY(d.titles)
          })
          .attr("x1", scatterX(0))
          .attr("x2", function(d) {
            return scatterX(d.population)
          })
          .transition().duration(500)
          .style("opacity", 0)
        svg.selectAll("#s1ann-greenBayWI, #s1annST-greenBayWI")
          .transition().duration(250).delay(500).style("opacity", 1)

      } else if (index === 2) {
        scatterY.range([scatterD.h, 0]).domain([0, 80])
        scatterX.range([0, scatterD.w]).domain([0, 22000000])

        yAxis.tickFormat(function(d) {
          if (d === 80) return d + " titles"
          return d
        }).tickValues([10, 20, 30, 40, 50, 60, 70, 80])

        scatterX = d3.scaleLinear().range([0, scatterD.w]).domain([0, 22000000])
        xAxis = d3.axisBottom(scatterX)
          .tickSize(0)
          .tickFormat(d3.format(".2s"))
          .tickValues([2000000, 4000000, 6000000, 8000000, 10000000, 12000000, 14000000, 16000000, 18000000, 20000000, 22000000])

        svg.select(".y.axis").transition().duration(250).call(yAxis);
        svg.select(".x.axis").transition().duration(250)
          .attr("transform", "translate(0," + scatterD.h + ")").call(xAxis)

        svg.selectAll(".dot")
          .transition().duration(250)
          .attr("cx", function(d) {
            return scatterX(d.population)
          })
          .attr("cy", function(d) {
            return scatterY(d.count)
          })
        svg.selectAll(".s1annT, .s1annST")
          .transition().duration(250)
          .attr("y", function(d) {
            return scatterY(d.titles)
          })
          .attr("x", function(d) {
            return scatterX(d.population)
          })

        svg.selectAll("#scatterDot-newYorkMetroArea, #scatterDot-greaterBostonMA, #scatterDot-edmontonAB").style("fill", "#E00000")
          .attr("cx", scatterX(0))
          .attr("cy", scatterY(0))
          // .transition().duration(250)
          .attr("r", 4)
          .transition().duration(1000)
          .style("opacity", 1)
          .attr("cx", function(d) {
            return scatterX(d.population)
          })
          .attr("cy", function(d) {
            return scatterY(d.count)
          })

        svg.selectAll(".s1ann-pop:not(#s1ann-pop-greenBayWI)")
          .style("opacity", .25)
          .attr("x1", scatterX(0))
          .attr("x2", scatterX(0))
          .attr("y1", scatterY(0))
          .attr("y2", scatterY(0))
          .transition().duration(1000)
          .attr("y1", scatterY(0))
          .attr("y2", function(d) {
            return scatterY(d.titles)
          })
          .attr("x1", function(d) {
            return scatterX(d.population)
          })
          .attr("x2", function(d) {
            return scatterX(d.population)
          })
          .transition().duration(500)
          .style("opacity", 0)
        svg.selectAll(".s1ann-count:not(#s1ann-count-greenBayWI)")
          .style("opacity", .25)
          .attr("x1", scatterX(0))
          .attr("x2", scatterX(0))
          .attr("y1", scatterY(0))
          .attr("y2", scatterY(0))
          .transition().duration(1000)
          .attr("y1", function(d) {
            return scatterY(d.titles)
          })
          .attr("y2", function(d) {
            return scatterY(d.titles)
          })
          .attr("x1", scatterX(0))
          .attr("x2", function(d) {
            return scatterX(d.population)
          })
          .transition().duration(500)
          .style("opacity", 0)
        svg.selectAll(".s1annT, .s1annST")
          .transition().duration(250).delay(1250).style("opacity", 1)
      } else if (index === 3) {
        scatterY.range([scatterD.h, 0]).domain([0, 80])
        scatterX = d3.scaleLinear().range([0, scatterD.w]).domain([0, 22000000])
        svg.selectAll(".dot").transition()
          .style("opacity", .5)
          .attr("r", 3.5)
        svg.selectAll(".s1label, .s1labelBG")
          .attr("x", function(d) {
            return scatterX(d.population)
          })
          .attr("y", function(d) {
            return scatterY(d.count)
          })

        voronoiG.selectAll("path")
          .data(voronoi(data).polygons())
          .enter().append("path")
          .attr("d", function(d) {
            return d ? "M" + d.join("L") + "Z" : null;
          })
          .style("pointer-events", "all")
          .on("mouseover", s1showtooltip)
          .on("mouseout", s1hidetooltip)
      } else if (index === 4) {
        document.getElementById('sw_pro').checked = true;
        d3.selectAll(".s1annT, .s1annST").transition().style("opacity", 0).remove();
        d3.selectAll(".guide").transition().style("opacity", 0);
        voronoiG.selectAll("path").remove();
        // svg.selectAll(".s1label, .s1labelBG").remove();
        convertToSwarm(data, start, end, metric)
      } else if (index === 5) {
        svg.select("#scatterDot-chicagoIL").transition().style("opacity", ".2")
        svg.select("#scatterDot-newYorkMetroArea").transition().style("fill", "#e00000").style("opacity", "1")
        svg.selectAll("#s1label-chicagoIL, #s1labelBG-chicagoIL").transition().style("opacity", 0)
        svg.selectAll("#s1label-newYorkMetroArea, #s1labelBG-newYorkMetroArea").transition().style("opacity", 1)
      } else if (index === 6) {
        svg.select("#scatterDot-newYorkMetroArea").transition().style("opacity", ".2")
        svg.select("#scatterDot-greenBayWI").transition().style("fill", "#e00000").style("opacity", "1")
        svg.selectAll("#s1label-newYorkMetroArea, #s1labelBG-newYorkMetroArea").transition().style("opacity", 0)
        svg.selectAll("#s1label-greenBayWI, #s1labelBG-greenBayWI").transition().style("opacity", 1)
      } else if (index === 7) {
        svg.selectAll(".dot").transition().style("opacity", ".5").style("fill", "#000")
        svg.selectAll("#s1label-greenBayWI, #s1labelBG-greenBayWI").transition().style("opacity", 0)
      }
    }

  } // end scatter

  function filterSwarm(data, start, end, metric) {
    var totalPop = 0,
      totalCount = 0;
    data.forEach(function(data) {
      var count = 0;
      for (var i = 0; i < data[metric].length; i++) {
        if (data[metric][i] >= start && data[metric][i] <= end) count += 1
      }
      data.count = count;
    })
    data = data.filter(function(d) {
      return d.count > 0
    })
    data.forEach(function(data) {
      totalPop += data.population
      totalCount += data.count
    })
    data.forEach(function(data) {
      data.tlq = (data.count / data.population) / (totalCount / totalPop)
      if (data.tlq <= 0) data.tlq = 0
    })
    data = data.sort(function(a, b) {
      return d3.descending(a.tlq, b.tlq);
    });

    var extent = d3.extent(data, function(d) {
      return d.tlq
    })

    scatterX.rangeRound([0, scatterD.w / 2, scatterD.w])
      .domain([extent[0], 1, extent[1]])
    radius.domain(d3.extent(data, function(d) {
      return d.count
    }))

    var xAxis = d3.axisBottom(scatterX)
      .tickFormat(function(d) {
        return d3.format(".1r")(d) + "x"
      })
      .tickValues([.1, .5, 1, 10, 20, 100])
      .tickSize(10, 0)

    svg.select(".x.axis").transition().duration(250).call(xAxis)

    var simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(function(d) {
        return scatterX(d.tlq);
      }).strength(1))
      .force("y", d3.forceY(scatterD.h / 2))
      .force("collide", d3.forceCollide(4).radius(function(d) {
        return radius(d.count) * 1.1
      }))
      .stop();

    console.log(data)

    voronoiG.selectAll("path").remove();
    voronoiG.selectAll("path")
      .data(swarmvoronoi(data).polygons())
      .enter().append("path")
      .attr("d", function(d) {
        return d ? "M" + d.join("L") + "Z" : null;
      })
      .style("pointer-events", "all")
      .on("mouseover", s1showtooltip)
      .on("mouseout", s1hidetooltip)

    var dots = svg.selectAll(".dot").data(data, function(d) {
      return d.metro
    });
    dots.enter().append("circle")
      .attr("cy", scatterY(0))
      .attr("cx", 0)
      .attr("r", 3.5)
      .style("opacity", 0)
      .merge(dots)
      .attr("class", "dot")
      .attr("id", function(d) {
        return "scatterDot-" + camelize(d.metro)
      })
      .transition().duration(250).delay(100)
      .attr("cx", function(d) {
        return d.x
      })
      .attr("cy", function(d) {
        return d.y
      })
      .attr("r", function(d) {
        return radius(d.count)
      })
      .style("opacity", .5)
    dots.exit().transition().duration(250)
      .attr("cy", scatterD.h / 2)
      .style("opacity", 0).remove();

    var labels = svg.selectAll(".s1label").data(data, function(d) {
      return d.metro
    })
    labels.enter().append("text")
      .style("opacity", 0)
      .merge(labels)
      .text(function(d) {
        return d.metro + " (TLQ: " + d.tlq.toFixed(2) + ")"
      })
      .attr("class", "s1label")
      .attr("id", function(d) {
        return "s1label-" + camelize(d.metro)
      })
      .attr("dy", function(d) {
        return radius(d.count) + 15
      })
      .attr("x", function(d) {
        return d.x
      })
      .attr("y", function(d) {
        return d.y
      })
      .style("opacity", 0)
    labels.exit().remove();

    var labelsBG = svg.selectAll(".s1labelBG").data(data, function(d) {
      return d.metro
    })
    labelsBG.enter().append("text")
      .style("opacity", 0)
      .merge(labelsBG)
      .text(function(d) {
        return d.metro + " (TLQ: " + d.tlq.toFixed(2) + ")"
      })
      .attr("class", "s1labelBG")
      .attr("id", function(d) {
        return "s1labelBG-" + camelize(d.metro)
      })
      .attr("dy", function(d) {
        return radius(d.count) + 15
      })
      .attr("x", function(d) {
        return d.x
      })
      .attr("y", function(d) {
        return d.y
      })
      .style("opacity", 0)
    labelsBG.exit().remove();

  }

  function convertToSwarm(data, start, end, metric) {
    var totalPop = 0,
      totalCount = 0;
    data.forEach(function(data) {
      var count = 0;
      for (var i = 0; i < data[metric].length; i++) {
        if (data[metric][i] >= start && data[metric][i] <= end) count += 1
      }
      data.count = count;
    })
    data = data.filter(function(d) {
      return d.count > 0
    })
    data.forEach(function(data) {
      totalPop += data.population
      totalCount += data.count
    })
    data.forEach(function(data) {
      data.tlq = (data.count / data.population) / (totalCount / totalPop)
      if (data.tlq <= 0) data.tlq = 0
    })
    data = data.sort(function(a, b) {
      return d3.descending(a.tlq, b.tlq);
    });

    swarmX = d3.scaleLog().rangeRound([0, scatterD.w / 2, scatterD.w])
      .domain([0.056877221441297185, 1, 20])
    radius.domain(d3.extent(data, function(d) {
      return d.count
    }))

    var xAxis = d3.axisBottom(swarmX)
      .tickFormat(function(d) {
        return d3.format(".1r")(d) + "x"
      })
      .tickValues([.1, .5, 1, 5, 10, 20])
      .tickSize(10, 0)

    svg.select(".x.axis").transition().duration(250)
      .attr("transform", "translate(0," + scatterD.h / 2 + ")").call(xAxis)
    svg.select(".y.axis").transition().duration(250).style("opacity", 0);

    svg.selectAll(".x.axis .tick line")
      .transition().delay(250)
      .attr("y2", function(d) {
        if (d === 1) return 75
        if (d === .5 || d === 5) return 40
        if (d === 10 || d === .1) return 20
        return 5
      })
    svg.selectAll(".x.axis .tick text")
      .transition().delay(250)
      .attr("dy", 15)
      .attr("y", function(d) {
        if (d === 1) return 75
        if (d === .5 || d === 5) return 40
        if (d === 10 || d === .1) return 20
        return 5
      })
    svg.select(".x.axis .label")
      .text("Title Location Quotient (TLQ)")
      .attr("dy", 100)
      .attr("dx", 10)

    var simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(function(d) {
        return swarmX(d.tlq);
      }).strength(1))
      .force("y", d3.forceY(scatterD.h / 2))
      .force("collide", d3.forceCollide(4).radius(function(d) {
        return radius(d.count) * 1.1
      }))
      .stop();

    var dots = svg.selectAll(".dot").data(data, function(d) {
      return d.metro
    });
    dots.enter().append("circle")
      .attr("cy", scatterY(0))
      .attr("cx", 0)
      .attr("r", 3.5)
      .style("opacity", 0)
      .merge(dots)
      .attr("class", "dot")
      .attr("id", function(d) {
        return "scatterDot-" + camelize(d.metro)
      })
      .transition().duration(250)
      .attr("cx", function(d) {
        return d.x
      })
      .attr("cy", function(d) {
        return d.y
      })
      .attr("r", function(d) {
        return radius(d.count)
      })
      .style("opacity", function(d) {
        if (d.metro === "Chicago, IL") return 1
        return .05
      })
      .style("fill", function(d) {
        if (d.metro === "Chicago, IL") return "#E00000"
        return "#000"
      })
    dots.exit().transition().duration(250)
      .attr("cy", scatterY(0))
      .style("opacity", 0).remove();

    var labels = svg.selectAll(".s1label").data(data, function(d) {
      return d.metro
    })
    labels.enter().append("text")
      .style("opacity", 0)
      .merge(labels)
      .text(function(d) {
        return d.metro + " (TLQ: " + d.tlq.toFixed(2) + ")"
      })
      .attr("class", "s1label")
      .attr("id", function(d) {
        return "s1label-" + camelize(d.metro)
      })
      .attr("dy", function(d) {
        return radius(d.count) + 15
      })
      .attr("x", function(d) {
        return d.x
      })
      .attr("y", function(d) {
        return d.y
      })
      .style("opacity", function(d) {
        if (d.metro === "Chicago, IL") return 1
        return 0
      })
    labels.exit().remove();

    var labelsBG = svg.selectAll(".s1labelBG").data(data, function(d) {
      return d.metro
    })
    labelsBG.enter().append("text")
      .style("opacity", 0)
      .merge(labelsBG)
      .text(function(d) {
        return d.metro + " (TLQ: " + d.tlq.toFixed(2) + ")"
      })
      .attr("class", "s1labelBG")
      .attr("id", function(d) {
        return "s1labelBG-" + camelize(d.metro)
      })
      .attr("dy", function(d) {
        return radius(d.count) + 15
      })
      .attr("x", function(d) {
        return d.x
      })
      .attr("y", function(d) {
        return d.y
      })
      .style("opacity", function(d) {
        if (d.metro === "Chicago, IL") return 1
        return 0
      })
    labelsBG.exit().remove();

    // voronoiG.selectAll("path").remove();
    voronoiG.selectAll("path")
      .data(swarmvoronoi(data).polygons())
      .enter().append("path")
      .attr("d", function(d) {
        return d ? "M" + d.join("L") + "Z" : null;
      })
      .style("pointer-events", "all")
      .on("mouseover", s1showtooltip)
      .on("mouseout", s1hidetooltip)

    for (var i = 0; i < 120; ++i) simulation.tick();

  }

  function s1showtooltip(d, i) {
    var me = camelize(d.data.metro),
      element = d3.selectAll("#scatterDot-" + me);

    d3.selectAll(".dot:not(#scatterDot-" + me + ")").transition().style("opacity", .25)
    element.transition().style("opacity", .75)

    d3.selectAll(".s1annT, .s1annST").transition().style("opacity", 0)
    d3.selectAll("#s1label-" + me + ", #s1labelBG-" + me).transition().style("opacity", 1)

    if (d.data.tlq === undefined) {
      svg.append("line")
        .attr("class", "s1ann guide")
        .attr("x1", scatterX(d.data.population))
        .attr("x2", scatterX(d.data.population))
        .attr("y1", scatterY(0))
        .attr("y2", scatterY(d.data.count))
        .style("stroke", "#000")
        .style("opacity", 0)
        .style("pointer-events", "none")
        .transition().duration(200)
        .style("opacity", .25);
      svg.append("line")
        .attr("class", "s1ann guide")
        .attr("x1", scatterX(0))
        .attr("x2", scatterX(d.data.population))
        .attr("y1", scatterY(d.data.count))
        .attr("y2", scatterY(d.data.count))
        .style("stroke", "#000")
        .style("opacity", 0)
        .style("pointer-events", "none")
        .transition().duration(200)
        .style("opacity", .25);
      svg.append("rect")
        .attr("class", "guide")
        .attr("x", scatterX(d.data.population) - 15)
        .attr("y", scatterY(0) + 1)
        .attr("height", 12)
        .attr("width", 30)
        .style("fill", "white")
        .style("opacity", 0)
        .transition().duration(200)
        .style("opacity", 1)
      svg.append("text")
        .attr("class", "s1guide guide")
        .attr("x", scatterX(d.data.population))
        .attr("y", scatterY(0))
        .attr("dy", 10)
        .style("fill", "#000")
        .style("opacity", 0)
        .text(d3.format(".2s")(d.data.population))
        .transition().duration(200)
        .style("opacity", .25)
      svg.append("rect")
        .attr("class", "guide")
        .attr("x", scatterX(0) - 30)
        .attr("y", scatterY(d.data.count) - 4)
        .attr("height", 12)
        .attr("width", 30)
        .style("fill", "white")
        .style("opacity", 0)
        .transition().duration(200)
        .style("opacity", 1)
      svg.append("text")
        .attr("class", "s1guide guide")
        .attr("x", scatterX(0) - 2)
        .attr("y", scatterY(d.data.count))
        .attr("dy", 3)
        .style("text-anchor", "end")
        .style("fill", "#000")
        .style("opacity", 0)
        .text(d.data.count)
        .transition().duration(200)
        .style("opacity", .25)
    }
  }

  function s1hidetooltip(d, i) {
    var me = camelize(d.data.metro);
    d3.selectAll(".dot").transition().style("opacity", .5)
    d3.selectAll(".s1annT, .s1annST").transition().style("opacity", 1)
    d3.selectAll("#s1label-" + me + ", #s1labelBG-" + me).transition().style("opacity", 0)

    d3.selectAll(".guide")
      .transition().duration(200)
      .style("opacity", 0)
      .remove();
  }



} //end drawTLQ

function drawChart1(metros, seasons) {

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
        term = $("#c1search-bar").val()
        searched(seasons, term, metros, key, false);
      },
      onKeyEnterEvent: function() {
        term = $("#c1search-bar").val()
        searched(seasons, term, metros, key, false);
      }
    }
  };

  var h = 15,
    w = $(".chart1").width() - c1m.right,
    show = 25,
    c1y = d3.scaleBand();

  var term;

  var key = "seasons"

  seasons.forEach(function(seasons) {
    searchArray.push(seasons.metro)
  })

  metros.forEach(function(metros) {
    metros.seasonArray = parseArray(metros.seasonArray)
  })

  if (userPlace != undefined) {
    term = userPlace.metro;
  } else {
    term = "Twin Cities, MN";
  }

  var rowTicks = d3.select(".chart1").append("div").attr("class", "c1remove chart1row chart1rowMain");
  var svgTicks = rowTicks.append("svg").attr("class", "c1elementsSVG").attr("height", 5).attr("width", w);


  svgTicks.selectAll(".c1tickmain")
    .data(years)
    .enter().append("line").attr("class", "c1tickmain")
    .attr("x1", function(d) {
      return c1x(d)
    })
    .attr("x2", function(d) {
      return c1x(d)
    })
    .attr("y1", 0)
    .attr("y2", 0)


  $("#showMoreC1").on("click", function() {
    show = show + 25
    chart1(seasons, metros, key, show, false)
    if (show > 318) d3.select("#showMoreC1").style("display", "none")
  })

  tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
    var titles = "",
      finals = "",
      finalFours = "";
    if (d.titles.length > 0) var titles = "<h2 style='color:" + cEvents.title + "'>Titles</h2><p>" + d.titles + "</p>";
    if (d.finals.length > 0) var finals = "<h2 style='color:" + cEvents.final + "'>Finals Appearance</h2><p>" + d.finals + "</p>";
    if (d.finalFours.length > 0) var finalFours = "<h2 style='color:" + cEvents.finalFour + "'>Final Four Appearance</h2><p>" + d.finalFours + "</p>";

    return "<h1>" + d.season + "</h1>" + titles + finals + finalFours;
  }).direction("s").offset([25, 0]);

  chart1Top(show, true)
  searched(seasons, term, metros, key, true);
  chart1(seasons, metros, key, show, true)

  function chart1(seasons, metros, key, num, first) {
    var data = seasons.sort(function(a, b) {
      return d3.ascending(a[key][0].season, b[key][0].season);
    }).slice(0, num);

    var vdata = metros.filter(function(metros) {
      return metros.seasonArray.length > 0;
    }).sort(function(x, y) {
      return d3.ascending(x.seasonArray[0], y.seasonArray[0]);
    }).slice(0, num);

    if (first) {
      var svg = d3.select(".chart1").append("svg").attr("class", "c1svg").attr("height", h * num).attr("width", w);
    } else {
      var svg = d3.select(".c1svg").attr("height", h * num)
    }

    svg.call(tip)

    c1y.domain(d3.range(num)).rangeRound([0, num * h]);
    d3.selectAll(".c1tickmain").transition().duration(250).attr("y2", c1y(num - 1) + h)

    // var voronoi = d3.voronoi()
    //   .x(function(d) {
    //     return c1x(d.season);
    //   })
    //   .y(function(d) {
    //     return c1y(d.row);
    //   })
    //   .extent([
    //     [-c1m.left, -c1m.top],
    //     [c1D.w + c1m.right, c1D.h + c1m.bottom]
    //   ]);

    // draw city labels
    svg.selectAll(".c1label")
      .data(data)
      .enter().append("text").attr("class", "c1label")
      .attr("id", function(d, i) {
        return "c1l-" + i
      })
      .attr("x", function(d) {
        return c1x(d.seasons[0].season)
      })
      .attr("y", function(d, i) {
        return c1y(i) + h / 2
      })
      .attr("dy", 3)
      .attr("dx", -6)
      .style("text-anchor", "end")
      .text(function(d) {
        return d.metro
      })
      .style("opacity", 0)
      .transition().duration(500).delay(function(d, i) {
        return 10 * (i - (num - 25))
      })
      .style("opacity", 1)
    // draw season lines and titles, etc.
    svg.selectAll(".c1seasonG")
      .data(data)
      .enter().append("g").attr("class", "c1seasonG")
      .each(function(d, i) {
        var row = i;
        d3.select(this).selectAll(".c1season")
          .data(d.seasons)
          .enter().append("line").attr("class", "c1season sl-" + row)
          .attr("x1", function(d) {
            return c1x(data[row].seasons[0].season)
          })
          .attr("x2", function(d) {
            return c1x(data[row].seasons[0].season)
          })
          .attr("y1", function(d) {
            return c1y(row) + h / 2
          })
          .attr("y2", function(d) {
            return c1y(row) + h / 2
          })
          .transition().duration(750).delay(10 * (row - (num - 25)))
          .attr("x1", function(d) {
            return c1x(d.season)
          })
          .attr("x2", function(d) {
            return c1x(d.season + 1.1)
          })
          .style("stroke-linecap", "round")
          .style("stroke", "#444")
          .style("stroke-width", 5)
          .each(function(d) {
            var y1 = c1y(row) + h / 2,
              y2 = c1y(row) + h / 2,
              y3 = c1y(row) + h / 2;
            var weight = 5;

            if (d.titles.length > 0 && d.finals.length > 0) {
              y3 = c1y(row) + (h / 2 - 1.25)
              y2 = c1y(row) + (h / 2 + 1.25)
              weight = 2.5
            } else if (d.finals.length > 0 && d.finalFours.length > 0) {
              y1 = c1y(row) + (h / 2 - 1.25)
              y2 = c1y(row) + (h / 2 + 1.25)
              weight = 2.5
            } else if (d.finals.length > 0 && d.finalFours.length > 0 && d.titles.length > 0) {
              y1 = c1y(row) + (h / 2 - 1.6667)
              y2 = c1y(row) + (h / 2)
              y3 = c1y(row) + (h / 2 + 1.6667)
              weight = 1.6667
            }

            for (var n = 0; n < d.finalFours.length; n++) {
              svg.selectAll("c1seasonFF")
                .data([d.season])
                .enter().append("line").attr("class", "c1seasonD c1seasonFF")
                .attr("x1", function(d) {
                  return c1x(d)
                })
                .attr("x2", function(d) {
                  return c1x(d + .25)
                })
                .attr("y1", y1)
                .attr("y2", y1)
                .style("opacity", 0)
                .transition().duration(500).delay(700 + (15 * (row - (num - 25))))
                .style("opacity", 1)
                .style("stroke-linecap", "round")
                .style("stroke", cEvents.finalFour)
                .style("stroke-width", weight)
            }
            for (var n = 0; n < d.finals.length; n++) {
              svg.selectAll("c1seasonF")
                .data([d.season])
                .enter().append("line").attr("class", "c1seasonD c1seasonF")
                .attr("x1", function(d) {
                  return c1x(d)
                })
                .attr("x2", function(d) {
                  return c1x(d + .25)
                })
                .attr("y1", y2)
                .attr("y2", y2)
                .style("opacity", 0)
                .transition().duration(500).delay(700 + (15 * (row - (num - 25))))
                .style("opacity", 1)
                .style("stroke-linecap", "round")
                .style("stroke", cEvents.final)
                .style("stroke-width", weight)
            }
            for (var n = 0; n < d.titles.length; n++) {
              svg.selectAll("c1seasonT")
                .data([d.season])
                .enter().append("line").attr("class", "c1seasonD c1seasonT")
                .attr("x1", function(d) {
                  return c1x(d)
                })
                .attr("x2", function(d) {
                  return c1x(d + .25)
                })
                .attr("y1", y3)
                .attr("y2", y3)
                .style("opacity", 0)
                .transition().duration(500).delay(700 + (15 * (row - (num - 25))))
                .style("opacity", 1)
                .style("stroke-linecap", "round")
                .style("stroke", cEvents.title)
                .style("stroke-width", weight)
            }
          })
      })
    // draw overlays for mousevents
    svg.selectAll(".c1seasonMG")
      .data(data)
      .enter().append("g").attr("class", "c1seasonMG")
      .each(function(d, i) {
        var row = i;
        d3.select(this).selectAll(".c1seasonM")
          .data(d.seasons)
          .enter().append("line").attr("class", "c1seasonM")
          .attr("x1", function(d) {
            return c1x(d.season + .5)
          })
          .attr("x2", function(d) {
            return c1x(d.season + 1.5)
          })
          .attr("y1", function(d) {
            return c1y(row) + h / 2
          })
          .attr("y2", function(d) {
            return c1y(row) + h / 2
          })
          .style("stroke-linecap", "round")
          .style("stroke", "rgba(0,0,0,0)")
          .style("stroke-width", 15)
          .on("mouseover", function(d) {
            if (d.titles.length > 0 || d.finals.length > 0 || d.finalFours.length > 0) tip.show(d)
            d3.selectAll(".sl-" + row).style("stroke", "#3f3f3f")
            d3.selectAll(".c1label").style("fill", "#666")
            d3.select("#c1l-" + row).style("fill", "#b5b5b5")
          })
          .on("mouseout", function(d) {
            d3.selectAll(".c1season").style("stroke", "#444")
            d3.selectAll(".c1label").style("fill", "#b5b5b5")
            tip.hide(d)
          })
      })
  }

  function chart1Top(num, first) {
    var row = d3.select(".c1top").append("div").attr("class", "chart1rowmain c1elements c1axisContainer")
    var svg = row.append("svg").attr("class", "c1axisSVG").attr("height", 60).attr("width", w);

    svg.selectAll(".c1tick")
      .data(years)
      .enter().append("line").attr("class", "c1tick")
      .attr("x1", function(d) {
        return c1x(d)
      })
      .attr("x2", function(d) {
        return c1x(d)
      })
      .attr("y1", 0)
      .attr("y2", 73)
    svg.selectAll(".c1axisRect")
      .data(years2)
      .enter().append("rect").attr("class", "c1axisRect")
      .attr("x", function(d) {
        return c1x(d) - 15
      })
      .attr("y", 40)
      .attr("width", 30)
      .attr("height", 20)
      .style("fill", "#333")
    svg.selectAll(".c1axis")
      .data(years2)
      .enter().append("text")
      .attr("class", "c1axis")
      .attr("x", function(d) {
        return c1x(d)
      })
      .attr("y", 55)
      .text(function(d) {
        return d
      })
  }

  function searched(seasons, term, metros, key, first) {
    var delay = 0;
    if (!first) delay = 250;

    d3.selectAll(".searchRemove")
      // .transition().duration(delay).style("opacity", 0).delay(250)
      .remove();

    var searchData = seasons.filter(function(seasons) {
      return camelize(seasons.metro) === camelize(term)
    })[0]

    // var searchData = metros.filter(function(metros) {
    //   return camelize(metros.metro) === camelize(term);
    // })

    var svg = d3.select(".c1axisSVG");
    svg.call(tip)
    var h2 = 40;

    var row = d3.select(".c1axisContainer").append("div").attr("class", "c1search")
    // .style("transform", "translate(0,-40px)")

    if (first) {
      row.append("div").attr("class", "searchicon").html('<i id="searchsubmit" class="fas fa-search"></i>')
      row.append("div").attr("class", "searchcity").html('<input type="text" id="c1search-bar" class="search-bar" placeholder ="' + searchData.metro + '" />')

      $("#c1search-bar").easyAutocomplete(options);
    }

    svg.selectAll(".searchSeason")
      .data(searchData.seasons)
      .enter().append("line").attr("class", "searchSeason searchRemove")
      .attr("x1", function(d) {
        return c1x(searchData.seasons[0].season)
      })
      .attr("x2", function(d) {
        return c1x(searchData.seasons[0].season)
      })
      .attr("y1", function(d) {
        return h2 / 2
      })
      .attr("y2", function(d) {
        return h2 / 2
      })
      .transition().duration(750)
      // .delay(delay)
      .attr("x1", function(d) {
        return c1x(d.season)
      })
      .attr("x2", function(d) {
        return c1x(d.season + 1.1)
      })
      .style("stroke-linecap", "round")
      .style("stroke", "#444")
      .style("stroke-width", 5)
      .each(function(d, i) {
        var y1 = h2 / 2,
          y2 = h2 / 2,
          y3 = h2 / 2;
        var weight = 5;

        if (d.titles.length > 0 && d.finals.length > 0) {
          y3 = (h2 / 2 - 1.25)
          y2 = (h2 / 2 + 1.25)
          weight = 2.5
        } else if (d.finals.length > 0 && d.finalFours.length > 0) {
          y1 = (h2 / 2 - 1.25)
          y2 = (h2 / 2 + 1.25)
          weight = 2.5
        } else if (d.finals.length > 0 && d.finalFours.length > 0 && d.titles.length > 0) {
          y1 = (h2 / 2 - 1.6667)
          y2 = (h2 / 2)
          y3 = (h2 / 2 + 1.6667)
          weight = 1.6667
        }

        for (var n = 0; n < d.finalFours.length; n++) {
          svg.selectAll("searchDataFF")
            .data([d.season])
            .enter().append("line").attr("class", "searchRemove searchData searchDataFF")
            .attr("x1", function(d) {
              return c1x(d)
            })
            .attr("x2", function(d) {
              return c1x(d + .25)
            })
            .attr("y1", y1)
            .attr("y2", y1)
            .style("opacity", 0)
            .transition().duration(500).delay(700)
            .style("opacity", 1)
            .style("stroke-linecap", "round")
            .style("stroke", cEvents.finalFour)
            .style("stroke-width", weight)
        }
        for (var n = 0; n < d.finals.length; n++) {
          svg.selectAll("searchDataF")
            .data([d.season])
            .enter().append("line").attr("class", "searchRemove searchData searchDataF")
            .attr("x1", function(d) {
              return c1x(d)
            })
            .attr("x2", function(d) {
              return c1x(d + .25)
            })
            .attr("y1", y2)
            .attr("y2", y2)
            .style("opacity", 0)
            .transition().duration(500).delay(700)
            .style("opacity", 1)
            .style("stroke-linecap", "round")
            .style("stroke", cEvents.final)
            .style("stroke-width", weight)
        }
        for (var n = 0; n < d.titles.length; n++) {
          svg.selectAll("searchDataT")
            .data([d.season])
            .enter().append("line").attr("class", "searchRemove searchData searchDataT")
            .attr("x1", function(d) {
              return c1x(d)
            })
            .attr("x2", function(d) {
              return c1x(d + .25)
            })
            .attr("y1", y3)
            .attr("y2", y3)
            .style("opacity", 0)
            .transition().duration(500).delay(700)
            .style("opacity", 1)
            .style("stroke-linecap", "round")
            .style("stroke", cEvents.title)
            .style("stroke-width", weight)
        }
      })

    svg.selectAll(".searchM")
      .data(searchData.seasons)
      .enter().append("line").attr("class", "searchM searchRemove")
      .attr("y1", function(d) {
        return h2 / 2
      })
      .attr("y2", function(d) {
        return h2 / 2
      })
      .attr("x1", function(d) {
        return c1x(d.season + .5)
      })
      .attr("x2", function(d) {
        return c1x(d.season + 1.5)
      })
      .style("stroke-linecap", "round")
      .style("stroke", "rgba(0,0,0,0)")
      .style("stroke-width", 15)
      .on("mouseover", function(d) {
        if (d.titles.length > 0 || d.finals.length > 0 || d.finalFours.length > 0) tip.show(d)
        d3.selectAll(".searchSeason").style("stroke", "#3f3f3f")
      })
      .on("mouseout", function(d) {
        d3.selectAll(".searchSeason").style("stroke", "#444")
        tip.hide(d)
      })
  }
}

function drawChart2(metros) {
  var w, h, c2x, term;

  // metros.forEach(function(metros) {
  //   searchArray.push(metros.metro)
  // })

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
        addLast(term, key, metrics[key], metros, false);
      },
      onKeyEnterEvent: function() {
        term = $("#search-bar").val()
        addLast(term, key, metrics[key], metros, false);
      }
    }
  };

  var key = "titles",
    metrics = {
      titles: ["mlb", "nba", "nfl", "nhl", "mls", "cfl", "ncaa"],
      pro: ["mlb", "nba", "nfl", "nhl", "mls", "cfl"],
      ncaa: ["ncaa_baseball_m", "ncaa_basketball_m", "ncaa_basketball_w", "ncaa_football_m", "ncaa_soccer_w", "ncaa_volleyball_w"]
    },
    subfilters = {
      professional: ["MLB", "NBA", "NFL", "NHL", "MLS", "CFL"],
      college: ["Baseball (M)", "Basketball (M)", "Basketball (W)", "Football (M)", "Soccer (W)", "Volleyball (W)"]
    };

  if (userPlace != undefined) {
    term = userPlace.metro;
  } else {
    term = "Twin Cities, MN";
  }

  chart2(key, metrics[key], metros)
  addLast(term, key, metrics[key], metros, true);

  $(".c2option").click(function() {
    $(".c2option").removeClass("c2optionActive")
    $(this).addClass("c2optionActive")
    key = $(this).attr("key")
    if (key === "titles") $("#chart2headertext").text("Sports")
    if (key === "pro") $("#chart2headertext").text("Pro Sports")
    if (key === "ncaa") $("#chart2headertext").text("College Sports")
    d3.selectAll(".c2remove").remove();
    d3.selectAll(".c2subfilter").remove();
    drawSubfilter(key, metrics[key], metros)
    chart2(key, metrics[key], metros);
    addLast(term, key, metrics[key], metros, true);
  })

  function drawSubfilter(key, metrics, metros) {
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
        chart2(key, newMetric, metros);
        addLast(term, key, newMetric, metros, false);
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
        chart2(key, newMetric, metros);
        addLast(term, key, newMetric, metros, false);
      })
    }

  } // end drawSubfilter

  function chart2(key, metrics, metros) {
    var data = metros.sort(function(a, b) {
      return d3.descending(+a[key], +b[key]);
    }).slice(0, 10);

    updateRight(0)

    function updateRight(n) {
      $("#c2city").text(data[n].metro)
      $("#c2numTitles").text(data[n].titles)
      $("#c2numTeams").text(parseArray(data[n].teamList).length)
      d3.selectAll(".c2winListRow").remove();

      for (var i = 0; i < parseArray(data[n].teamList).length; i++) {
        var c2winListRow = d3.select("#c2winList").append("div").attr("class", "c2winListRow").text(parseArray(data[n].teamList)[i])
        if (c2winListRow.text().includes("MLB")) c2winListRow.style("color", cLeagues.mlb)
        if (c2winListRow.text().includes("NBA")) c2winListRow.style("color", cLeagues.nba)
        if (c2winListRow.text().includes("NFL")) c2winListRow.style("color", cLeagues.nfl)
        if (c2winListRow.text().includes("NHL")) c2winListRow.style("color", cLeagues.nhl)
        if (c2winListRow.text().includes("MLS")) c2winListRow.style("color", cLeagues.mls)
        if (c2winListRow.text().includes("CFL")) c2winListRow.style("color", cLeagues.cfl)
        if (contains(c2winListRow.text(), subfilters.college)) c2winListRow.style("color", cLeagues.ncaa)
      }
    } // end updateRight

    var max = d3.max(data, function(d) {
      return +d[key]; //<-- convert to number
    })

    c2x = d3.scaleLinear().domain([0, 74])

    for (var i = 0; i < data.length; i++) {
      var row = d3.select(".chart2left").append("div").attr("class", "c2remove chart2row chart2rowMain").attr("id", "row" + i);

      row.on("mouseover", function() {
        d3.selectAll(".chart2rowMain").style("background-color", "#333")
        d3.select(this).style("background-color", "#444")
        updateRight(d3.select(this).attr("id").replace("row", ""))
      })

      h = 15
      w = $(".chart2row").width() - 225;

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
      row.append("div").attr("class", "c2remove chart2city").text(data[i].metro)
      var svg = row.append("svg").attr("class", "c2remove chart2svg").attr("height", h).attr("width", w);

      for (var j = 0; j < metrics.length; j++) {

        var x1 = 0;

        for (var k = 0; k < j; k++) {
          if (data[i][metrics[k]] > 0) x1 += c2x(data[i][metrics[k]])
        }

        if (data[i][metrics[j]] > 0) {
          svg.append("rect")
            .attr("class", "c2rect c2remove")
            .attr("id", "c2text" + camelize(data[i].metro) + "-" + camelize(metrics[j]))
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
              .attr("class", "c2text c2remove chart2label c2text" + camelize(data[i].metro) + "-" + camelize(metrics[j]))
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
              .attr("class", "c2text c2remove chart2label c2text" + camelize(data[i].metro) + "-" + camelize(metrics[j]))
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
    }

  } // end chart2

  function addLast(term, key, metrics, metros, first) {
    d3.selectAll(".lastRemove").remove()

    var lastData = metros.filter(function(placeData) {
      return camelize(placeData.metro) === camelize(term);
    })

    if (!first) {

      $("#c2city").text(lastData[0].metro)
      $("#c2numTitles").text(lastData[0].titles)
      d3.selectAll(".c2winListRow").remove();

      if (parseArray(lastData[0].teamList) != undefined) {
        $("#c2numTeams").text(parseArray(lastData[0].teamList).length)
        for (var i = 0; i < parseArray(lastData[0].teamList).length; i++) {
          var c2winListRow = d3.select("#c2winList").append("div").attr("class", "c2winListRow").text(parseArray(lastData[0].teamList)[i])
          if (c2winListRow.text().includes("MLB")) c2winListRow.style("color", cLeagues.mlb)
          if (c2winListRow.text().includes("NBA")) c2winListRow.style("color", cLeagues.nba)
          if (c2winListRow.text().includes("NFL")) c2winListRow.style("color", cLeagues.nfl)
          if (c2winListRow.text().includes("NHL")) c2winListRow.style("color", cLeagues.nhl)
          if (c2winListRow.text().includes("MLS")) c2winListRow.style("color", cLeagues.mls)
          if (c2winListRow.text().includes("CFL")) c2winListRow.style("color", cLeagues.cfl)
          if (contains(c2winListRow.text(), subfilters.college)) c2winListRow.style("color", cLeagues.ncaa)
        }
      }
    }

    var row = d3.select(".chart2left").append("div").attr("class", "lastRemove chart2row c2remove chart2lastrow");
    row.append("div").attr("class", "lastRemove c2remove chart2rank").html('<i id="searchsubmit" class="fas fa-search"></i>')
    row.append("div").attr("class", "lastRemove c2remove chart2city").html('<input type="text" id="search-bar" class="search-bar" placeholder="' + lastData[0].metro + '" />')
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
          .attr("id", "c2text" + camelize(lastData[0].metro) + "-" + camelize(metrics[j]))
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
            .attr("class", "c2text c2remove chart2label c2text" + camelize(lastData[0].metro) + "-" + camelize(metrics[j]))
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
            .attr("class", "c2text c2remove chart2label c2text" + camelize(lastData[0].metro) + "-" + camelize(metrics[j]))
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

// SUPPS
function camelize(str) {
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function parseArray(value) {
  return JSON.parse("[" + value + "]")[0]
}

function findClosest(metros) {
  var mindif = 99999;
  var closest;

  for (i = 0; i < metros.length; ++i) {
    var dif = PythagorasEquirectangular(userCoord[0], userCoord[1], parseArray(metros[i].lngLat)[1], parseArray(metros[i].lngLat)[0]);
    if (dif < mindif) {
      closest = i;
      mindif = dif;
    }
  }
  userPlace = metros[closest]
}

function contains(target, pattern) {
  var value = 0;
  pattern.forEach(function(word) {
    value = value + target.includes(word);
  });
  return (value === 1)
}

function ipLookUp() {
  $.ajax('http://ip-api.com/json')
    .then(
      function success(response) {
        userCoord.push(response.lat, response.lon)
      }
    );
}