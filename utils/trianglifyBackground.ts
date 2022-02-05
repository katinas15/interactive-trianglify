import trianglify from 'trianglify'

const MOUSE_CURSOR_RADIUS = 5
const FRAME_DELAY: number = 1000 / 30 // 30fps
const CLICK_TEXT_OFFSET = 10
const CLICK_TEXT_FONT = '14px Trebuchet MS'
const CIRCLE_COLOR = '#000'

interface Options {
  canvas: HTMLCanvasElement
  width: number
  height: number
  cellSize: number
  variance: number
  minCircleSpeed: number
  maxCircleSpeed: number
  minCircleSize: number
  maxCircleSize: number
  xColors: string[]
  circleColor?: string
}

const generatePoints = (opts: Options) => {
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

const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

const generateMovementDirection = (
  minCircleSpeed: number,
  maxCircleSpeed: number
) => {
  const x = getRandomArbitrary(minCircleSpeed, maxCircleSpeed)
  const y = getRandomArbitrary(minCircleSpeed, maxCircleSpeed)
  return [x, y]
}

const generateCircleSize = (minCircleSize: number, maxCircleSize: number) => {
  const max = maxCircleSize
  const min = minCircleSize
  return Math.random() * (max - min) + min
}

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  point: number[],
  radius: number = MOUSE_CURSOR_RADIUS,
  color: string
) => {
  ctx.beginPath()
  ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI)

  ctx.closePath()

  if (color) {
    ctx.fillStyle = color
    ctx.fill()
  }
}

export default class Background {
  private ctx: CanvasRenderingContext2D | null
  private points: number[][] = []
  private movementDirections: number[][] = []
  private circleSizes: number[] = []
  private clicked = false
  private enableCallMouse = true
  private mousePos = [0, 0]

  constructor(public opts: Options) {
    this.initializePoints()
    this.ctx = this.opts.canvas.getContext('2d')

    this.handleClicks()
    this.handleMouseMovement()
    this.handleResize()

    this.updateFrame.bind(this)
    setInterval(this.updateFrame, FRAME_DELAY)
  }

  public setOpts = (opts: Options): void => {
    this.opts = opts
    this.initializePoints()
  }

  private initializePoints = () => {
    this.points = generatePoints(this.opts)
    this.movementDirections = this.points.map(() => {
      return generateMovementDirection(
        this.opts.minCircleSpeed,
        this.opts.maxCircleSpeed
      )
    })

    this.circleSizes = this.points.map(() => {
      return generateCircleSize(
        this.opts.minCircleSize,
        this.opts.maxCircleSize
      )
    })
  }

  private handleClicks = () => {
    this.opts.canvas.addEventListener('click', (event) => {
      this.points.push([event.clientX, event.clientY])
      this.movementDirections.push(
        generateMovementDirection(
          this.opts.minCircleSpeed,
          this.opts.maxCircleSpeed
        )
      )
      this.circleSizes.push(
        generateCircleSize(this.opts.minCircleSize, this.opts.maxCircleSize)
      )
      this.clicked = true
    })
  }

  private handleMouseMovement = () => {
    this.opts.canvas.addEventListener('mousemove', (event) => {
      if (!this.enableCallMouse) return
      this.enableCallMouse = false
      this.mousePos = [event.clientX, event.clientY]
      setTimeout(() => {
        this.enableCallMouse = true
      }, FRAME_DELAY)
    })
  }

  private handleResize = () => {
    window.addEventListener('resize', () => {
      this.opts.width = window.innerWidth
      this.opts.height = window.innerHeight
      this.initializePoints()
    })
  }

  private updatePoints = () => {
    this.points = this.points.map(([x, y], index) => {
      if (x > this.opts.width || x < 0) {
        this.movementDirections[index][0] *= -1
      }

      if (y > this.opts.height || y < 0) {
        this.movementDirections[index][1] *= -1
      }
      const [xSpeed, ySpeed] = this.movementDirections[index]
      const [xMove, yMove] = [x + xSpeed, y + ySpeed]
      return [xMove, yMove]
    })

    const localPoints = [...this.points]
    if (this.mousePos) {
      localPoints.push([this.mousePos[0], this.mousePos[1]])
    }

    const pattern = trianglify({
      width: this.opts.width,
      height: this.opts.height,
      xColors: this.opts.xColors,
      points: localPoints,
    })

    pattern.toCanvas(this.opts.canvas)
  }

  private updateCircles = () => {
    this.points.forEach((point: number[], index: number) => {
      if (this.ctx == null) return
      return drawCircle(
        this.ctx,
        point,
        this.circleSizes[index],
        this.opts.circleColor || CIRCLE_COLOR
      )
    })
  }

  private updateText = () => {
    if (!this.clicked && this.ctx) {
      this.ctx.font = CLICK_TEXT_FONT
      this.ctx.fillText(
        'Click!',
        this.mousePos[0] + CLICK_TEXT_OFFSET,
        this.mousePos[1] - CLICK_TEXT_OFFSET
      )
    }
  }

  private updateFrame = () => {
    this.updatePoints()
    this.updateCircles()

    if (this.ctx)
      drawCircle(this.ctx, this.mousePos, MOUSE_CURSOR_RADIUS, CIRCLE_COLOR)

    this.updateText()
  }
}
