// MISSION WORLDWIDE
var small_screen, medium_screen, large_screen, windowW, windowH, mapW, mapH, settings;

// import formatData from '../sample/nodesData.js';
import worldData from '../data/worldData.js';
import coordinates from '../data/coordinates.js';

var container = d3.select('#scrolly-overlay');
var stepSel = container.selectAll('.step');

// -- scales --
var sizeScale = d3.scaleSqrt()
  .domain([0, d3.max(worldData.data, d => d.pop)])
  .range([10, 80]);
var colour = d3.scaleOrdinal(d3.schemeCategory10);
var continents = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']

// INIT
function resize() {
  windowW = window.innerWidth;
  windowH = window.innerHeight;

  large_screen = false;
  medium_screen = false;
  small_screen = false;

  if (windowW >= 1025) {
    large_screen = true;
  } else if (windowW >= 650) {
    medium_screen = true;
  } else if (windowW < 650) {
    small_screen = true;
  }

  mapW = $('#map').width();
  mapH = $('#map').height();

  settings = {
    width: mapW,
    height: mapH,
    padding: 0,
    gravity: 0,
    colourPoints: '#f77e5e',
    colourVoronoi: 'none',
    margin: {
      top: 10,
      right: 10,
      bottom: 40,
      left: 10
    }
  }
}

function init() {
  window.addEventListener('resize', resize);
  resize();

  dorlingMap(true, worldData.data, settings, 'Large', 'pop')
  dorlingMap(false, worldData.data, settings, 'Large', 'pop')

  // -- scrolly --
  enterView({
    selector: stepSel.nodes(),
    offset: 0.5,
    enter: function(el) {
      var index = +d3.select(el).attr('data-index');
      $('.step').removeClass('active');
      $(el).addClass('active');
      if (index === 0) dorlingMap(false, worldData.data, settings, 'Small', 'pop')
      if (index === 1) dorlingMap(false, worldData.data, settings, 'Small', 'giniBetterThan')
    },
    exit: function(el) {
      var index = +d3.select(el).attr('data-index');
      $('.step').removeClass('active');
      $(el).addClass('active');
    }
  });
}

init();


// FORMAT DATA
function formatData(data, config, metric) {
  const {
    sizeScale,
    width,
    height
  } = config;

  const pixelLoc = d3.geoMercator()
    .scale([width * 0.2])
    .translate([width / 2, height / 2]);

  // map coordinates to values
  data.forEach((node, i) => {
    node.coordinates = coordinates[node.alias]
    if (node.coordinates[0]) {
      node.cx = pixelLoc(node.coordinates)[0]
    } else {
      console.warn('can\'t find coordinates for:', node)
    }
    node.cy = pixelLoc(node.coordinates)[1]
    if (node[metric] != '-') {
      node.radius = sizeScale(node[metric]);
    } else {
      node.radius = 10;
    }
  })
  const formattedData = data;
  return data
}

function dorlingMap(first, data, config, size, metric) {
  const {
    margin,
    width,
    height,
    padding
  } = config;

  var w = width - margin.left - margin.right;
  var h = height - margin.top - margin.bottom;

  if (first) {
    var svg = d3.select('#map')
      .append('svg')
      .attr('class', 'dorling-chart')
      .attr('width', width)
      .attr('height', height);
    var g = svg.append('g')
      .attr('class', 'group')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    var legend = d3.select('#legend');

    continents.forEach(function(d, i) {
      legend.append('rect')
        .attr('x', function() {
          if (i === 0) return 0;
          if (i === 1) return 70;
          if (i === 2) return 130;
          if (i === 3) return 200;
          if (i === 4) return 310;
          if (i === 5) return 385;
        })
        .attr('y', 10)
        .attr('width', 15)
        .attr('height', 15)
        .style('fill', colour(d))
      legend.append('text')
        .attr('x', function() {
          if (i === 0) return 0;
          if (i === 1) return 70;
          if (i === 2) return 130;
          if (i === 3) return 200;
          if (i === 4) return 310;
          if (i === 5) return 385;
        })
        .attr('y', 10)
        .attr('dx', 20)
        .attr('dy', 10)
        .text(d)
    })

  } else {
    var svg = d3.select('#map > svg')
      .transition()
      .attr('width', width)
      .attr('height', height),
      g = d3.select('.group'),
      legend = d3.select('#legend');
  }

  var filterData = data.filter(function(d) {
    if (size === 'Small') return d.size === 'Small';
    if (size === 'Large') return d.size === 'Small' || d.size === 'Large';
  })

  if (metric === 'gini') {
    sizeScale.domain([d3.max(filterData, d => d[metric]), d3.min(filterData, d => d[metric])]).range([10, 50])
  } else {
    sizeScale.domain([0, d3.max(filterData, d => d[metric])]).range([10, 50])
  }

  var nodesData = formatData(filterData, {
    sizeScale,
    width: mapW - 100,
    height: mapH
  }, metric);

  var simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(20))
    .force('center', d3.forceCenter(w * .45, h / 2))
    .force('collision', d3.forceCollide().radius(d => d.radius * 1.5 + padding))
    .force('x', d3.forceX().x(d => d.cx))
    .force('y', d3.forceY().y(d => d.cy))

  var rect = g.selectAll('rect')
    .data(nodesData, function(d) {
      return d.label;
    });

  rect.enter().append('rect')
    .attr('width', d => d.radius * 2)
    .attr('height', d => d.radius * 2)
    .attr('class', (d, i) => 'nodes g-circles-' + i + ' c-' + i)
    .style('fill', d => colour(d.continent))
    .style('stroke', '#191919')
    .style('stroke-width', 1.25)
    .style('pointer-events', 'none')
    .merge(rect).transition()
    .attr('width', d => d.radius * 2)
    .attr('height', d => d.radius * 2)

  rect.exit().transition().attr('width', 0).attr('height', 0).remove();

  var text1 = g.selectAll('.text1')
    .data(nodesData, function(d) {
      return d.label;
    });
  var text2 = g.selectAll('.text2')
    .data(nodesData, function(d) {
      return d.label;
    });
  var text3 = g.selectAll('.text3')
    .data(nodesData, function(d) {
      return d.label;
    });

  text1.enter().append('text')
    .attr('class', 'text1 country-labels')
    .style('text-anchor', 'middle')
    .attr('dy', d => (d.label.split(' ').length > 1) ? ((d.label.split(' ').length > 2) ? d.radius - 6 : d.radius - 1) : d.radius + 4)
    .attr('dx', d => d.radius)
    .text(d => (d.radius > 25) ? d.label.split(' ')[0] : '')
    .style('pointer-events', 'none')
    .merge(text1).transition()
    .attr('dy', d => (d.label.split(' ').length > 1) ? ((d.label.split(' ').length > 2) ? d.radius - 6 : d.radius - 1) : d.radius + 4)
    .attr('dx', d => d.radius)
    .text(d => (d.radius > 25) ? d.label.split(' ')[0] : '');

  text2.enter().append('text')
    .attr('class', 'text2 country-labels')
    .style('text-anchor', 'middle')
    .attr('dy', d => (d.label.split(' ').length > 1) ? ((d.label.split(' ').length > 2) ? d.radius + 4 : d.radius + 9) : d.radius + 4)
    .attr('dx', d => d.radius)
    .text(d => (d.radius > 25) ? d.label.split(' ')[1] : '')
    .style('pointer-events', 'none')
    .merge(text2).transition()
    .attr('dy', d => (d.label.split(' ').length > 1) ? ((d.label.split(' ').length > 2) ? d.radius + 4 : d.radius + 9) : d.radius + 4)
    .attr('dx', d => d.radius)
    .text(d => (d.radius > 25) ? d.label.split(' ')[1] : '');

  text3.enter().append('text')
    .attr('class', 'text3 country-labels')
    .style('text-anchor', 'middle')
    .attr('dy', d => (d.label.split(' ').length > 1) ? ((d.label.split(' ').length > 2) ? d.radius + 14 : d.radius + 9) : d.radius + 4)
    .attr('dx', d => d.radius)
    .text(d => (d.radius > 25) ? d.label.split(' ')[2] : '')
    .style('pointer-events', 'none')
    .merge(text3).transition()
    .attr('dy', d => (d.label.split(' ').length > 1) ? ((d.label.split(' ').length > 2) ? d.radius + 14 : d.radius + 9) : d.radius + 4)
    .attr('dx', d => d.radius)
    .text(d => (d.radius > 25) ? d.label.split(' ')[2] : '');

  text1.exit().transition().style('opacity', 0).remove();
  text2.exit().transition().style('opacity', 0).remove();
  text3.exit().transition().style('opacity', 0).remove();

  // VORONOI
  var voronoi = d3.voronoi()
    .x(d => d.x)
    .y(d => d.y)
    .extent([
      [-100, -20],
      [width, height]
    ])

  var voronoiGroup = g.append('g')
    .attr('class', 'voronoi')

  // RUN
  simulation
    .nodes(nodesData)
    .on('tick', ticked)

  function ticked() {
    // nodes.attr('transform', d => 'translate(' + (d.x - d.radius) + ',' + (d.y - d.radius) + ')')
    rect.attr('transform', d => 'translate(' + (d.x - d.radius) + ',' + (d.y - d.radius) + ')');
    // rect.attr('x', function(d) {
    //     return Math.max(d.radius, Math.min(w - d.radius, d.x - d.radius));
    //   })
    //   .attr('y', function(d) {
    //     return Math.max(d.radius, Math.min(h - d.radius, d.y - d.radius));
    //     // return d.y - d.radius
    //   })
    text1.attr('transform', d => 'translate(' + (d.x - d.radius) + ',' + (d.y - d.radius) + ')');
    text2.attr('transform', d => 'translate(' + (d.x - d.radius) + ',' + (d.y - d.radius) + ')');
    text3.attr('transform', d => 'translate(' + (d.x - d.radius) + ',' + (d.y - d.radius) + ')');
    voronoi.x(d => d.x).y(d => d.y)
    // voronoiGroup.selectAll('path')
    //   .data(voronoi(nodesData).polygons())
    //   .enter().append('path')
    // voronoiGroup.selectAll('path')
    //   .attr('d', renderCell)
    //   .attr('stroke', config.colourVoronoi)
    //   .style('pointer-events', 'all')
    //   .attr('class', (d, i) => ' v-' + i)
    //   .on('mouseover', mouseOverEvent)
  }

  // voronoi path
  function renderCell(d) {
    return d == null ? null : 'M' + d.join('L') + 'Z'
  }

  function mouseOverEvent(d, i) {
    svg.selectAll('circle')
      .style('fill', config.colourPoints)
      .interrupt()
      .filter('circle.c-' + i)
      .transition()
      .duration(150)
      .ease(d3.easeLinear)
      .style('fill', config.colourVoronoi)
  }

}



// SUPPLEMENTARY, MY DEAR WATSON
function camelize(str) {
  return str
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, '');
}

function parseArray(value) {
  return JSON.parse('[' + value + ']')[0];
}

function Deg2Rad(deg) {
  return (deg * Math.PI) / 180;
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


//