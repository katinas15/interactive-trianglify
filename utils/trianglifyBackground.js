const BACKGROUND_MOVEMENT_SPEED = 1
const MIN_BACKGROUND_CIRCLE_RADIUS = 2

export const MAX_BACKGROUND_CIRCLE_RADIUS = 5

export const generatePoints = (opts) => {
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

export const generateMovementDirection = () => {
  const x = (Math.random() * 2 - 1) * BACKGROUND_MOVEMENT_SPEED
  const y = (Math.random() * 2 - 1) * BACKGROUND_MOVEMENT_SPEED
  return [x, y]
}

export const generateCircleSize = () => {
  const max = MAX_BACKGROUND_CIRCLE_RADIUS
  const min = MIN_BACKGROUND_CIRCLE_RADIUS
  return Math.random() * (max - min) + min
}
