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
import {
  generatePoints,
  generateMovementDirection,
  generateCircleSize,
  MAX_BACKGROUND_CIRCLE_RADIUS,
} from '../utils/trianglifyBackground'

const FRAME_DELAY = 1000 / 30 // 30fps
const CLICK_TEXT_OFFSET = 10
const CLICK_TEXT_FONT = '14px Trebuchet MS'

export default {
  data() {
    return {}
  },
  mounted() {
    const width = window.innerWidth
    const height = window.innerHeight
    const canvas = document.querySelector('#bg')
    const ctx = canvas.getContext('2d')
    const circleColor = '#000'

    let points = generatePoints({
      width,
      height,
      cellSize: 100,
      variance: 0,
    })

    const movementEveryFrame = points.map(() => {
      return generateMovementDirection()
    })

    const circleSizes = points.map(() => {
      return generateCircleSize()
    })

    let enableCallMouse = true
    let clicked = false
    let mousePos = [0, 0]

    document.addEventListener('click', (event) => {
      points.push([event.clientX, event.clientY])
      movementEveryFrame.push(generateMovementDirection())
      circleSizes.push(generateCircleSize())
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

      pattern.toCanvas(canvas)

      const drawCircle = (
        ctx,
        point,
        radius = MAX_BACKGROUND_CIRCLE_RADIUS,
        color
      ) => {
        ctx.beginPath()
        ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI)

        ctx.closePath()

        if (color) {
          ctx.fillStyle = color
          ctx.fill()
        }
      }

      pattern.points.forEach((point, index) => {
        drawCircle(ctx, point, circleSizes[index], circleColor)
      })

      if (!clicked) {
        ctx.font = CLICK_TEXT_FONT
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
