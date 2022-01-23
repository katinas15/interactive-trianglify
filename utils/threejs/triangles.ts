import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Delaunator from 'delaunator'
import chroma from 'chroma-js'

const colorPalette = [
  '#ffffe5',
  '#f7fcb9',
  '#d9f0a3',
  '#addd8e',
  '#78c679',
  '#41ab5d',
  '#238443',
  '#006837',
  '#004529',
]
const colorSpace = 'lab'

export default class ThreeJSBackground {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private controls: OrbitControls

  constructor(private canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.position.setZ(30)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.addSceneHelpers()
    this.animate()
  }

  public addSceneHelpers() {
    const ambientLight = new THREE.AmbientLight(0x404040)
    this.scene.add(ambientLight)

    const gridHelper = new THREE.GridHelper(200, 50)
    this.scene.add(gridHelper)

    const color2 = new THREE.Color(0xffeeee)
    this.scene.background = color2
  }

  public animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.controls.update()

    this.renderer.render(this.scene, this.camera)
  }

  public triangulate() {
    const xScale = chroma.scale(colorPalette).mode(colorSpace)
    const yScale = chroma.scale(colorPalette).mode(colorSpace)

    const points = getPoints(
      {
        width: window.innerWidth,
        height: window.innerHeight,
        cellSize: 50,
        variance: 0.75,
      },
      Math.random()
    )

    console.warn(points)

    let geomIndices = Delaunator.from(points).triangles

    console.warn(geomIndices)

    const cRand = Math.random()
    const polys = []

    for (let i = 0; i < geomIndices.length; i += 3) {
      // convert shallow array-packed vertex indices into 3-tuples
      const vertexIndices = [
        geomIndices[i],
        geomIndices[i + 1],
        geomIndices[i + 2],
      ]

      // grab a copy of the actual vertices to use for calculations
      const vertices = vertexIndices.map((i) => points[i])

      const centroid = getCentroid(vertices)
      const xPercent = normalize(centroid.x / window.innerWidth)
      const yPercent = normalize(centroid.y / window.innerHeight)

      const color: chrome.Color = interpolateLinear({
        xPercent, // x-coordinate of centroid, normalized to [0, 1]
        yPercent, // y-coordinate of centroid, normalized to [0, 1]
        xScale, // x-colors scale for the pattern
        yScale, // y-colors scale for the pattern
        colorSpace, // options used to initialize the pattern
      })
      // const a = points[geomIndices[i]]
      // const b = points[geomIndices[i + 1]]
      // const c = points[geomIndices[i + 2]]

      // const color = xScale(cRand).hex()
      // const material = new THREE.MeshBasicMaterial({
      //     color: color,
      //     side: THREE.DoubleSide,
      // })

      // const poly = new THREE.Mesh(
      //     new THREE.Geometry().fromPoints([a, b, c]),
      //     material
      // )

      // polys.push(poly)
      polys.push({
        vertexIndices,
        centroid,
        color, // chroma color object
      })
    }

    console.warn(polys)
  }
}

interface interpolateLinearOptions {
  xPercent: number
  yPercent: number
  xScale: chroma.Scale
  yScale: chroma.Scale
  colorSpace: chroma.InterpolationMode
}
// Linear interpolation of two gradients, one for the x and one for the y
// axis. This is the default Trianglify color function.
// The bias parameter controls how prevalent the y axis is versus the x axis
const interpolateLinear =
  (bias = 0.5) =>
  ({
    xPercent,
    yPercent,
    xScale,
    yScale,
    colorSpace,
  }: interpolateLinearOptions) =>
    chroma.mix(xScale(xPercent), yScale(yPercent), bias, colorSpace)

const normalize = (num: number) => Math.max(0, Math.min(1, num))

const getCentroid = (d) => {
  return {
    x: (d[0][0] + d[1][0] + d[2][0]) / 3,
    y: (d[0][1] + d[1][1] + d[2][1]) / 3,
  }
}

const getPoints = (
  options: {
    width: number
    height: number
    cellSize: number
    variance: number
  },
  random: number
) => {
  const { width, height, cellSize, variance } = options

  // pad by 2 cells outside the visible area on each side to ensure we fully
  // cover the 'artboard'
  const colCount = Math.floor(width / cellSize) + 4
  const rowCount = Math.floor(height / cellSize) + 4

  // determine bleed values to ensure that the grid is centered within the
  // artboard
  const bleedX = (colCount * cellSize - width) / 2
  const bleedY = (rowCount * cellSize - height) / 2

  // apply variance to cellSize to get cellJitter in pixels
  const cellJitter = cellSize * variance
  const getJitter = () => (Math.random() - 0.5) * cellJitter

  const pointCount = colCount * rowCount

  const halfCell = cellSize / 2

  const points = Array(pointCount)
    .fill(null)
    .map((_, i) => {
      const col = i % colCount
      const row = Math.floor(i / colCount)

      // [x, y, z]
      return [
        -bleedX + col * cellSize + halfCell + getJitter(),
        -bleedY + row * cellSize + halfCell + getJitter(),
      ]
    })

  return points
}
