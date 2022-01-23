import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
}
