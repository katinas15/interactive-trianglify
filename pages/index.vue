<template>
  <div>
    <canvas id="bg"></canvas>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6"> nice content </v-col>
    </v-row>
  </div>
</template>

<script>
import trianglify from 'trianglify'

const FRAME_DELAY = 1000 / 30 // 30fps
const BACKGROUND_MOVEMENT_SPEED = 1
const MAX_BACKGROUND_CIRCLE_RADIUS = 5
const MIN_BACKGROUND_CIRCLE_RADIUS = 2
const CLICK_TEXT_OFFSET = 10

export default {
  data() {
    return {}
  },
  mounted() {
    const width = window.innerWidth
    const height = window.innerHeight

    const getPoints = (opts) => {
      const { width, height, cellSize, variance } = opts

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

    let points = getPoints({
      width,
      height,
      cellSize: 100,
      variance: 0.9,
    })

    const getFrameMovement = () => {
      const x = (Math.random() * 2 - 1) * BACKGROUND_MOVEMENT_SPEED
      const y = (Math.random() * 2 - 1) * BACKGROUND_MOVEMENT_SPEED
      return [x, y]
    }

    const movementEveryFrame = points.map(() => {
      return getFrameMovement()
    })

    const getCircleSize = () => {
      const max = MAX_BACKGROUND_CIRCLE_RADIUS
      const min = MIN_BACKGROUND_CIRCLE_RADIUS
      return Math.random() * (max - min) + min
    }

    const circleSizes = points.map(() => {
      return getCircleSize()
    })

    let enableCallMouse = true
    let clicked = false
    let mousePos = [0, 0]

    document.addEventListener('click', (event) => {
      points.push([event.clientX, event.clientY])
      movementEveryFrame.push(getFrameMovement())
      circleSizes.push(getCircleSize())
      clicked = true
    })

    document.addEventListener('mousemove', (event) => {
      if (!enableCallMouse) return
      enableCallMouse = false
      mousePos = [event.clientX, event.clientY]
      setTimeout(() => {
        enableCallMouse = true
      }, FRAME_DELAY)
    })

    const canvas = document.querySelector('#bg')
    setInterval(function () {
      points = points.map(([x, y], index) => {
        if (x > width || x < 0) {
          movementEveryFrame[index][0] *= -1
        }

        if (y > height || y < 0) {
          movementEveryFrame[index][1] *= -1
        }
        const [xSpeed, ySpeed] = movementEveryFrame[index]
        const [xMove, yMove] = [x + xSpeed, y + ySpeed]
        return [xMove, yMove]
      })

      const localPoints = [...points]
      if (mousePos) {
        localPoints.push([mousePos[0], mousePos[1]])
      }

      const pattern = trianglify({
        width,
        height,
        // xColors: ['#000000', '#0C0C0C', '#000000'],
        xColors: [
          '#000000',
          '#0D0D0D',
          '#351409',
          '#a15501',
          '#d0902f',
          '#fff69f',
          '#fdd870',
          '#d0902f',
          '#a15501',
          '#351409',
          '#0D0D0D',
          '#000000',
        ],

        // xColors: ['#fff69f', '#fdd870', '#d0902f', '#a15501', '#351409'],
        // xColors: ['#C78B06', '#C78B06', '#5D430A', '#DED765', '#310D01'],
        points: localPoints,
      })

      // console.warn(pattern)

      pattern.toCanvas(canvas)

      const drawCircle = (
        ctx,
        point,
        radius = MAX_BACKGROUND_CIRCLE_RADIUS,
        color
      ) => {
        // console.warn(poly)
        // console.warn(vertexIndices)
        ctx.beginPath()
        ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI)

        ctx.closePath()

        if (color) {
          ctx.fillStyle = color
          ctx.fill()
        }
      }

      const ctx = canvas.getContext('2d')
      const color = '#000'
      pattern.points.forEach((point, index) => {
        drawCircle(ctx, point, circleSizes[index], color)
      })

      if (!clicked) {
        ctx.font = '14px Trebuchet MS'
        ctx.fillText(
          'Click!',
          mousePos[0] + CLICK_TEXT_OFFSET,
          mousePos[1] - CLICK_TEXT_OFFSET
        )
      }
    }, FRAME_DELAY)
  },
}
</script>

<style scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
