d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};

// MISSION WORLDWIDE
var small_screen, medium_screen, large_screen, windowW, windowH,
  local_coords = [],
  searchArray = [],
  teams = [],
  colours = [],
  sideD, fullD, smallD, c1x, c1yW, c1yD, threeD = false;
var colour_scale = d3.scaleOrdinal().domain([]).range([]);

var annottype = d3.annotationCustomType(
  d3.annotationLabel, {
    'className': 'custom',
    'connector': {
      'type': 'elbow',
      'end': 'dot'
    },
    'note': {
      'align': 'bottom',
      'orientation': 'leftRight'
    }
  })

// DATA
var data_outfields = [],
  data_infields = [],
  data_historic = [],
  data_walls = [];


var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1FJw9RMHYKeevS4E1YML_dlzogJ1pnowVw5W_vDNf4No/edit?usp=sharing';

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
    w: $('.side > figure').width() - 5 - 0,
    h: $('.side > figure').height() - 12 - 30,
    top: 12,
    right: 5,
    bottom: 30,
    left: 10
  }

  wideD = {
    w: $('.content > figure').width() - 5 - 0,
    h: $('.content > figure').height() - 12 - 30,
    top: 12,
    right: 5,
    bottom: 30,
    left: 10
  }

  smallD = {
    w: $('.step').width() - 5 - 0,
    h: 100,
    top: 12,
    right: 5,
    bottom: 30,
    left: 20
  }

  outfield_overlay_resize();
} //end resize

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

  sideD = {
    w: $('.side > figure').width() - 5 - 0,
    h: $('.side > figure').height() - 12 - 30,
    top: 12,
    right: 5,
    bottom: 30,
    left: 10
  }

  wideD = {
    w: $('.content > figure').width() - 5 - 0,
    h: $('.content > figure').height() - 12 - 30,
    top: 12,
    right: 5,
    bottom: 30,
    left: 10
  }

  smallD = {
    w: $('.step').width() - 5 - 0,
    h: 100,
    top: 12,
    right: 5,
    bottom: 30,
    left: 20
  }

  // Scrolly
  var container = d3.selectAll('body');
  var stepSel = container.selectAll('.step');

  enterView({
    selector: stepSel.nodes(),
    offset: 0.5,
    enter: function(el) {
      var index = +d3.select(el).attr('data-index');
      stepSel.classed('active', (d, i) => i === index);
      chartone_update(index, index - 1)
    },
    exit: function(el) {
      var index = +d3.select(el).attr('data-index');
      stepSel.classed('active', (d, i) => i === index);
      chartone_update(index, index + 1)
    }
  });

  $('#show3d_angels').on('mouseover', function() {
    show3d('losAngelesAngels');
  }).on('mouseout', function() {
    hide3d('losAngelesAngels');
  })
  $('#show3d_astros').on('mouseover', function() {
    show3d('houstonAstros');
  }).on('mouseout', function() {
    hide3d('houstonAstros');
  })
  $('#show3d_redsox').on('mouseover', function() {
    show3d('bostonRedSox');
  }).on('mouseout', function() {
    hide3d('bostonRedSox');
  })
  $('#show3d_cubs').on('mouseover', function() {
    show3d('chicagoCubs');
  }).on('mouseout', function() {
    hide3d('chicagoCubs');
  })
  $('#show3d_yankees').on('mouseover', function() {
    show3d('newYorkYankees');
  }).on('mouseout', function() {
    hide3d('newYorkYankees');
  })
  $('#show3d_bluejays').on('mouseover', function() {
    show3d('torontoBlueJays');
  }).on('mouseout', function() {
    hide3d('torontoBlueJays');
  })
  $('#show3d_athletics').on('mouseover', function() {
    show3d('oaklandAthletics');
  }).on('mouseout', function() {
    hide3d('oaklandAthletics');
  })
  $('#show3d_cleveland').on('mouseover', function() {
    show3d('cleveland');
  }).on('mouseout', function() {
    hide3d('cleveland');
  })


}

function loadData() {

  d3.csv('data/wallheights.csv', type, function(error, data) {
    if (error) throw error;

    data = data.columns.slice(1).map(function(id) {
      return {
        team: id,
        values: data.map(function(d) {
          return {
            angle: d.angle,
            height: d[id]
          };
        })
      };
    });

    data.forEach(function(d) {
      d.values = d.values.filter(function(d) {
        return d.height > 0;
      })
    })

    Array.prototype.push.apply(data_walls, data);
  })

  // queue()
  //   .defer(d3.csv, 'data/wallheights.csv')
  //   // .defer(d3.csv, 'data/dimensions.csv')
  //   // .defer(d3.csv, 'data/outfields.csv')
  //   .await(process_wall_heights)
} // end loadData

function showInfo(raw, tabletop) {
  // data_outfields = raw;
  processData(raw);
}

function processData(outfields) {
  var infields = outfields.filter(function(d) {
    return d.team === 'infield_out' || d.team === 'infield_in' || d.team === 'infield_mound' || d.team === 'baselines'
  })
  var historic = outfields.filter(function(d) {
    return d.historic.length > 0;
  })
  outfields = outfields.filter(function(d) {
    return d.team != 'infield_out' && d.team != 'infield_in' && d.team != 'infield_mound' && d.team != 'baselines'
  })
  // outfields = outfields.filter(function(d) {
  //   return d.team === 'Toronto Blue Jays';
  // })
  // outfields = outfields.filter(function(d) {
  //   return d.team === 'Cleveland' || d.team === 'Los Angeles Angels' || d.team === 'Houston Astros' || d.team === 'Oakland Athletics' || d.team === 'Toronto Blue Jays' || d.team === 'New York Yankees' || d.team === 'Boston Red Sox'
  // })

  historic.forEach(function(d) {
    d.historic = JSON.parse(d.historic);
    d.annotations = JSON.parse(d.annotations);
    d.historic = d.historic.sort(function(a, b) {
      return d3.ascending(+a.year, +b.year)
    })
    d.historic.forEach(function(d) {
      d.coordinates = [];
      for (var i = 0; i < d.values.length; i++) {
        var coord = {
          x: d.values[i][0],
          y: d.values[i][1],
          cpx1: d.values[i][2],
          cpy1: d.values[i][3],
          cpx2: d.values[i][4],
          cpy2: d.values[i][5]
        }
        d.coordinates.push(coord);
      }
    })
  })

  infields.forEach(function(d) {
    d.values = JSON.parse(d.values);
    // d.wall_values = JSON.parse(d.wall_values);
    d.coordinates = [];

    for (var i = 0; i < d.values.length; i++) {
      var coord = {
        x: d.values[i][0],
        y: d.values[i][1],
        cpx1: d.values[i][2],
        cpy1: d.values[i][3],
        cpx2: d.values[i][4],
        cpy2: d.values[i][5]
      }
      d.coordinates.push(coord);
    }
  })

  outfields.forEach(function(d) {
    d.values = JSON.parse(d.values);
    d.coordinates = [];
    d.wall_flat = [];
    d.wall_wall = [];
    d.wall_pre_extrude = [];
    d.wall_extrude = [];

    colours.push(d.colour)
    teams.push(d.colour)

    for (var i = 0; i < d.values.length; i++) {
      var coord = {
        x: d.values[i][0],
        y: d.values[i][1],
        cpx1: d.values[i][2],
        cpy1: d.values[i][3],
        cpx2: d.values[i][4],
        cpy2: d.values[i][5]
      }
      d.coordinates.push(coord);
    }
    var wall_types = ['wall_values_start', 'wall_values_mid', 'wall_values_pre-extrude', 'wall_values_end'],
      walls = ['wall_flat', 'wall_wall', 'wall_pre_extrude', 'wall_extrude'];
    for (var n = 0; n < 4; n++) {
      d[wall_types[n]] = JSON.parse(d[wall_types[n]]);
      for (var i = 0; i < d[wall_types[n]].length; i++) {
        var wall_coord = {
          x: d[wall_types[n]][i][0],
          y: d[wall_types[n]][i][1],
          cpx1: d[wall_types[n]][i][2],
          cpy1: d[wall_types[n]][i][3],
          cpx2: d[wall_types[n]][i][4],
          cpy2: d[wall_types[n]][i][5]
        }
        d[walls[n]].push(wall_coord);
      }
    }
  })

  colour_scale.range(colours).domain(teams)

  Array.prototype.push.apply(data_outfields, outfields);
  Array.prototype.push.apply(data_infields, infields);
  Array.prototype.push.apply(data_historic, historic);
  outfield_overlay();
  chartone();
  wall_chart_side('fenway', 'Boston Red Sox');
  wall_chart_side('wrigley', 'Chicago Cubs');
  // chartone('Boston Red Sox')
}

function init() {
  window.addEventListener('resize', resize);

  Tabletop.init({
    key: publicSpreadsheetUrl,
    callback: showInfo,
    simpleSheet: true
  })

  setup()
  loadData();
} // end init

init()

function outfield_overlay() {
  var x_scale = d3.scaleLinear().domain([0, 125]).range([0, wideD.w]),
    y_scale = d3.scaleLinear().domain([0, 125]).range([0, wideD.w]);
  var svg = d3.select('.outfield_overlay').append('svg')
    .attr('width', wideD.w + wideD.left + wideD.right)
    .attr('height', wideD.w + wideD.left + wideD.right)
  var g = svg.append('g')
    .attr('transform', 'translate(' + wideD.left + ',' + wideD.top + ')');
  var infield = g.append('g');
  data_outfields.forEach(function(d, i) {
    var path = drawOutfield(x_scale, y_scale, d.coordinates, 1, 0);
    var outfield = g.append('g');

    var outfield_boundary = outfield.append('path')
      .attr('class', 'outfield_overlay-' + camelize(d.team))
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', d.colour)
      .style('stroke-width', 1.5);

    totalLength = outfield_boundary.node().getTotalLength();

    outfield_boundary
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition().duration(1000).delay((i * 500))
      .attr('stroke-dashoffset', 0)
      .transition().duration(750)
      .style('opacity', .1)
  })
  data_infields.forEach(function(d) {
    var path = drawOutfield(x_scale, y_scale, d.coordinates, 1, 0);

    infield.append('path')
      .attr('class', 'infield_overlay-' + camelize(d.team))
      .attr('d', path)
      .style('fill', d.colour)
      .style('stroke', 'none')
      .style('opacity', 0)
      .transition().duration(1000)
      .style('opacity', 1)
  })
};

function outfield_overlay_resize() {
  var x_scale = d3.scaleLinear().domain([0, 125]).range([0, wideD.w]),
    y_scale = d3.scaleLinear().domain([0, 125]).range([0, wideD.w]);
  var svg = d3.select('.outfield_overlay svg')
    .attr('width', wideD.w + wideD.left + wideD.right)
    .attr('height', wideD.w + wideD.left + wideD.right)
  data_outfields.forEach(function(d) {
    var path = drawOutfield(x_scale, y_scale, d.coordinates, 1, 0);
    svg.selectAll('.outfield_overlay-' + camelize(d.team)).attr('d', path).attr('stroke-dasharray', 0).attr('stroke-dashoffset', 0).style('opacity', .1);
  })
  data_infields.forEach(function(d) {
    var path = drawOutfield(x_scale, y_scale, d.coordinates, 1, 0);
    svg.selectAll('.infield_overlay-' + camelize(d.team)).attr('d', path);
  })
}

function drawOutfield(x_scale, y_scale, data, scale, translate) {
  var path = d3.path();
  data.forEach(function(d, i) {
    var x = x_scale(d.x),
      y = (y_scale(d.y) * scale) + y_scale(translate);
    if (d.cpy2 != undefined) {
      var cpx1 = x_scale(d.cpx1),
        cpx2 = x_scale(d.cpx2),
        cpy1 = (y_scale(d.cpy1) * scale) + y_scale(translate),
        cpy2 = (y_scale(d.cpy2) * scale) + y_scale(translate);
    }
    if (i === 0) path.moveTo(x, y)
    if (i < data.length) {
      if (i != 0 && d.cpy2 === undefined) path.lineTo(x, y)
      if (i != 0 && d.cpy2 != undefined) path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)
    }
  })
  return path;
}

function chartone() {
  c1x = d3.scaleLinear().domain([0, 125]).range([0, sideD.w]);
  c1y = d3.scaleLinear().domain([0, 125]).range([0, sideD.w]);

  var svg = d3.select('.chart1').append('svg')
    .attr('width', sideD.w + sideD.left + sideD.right)
    .attr('height', sideD.w + sideD.left + sideD.right);
  var g = svg.append('g').attr('class', 'group1')
    .attr('transform', 'translate(' + sideD.left + ',' + sideD.top + ')');
  var outfieldG = g.append('g').attr('class', 'group1-outfield'),
    infieldG = g.append('g');

  data_infields.forEach(function(d) {
    var path = drawOutfield(c1x, c1y, d.coordinates, 1, 0);

    infieldG.append('path')
      .attr('class', 'infield_overlay-' + camelize(d.team))
      .attr('d', path)
      .style('fill', d.colour)
      .style('stroke', 'none')
      .style('opacity', 0)
      .transition().duration(1000)
      .style('opacity', 1)
  })
  // detectIntersection();
} // end chartone

function chartone_historize(team) {
  c1x = d3.scaleLinear().domain([0, 125]).range([0, sideD.w]);
  c1y = d3.scaleLinear().domain([0, 125]).range([0, sideD.w]);

  var svg = d3.select('.chart1 svg')
    .attr('width', sideD.w + sideD.left + sideD.right)
    .attr('height', sideD.w + sideD.left + sideD.right);
  var g = d3.select('.group1-outfield')
  var data = data_historic.filter(function(d) {
    return d.team === team;
  })

  d3.selectAll('.outfield-remove, .outfield-historic, .outfield-wall').transition().style('opacity', 0).remove();

  data_infields.forEach(function(d) {
    var path = drawOutfield(c1x, c1y, d.coordinates, 1, 0);
    d3.selectAll('.infield_overlay-' + camelize(d.team))
      .transition()
      .attr('d', path)
  })

  data.forEach(function(d) {
    var colour = d.colour,
      team = d.team,
      length = d.historic.length,
      newest = d.historic[length - 1].year;

    d.historic.sort(function(a, b) {
      return d3.ascending(+a.year, +b.year)
    })
    d.historic.forEach(function(d, i) {
      var year = d.year;
      var path = drawOutfield(c1x, c1y, d.coordinates, 1, 0);
      var outfield = g.append('g').attr('class', 'outfield-g-historic');

      var outfield_boundary = outfield.append('path')
        .attr('class', function() {
          if (d.year === newest) return 'outfield-historic outfield-historic-' + camelize(team) + ' outfield-newest outfield-' + d.year
          return 'outfield-historic outfield-historic-' + camelize(team) + ' outfield-' + d.year
        })
        .attr('d', path)
        .style('fill', 'none')
        .style('stroke', colour)
        .style('stroke-width', 1.5);

      totalLength = outfield_boundary.node().getTotalLength();

      outfield_boundary
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition().duration(1500).delay((i * 1500))
        .attr('stroke-dashoffset', 0)
        .style('fill', 'none')
        .transition().duration(750)
        .style('opacity', function() {
          if (year === newest) return 1;
          return .1;
        })

      $('#' + camelize(team) + '-' + d.year).on('mouseover', function() {
        d3.selectAll('.outfield-historic').transition().style('opacity', .1).attr('stroke-dashoffset', 0)
        d3.select('.outfield-' + newest + '').transition().style('opacity', .1)
        d3.select('.outfield-' + d.year).moveToFront().transition().style('opacity', 1)


        d3.selectAll('.outfield-remove').transition().duration(1000).style('opacity', 1);
      }).on('mouseout', function() {
        d3.select('.outfield-' + d.year).transition().style('opacity', .1)
        d3.select('.outfield-' + newest + '').transition().style('opacity', 1)
      })
    })

    var annotations = d.annotations;

    annotations.forEach(function(d) {
      d.x = c1x(d.x)
      d.y = c1y(d.y)
    })

    var makeAnnotations = d3.annotation()
      .textWrap(150)
      .type(annottype)
      .annotations(annotations)

    var note = g.append('g')
      .attr('class', 'annotation-group outfield-remove')

    annotations.forEach(function(d) {
      note.append('rect')
        .attr('class', 'outfield-remove')
        .attr('x', function() {
          if (d.dx >= 0) return d.x + d.dx + 7;
          return d.x + d.dx - getTextWidth(d.note.title.toUpperCase(), '15px sans-serif') - 4;
        })
        .attr('y', d.y + d.dy + 3)
        .attr('width', getTextWidth(d.note.title.toUpperCase(), '15px sans-serif'))
        .attr('height', 15)
        .style('fill', 'yellow')
        .style('opacity', 0)
        .transition().duration(1000).delay(1500 * length)
        .style('opacity', 1);
      note.append('circle')
        .attr('class', 'outfield-remove')
        .attr('cx', d.x + 1)
        .attr('cy', d.y + 2)
        .attr('r', 5)
        .style('fill', 'yellow')
    })

    note.call(makeAnnotations)
      .style('opacity', 0)
      .transition().duration(1000).delay(1500 * length)
      .style('opacity', 1);

  }) // end chartone_historize
};

function chartone_threeDize(team) {
  c1x = d3.scaleLinear().domain([0, 125]).range([0, sideD.w]);
  c1y = d3.scaleLinear().domain([0, 125]).range([0, sideD.w]);

  var svg = d3.select('.chart1 svg')
    .attr('width', sideD.w + sideD.left + sideD.right)
    .attr('height', sideD.w + sideD.left + sideD.right);
  var g = d3.select('.group1-outfield')
  var data = data_historic.filter(function(d) {
    return d.team === team;
  })

  d3.selectAll('.outfield-historic').transition().style('opacity', .1).attr('stroke-dashoffset', 0)
  d3.selectAll('.outfield-newest').transition().style('opacity', 1).style('fill', 'rgba(255,255,255,.75)').attr('stroke-dashoffset', 0)

  data_infields.forEach(function(d) {
    var path = drawOutfield(c1x, c1y, d.coordinates, .6, 31.25);
    d3.selectAll('.infield_overlay-' + camelize(d.team))
      .transition().delay(250)
      .attr('d', path)
  })

  data.forEach(function(d) {
    var colour = d.colour,
      team = d.team,
      length = d.historic.length,
      newest = d.historic[length - 1].year;

    d.historic.sort(function(a, b) {
      return d3.ascending(+a.year, +b.year)
    })
    d.historic.forEach(function(d, i) {
      var year = d.year;
      var path = drawOutfield(c1x, c1y, d.coordinates, .6, 31.25);

      d3.select('.outfield-' + year)
        .transition().delay(250)
        .attr('d', path)
    })

    var path_flat = drawOutfield(c1x, c1y, d.wall_flat, 1, 0);
    var path_wall = drawOutfield(c1x, c1y, d.wall_wall, 1, 0);
    var path_pre_extrude = drawOutfield(c1x, c1y, d.wall_pre_extrude, 1, 0);
    var path_extrude = drawOutfield(c1x, c1y, d.wall_extrude, 1, 0);
    var wall = g.append('g');
    wall.append('path')
      .attr('class', 'outfield-wall')
      .attr('d', path_flat)
      .style('fill', 'none')
      .style('stroke', colour)
      .style('opacity', 0)
      .transition().delay(500)
      .style('opacity', 1)
      .transition().duration(1000)
      .attr('d', path_wall);
    wall.append('path')
      .attr('class', 'outfield-wall')
      .attr('d', path_pre_extrude)
      .style('fill', 'none')
      .style('stroke', colour)
      .style('opacity', 0)
      .transition().delay(1500)
      .style('opacity', 1)
      .transition().duration(1000)
      .attr('d', path_extrude);
  })
}

function wall_chart_side(stadium, team) {
  var svg = d3.select('.' + stadium + '-wall').append('svg')
    .attr('width', smallD.w + smallD.left + smallD.right)
    .attr('height', smallD.h + smallD.top + smallD.bottom);
  var g = svg.append('g')
    .attr('transform', 'translate(' + smallD.left + ',' + smallD.top + ')');

  var x = d3.scaleLinear().domain([135, 45]).range([0, smallD.w]),
    y = d3.scaleLinear().domain([0, 37]).range([smallD.h, 0]);

  var yAxis = d3.axisLeft(y)
    .tickSize(smallD.w)
    .tickValues([0, 8, 16, 24, 32, 38])
    .tickFormat(function(d) {
      return d + ''
    });

  var xAxis = d3.axisBottom(x)
    .tickValues([125, 90, 55])
    .tickSize(0)
    .tickFormat(function(d) {
      if (d === 125) return 'Left Field';
      if (d === 90) return 'Centre Field';
      if (d === 55) return 'Right Field';
    });

  g.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + smallD.w + ')')
    .call(yAxis);

  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + smallD.h + ')')
    .call(xAxis);

  var line = d3.line()
    .curve(d3.curveLinear)
    .x(function(d) {
      return x(d.angle);
    })
    .y(function(d) {
      return y(d.height);
    });

  g.selectAll('path')
    .data(data_walls).enter().append('path')
    .attr('d', function(d) {
      return line(d.values)
    })
    .style('fill', 'none')
    .style('stroke', function(d) {
      return colour_scale(d.team)
    })
    .style('stroke-width', function(d) {
      if (d.team === team) return 2
      return .8
    })
    .style('opacity', function(d) {
      if (d.team === team) return 1
      return .25
    })

}

function chartone_update(index, prev) {
  if (index === 0) {
    chartone_historize('Boston Red Sox');
  }
  if (index === 1) {
    chartone_threeDize('Boston Red Sox');
  }
  if (index === 2 && prev === 1) {
    chartone_historize('Chicago Cubs');
  }
  if (index === 3) {
    chartone_threeDize('Chicago Cubs');
  }

  // if (index === 0 && prev === 1) {
  //   threeD = false;
  //   homeplate = [c1x(52.052), c1y(86.4)];
  //
  //   for (var i = 0; i < data_outfields.length; i++) {
  //     var data = data_outfields[i];
  //     var path = d3.path();
  //
  //     for (var j = 0; j < data.coordinates.length; j++) {
  //       var x = c1x(data.coordinates[j].x),
  //         y = c1y(data.coordinates[j].y);
  //       if (data.coordinates[j].cpy2 != undefined) {
  //         var cpx1 = c1x(data.coordinates[j].cpx1),
  //           cpy1 = c1y(data.coordinates[j].cpy1),
  //           cpx2 = c1x(data.coordinates[j].cpx2),
  //           cpy2 = c1y(data.coordinates[j].cpy2);
  //       }
  //
  //       if (j === 0) path.moveTo(x, y);
  //       if (j < data.coordinates.length) {
  //         if (j != 0 && data.coordinates[j].cpy2 === undefined) {
  //           path.lineTo(x, y)
  //         }
  //         if (data.coordinates[j].cpy2 != undefined) path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)
  //       }
  //     }
  //     var outfield_boundary = g.selectAll('.outfield-' + camelize(data.team));
  //
  //     outfield_boundary.transition().duration(500)
  //       .attr('d', path)
  //       .style('opacity', .1);
  //   }
  //
  //   for (var i = 0; i < data_infields.length; i++) {
  //     var data = data_infields[i];
  //     var path = d3.path();
  //
  //     for (var j = 0; j < data.coordinates.length; j++) {
  //       var x = c1x(data.coordinates[j].x),
  //         y = c1y(data.coordinates[j].y);
  //       if (data.coordinates[j].cpy2 != undefined) {
  //         var cpx1 = c1x(data.coordinates[j].cpx1),
  //           cpy1 = c1y(data.coordinates[j].cpy1),
  //           cpx2 = c1x(data.coordinates[j].cpx2),
  //           cpy2 = c1y(data.coordinates[j].cpy2);
  //       }
  //       if (j === 0) path.moveTo(x, y);
  //       if (j < data.coordinates.length) {
  //         if (j != 0 && data.coordinates[j].cpy2 === undefined) {
  //           path.lineTo(x, y)
  //         }
  //         if (data.coordinates[j].cpy2 != undefined) path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)
  //       }
  //     }
  //
  //     g.selectAll('.infield-' + camelize(data.team))
  //       .transition().duration(500).delay(0)
  //       .attr('d', path)
  //   }
  // }

  // if (index === 1) {
  //   homeplate = [c1x(52.052), c1y(81.396)]
  //   threeD = true;
  //   for (var i = 0; i < data_outfields.length; i++) {
  //     var data = data_outfields[i];
  //     var path = d3.path();
  //
  //     for (var j = 0; j < data.coordinates.length; j++) {
  //       var x = c1x(data.coordinates[j].x),
  //         y = (c1y(data.coordinates[j].y) * .6) + c1y(29.556);
  //       if (data.coordinates[j].cpy2 != undefined) {
  //         var cpx1 = c1x(data.coordinates[j].cpx1),
  //           cpy1 = (c1y(data.coordinates[j].cpy1) * .6) + c1y(29.556),
  //           cpx2 = c1x(data.coordinates[j].cpx2),
  //           cpy2 = (c1y(data.coordinates[j].cpy2) * .6) + c1y(29.556);
  //       }
  //
  //       if (data.team === 'Houston Astros') {
  //         if (j === 13) {
  //           x = c1x(35.591)
  //           y = c1y(37.048)
  //         }
  //         if (j === 17) {
  //           x = c1x(31.141)
  //           y = c1y(39.125)
  //         }
  //         if (j === 21) {
  //           x = c1x(28.065)
  //           y = c1y(40.55)
  //         }
  //         if (j === 22) {
  //           x = c1x(28.065)
  //           y = c1y(40.55)
  //         }
  //       }
  //
  //       if (j === 0) path.moveTo(x, y);
  //       if (j < data.coordinates.length) {
  //         if (j != 0 && data.coordinates[j].cpy2 === undefined) {
  //           path.lineTo(x, y)
  //         }
  //         if (data.coordinates[j].cpy2 != undefined) path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)
  //       }
  //     }
  //     var outfield_boundary = g.selectAll('.outfield-' + camelize(data.team));
  //
  //     outfield_boundary.transition().duration(500)
  //       .attr('d', path)
  //       .attr('stroke-dashoffset', 0)
  //       .style('opacity', .1);
  //
  //     balls.forEach(function(d) {
  //       d.scaled = d.distance * 0.2036184011;
  //       d.rad = toRadians(d.angle);
  //       d.x = (Math.sin(d.rad) * d.scaled) * .6;
  //       d.y = (Math.cos(d.rad) * d.scaled) * .6;
  //     })
  //
  //     var ball = g.selectAll('.ball')
  //       .attr('cx', function(d) {
  //         return homeplate[0] + c1x(d.x);
  //       })
  //       .attr('cy', function(d) {
  //         return homeplate[1] - c1y(d.y);
  //       })
  //       .attr('r', 3)
  //   }
  //
  //   for (var i = 0; i < data_infields.length; i++) {
  //     var data = data_infields[i];
  //     var path = d3.path();
  //
  //     for (var j = 0; j < data.coordinates.length; j++) {
  //       var x = c1x(data.coordinates[j].x),
  //         y = (c1y(data.coordinates[j].y) * .6) + c1y(29.556);
  //       if (data.coordinates[j].cpy2 != undefined) {
  //         var cpx1 = c1x(data.coordinates[j].cpx1),
  //           cpy1 = (c1y(data.coordinates[j].cpy1) * .6) + c1y(29.556),
  //           cpx2 = c1x(data.coordinates[j].cpx2),
  //           cpy2 = (c1y(data.coordinates[j].cpy2) * .6) + c1y(29.556);
  //       }
  //       if (j === 0) path.moveTo(x, y);
  //       if (j < data.coordinates.length) {
  //         if (j != 0 && data.coordinates[j].cpy2 === undefined) {
  //           path.lineTo(x, y)
  //         }
  //         if (data.coordinates[j].cpy2 != undefined) path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)
  //       }
  //     }
  //
  //     g.selectAll('.infield-' + camelize(data.team))
  //       .transition().duration(500).delay(0)
  //       .attr('d', path)
  //   }
  // }
} // end chartone_update

function detectIntersection() { // https://bl.ocks.org/bricof/f1f5b4d4bc02cad4dea454a3c5ff8ad7
  var n_segments = 100;
  var svg = d3.select('.chart1').append('svg');

  for (var i = 0; i < data_outfields.length; i++) {
    var data = data_outfields[i];
    var path = svg.select('.outfield-' + data.team);

    var segments_g = svg.append('g');

    var pathEl = path.node();
    console.log(path)
    var pathLength = pathEl.getTotalLength();
    // var line = polygon.select('line');
  }
}

function show3d(which) {
  d3.selectAll('.outfield-' + which).moveToFront().transition().style('opacity', 1).style('stroke-weight', 4).style('fill', 'white')
  if (threeD) d3.selectAll('.fence-' + which).moveToFront().transition().style('opacity', 1).style('fill', 'white')
  d3.selectAll('.infield').moveToFront();
}

function hide3d(which) {
  d3.selectAll('.outfield-' + which).transition().style('opacity', .1).style('stroke-weight', 1).transition().style('fill', 'none')
  d3.selectAll('.fence-' + which).transition().style('opacity', 0)
}

function type(d, _, columns) {
  d.angle = +d.angle;
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}

// SUPPLEMENTARY, MY DEAR WATSON
function camelize(str) {
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function getTextWidth(text, font) {
  var canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement('canvas'));
  var context = canvas.getContext('2d');
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}