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

    const points = getPoints({
      width,
      height,
      cellSize: 70,
      variance: 0.9,
    })

    let enableCall = true
    document.addEventListener('mousemove', (event) => {
      if (!enableCall) return
      enableCall = false

      const localPoints = [...points]
      localPoints.push([event.clientX, event.clientY])

      const canvas = document.querySelector('#bg')
      const pattern = trianglify({
        width,
        height,
        xColors: [
          '#f7fbff',
          '#deebf7',
          '#c6dbef',
          '#9ecae1',
          '#6baed6',
          '#4292c6',
          '#2171b5',
          '#08519c',
          '#08306b',
        ],
        points: localPoints,
      })

      const patternCanvas = pattern.toCanvas()
      patternCanvas.setAttribute('id', 'bg')

      canvas.replaceWith(patternCanvas)
      setTimeout(() => (enableCall = true), 50)
    })
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
