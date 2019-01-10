import coordinates from './coordinates.js'
const d3 = window.d3

export default function(data, config) {
  config = {
    sizeScale: d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.value)])
      .range([0, 80]),
    width: 800,
    height: 600,
    ...config
  }
  const {
    sizeScale,
    width,
    height
  } = config

  const pixelLoc = d3.geoMercator()
    .scale([width * 0.2])
    .translate([width / 2, height / 2])

  console.log('data', data)
  // map coordinates to values
  data.forEach((node, i) => {
    node.coordinates = coordinates[node.alias]
    if (node.coordinates[0]) {
      node.cx = pixelLoc(node.coordinates)[0]
    } else {
      console.warn('can\'t find coordinates for:', node)
    }
    node.cy = pixelLoc(node.coordinates)[1]
    node.radius = sizeScale(node.value)
    // console.log('------------------------')
    // console.log('node.coordinates[0]', node.coordinates[0])
    // console.log('pixelLoc(node.coordinates)[0]', pixelLoc(node.coordinates)[0])
    // console.log('xScale(pixelLoc(node.coordinates)[0])', xScale(pixelLoc(node.coordinates)[0]))
    // console.log('------------------------')
  })
  return data
}