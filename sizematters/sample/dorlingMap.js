// renders component
import formatData from './nodesData'
const d3 = window.d3

var chartw = $('#scrolly-overlay > figure').width();


function dorlingMap(bind, data, config) {
  config = {
    width: 960,
    height: 500,
    padding: 5,
    gravity: 20,
    colorPoints: '#f77e5e',
    colorVoronoi: '#3dbd5d',
    margin: {
      top: 10,
      right: 10,
      bottom: 40,
      left: 10
    },
    ...config
  }
  const {
    margin,
    width,
    height,
    padding
  } = config
  // helpers (so can add legends etc)
  const w = width - margin.left - margin.right
  const h = height - margin.top - margin.bottom
  // scales
  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.value)])
    .range([0, 80])

  // create svg in passed in div
  const svg = d3.select(bind)
    .append('svg')
    .attr('class', 'dorling-chart')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // format the data to include geo positions
  const nodesData = formatData(data, {
    sizeScale,
    width: w,
    height: h
  })
  console.log('nodesData', nodesData)

  // set up simulations
  const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(30))
    .force('center', d3.forceCenter(w / 2, h / 2))
    .force('collision', d3.forceCollide().radius(d => d.radius + padding))
    .force('x', d3.forceX().x(d => d.cx))
    .force('y', d3.forceY().y(d => d.cy))

  // use a group for circles and text placement
  const nodes = svg.selectAll('.node-group')
    .data(nodesData)
    .enter().append('g')
    .attr('class', (d, i) => 'nodes g-circles-' + i)

  // append bubbles
  nodes.append('circle')
    .attr('r', d => d.radius)
    .attr('class', (d, i) => ' c-' + i)
    .style('fill', config.colorPoints)
    .style('pointer-events', 'none')

  // labels for each circle
  nodes.append('text')
    .style('text-anchor', 'middle')
    .attr('dy', 5)
    .attr('class', 'country-labels')
    // show the text only if the circle is large enough
    .text(d => (d.radius > 15) ? d.alias : '')
    .style('pointer-events', 'none')

  // setup  voronoi
  const voronoi = d3.voronoi()
    .x(d => d.x)
    .y(d => d.y)
    .extent([
      [-100, -20],
      [width, height]
    ])
  // voronoi container
  const voronoiGroup = svg.append('g')
    .attr('class', 'voronoi')

  // run simulation
  simulation
    .nodes(nodesData)
    .on('tick', ticked)

  // position the groups to geo data positions
  function ticked() {
    nodes
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
    // keep the voronoi in sync with force
    voronoi.x(d => d.x).y(d => d.y)
    voronoiGroup.selectAll('path')
      .data(voronoi(nodesData).polygons())
      .enter().append('path')
    voronoiGroup.selectAll('path')
      .attr('d', renderCell)
      .attr('stroke', config.colorVoronoi)
      .style('pointer-events', 'all')
      .attr('class', (d, i) => ' v-' + i)
      .on('mouseover', mouseOverEvent)
      .on('click', clickEvent)
  }

  // voronoi path
  function renderCell(d) {
    return d == null ? null : 'M' + d.join('L') + 'Z'
  }
  // events just for some feedback/interaction
  function mouseOverEvent(d, i) {
    // show the info
    d3.select('.info').text(`${nodesData[i].label} : ${nodesData[i].value}`)
    // make a visual change
    svg.selectAll('circle')
      .style('fill', config.colorPoints)
      .interrupt()
      .filter(`circle.c-${i}`)
      .transition()
      .duration(150)
      .ease(d3.easeLinear)
      .style('fill', config.colorVoronoi)
  }

  function clickEvent(d, i) {
    console.log('nodesData[i]', nodesData[i])
  }
}

export default dorlingMap