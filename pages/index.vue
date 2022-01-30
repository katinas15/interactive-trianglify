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

const FRAME_DELAY = 33
const BACKGROUND_MOVEMENT_SPEED = 1
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

    const movementEveryFrame = points.map(() => {
      const x = (Math.random() * 2 - 1) * BACKGROUND_MOVEMENT_SPEED
      const y = (Math.random() * 2 - 1) * BACKGROUND_MOVEMENT_SPEED
      return [x, y]
    })

    let enableCallMouse = true
    let mousePos = [0, 0]
    document.addEventListener('mousemove', (event) => {
      if (!enableCallMouse) return
      enableCallMouse = false
      mousePos = [event.clientX, event.clientY]
      setTimeout(() => {
        enableCallMouse = true
      }, FRAME_DELAY)
    })

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

      const canvas = document.querySelector('#bg')
      const pattern = trianglify({
        width,
        height,
        xColors: ['#000000', '#0C0C0C', '#000000'],
        // xColors: [
        //   '#000000',
        //   '#0C0C0C',
        //   '#000000',
        //   '#9ecae1',
        //   '#6baed6',
        //   '#4292c6',
        //   '#2171b5',
        //   '#08519c',
        //   '#08306b',
        // ],
        points: localPoints,
      })

      const patternCanvas = pattern.toCanvas()
      patternCanvas.setAttribute('id', 'bg')

      canvas.replaceWith(patternCanvas)
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
