<template>
  <div>
    <canvas id="bg"></canvas>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6"> </v-col>
    </v-row>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      torus: null,
      controls: null,
    }
  },
  mounted() {
    this.init()
    this.animate()

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
    const material = new THREE.MeshStandardMaterial({
      color: 0xff4532,
    })

    const pointLight = new THREE.PointLight(0xffeeff)
    pointLight.position.set(10, 0, 10)

    const ambientLight = new THREE.AmbientLight(0x404040)
    this.scene.add(ambientLight)

    const lightHelper = new THREE.PointLightHelper(pointLight)
    const gridHelper = new THREE.GridHelper(200, 50)
    this.scene.add(lightHelper, gridHelper)

    const color2 = new THREE.Color(0xffeeee)
    this.scene.background = color2

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.scene.add(pointLight)
    this.torus = new THREE.Mesh(geometry, material)
    this.scene.add(this.torus)
  },
  methods: {
    init() {
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      this.renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
      })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.camera.position.setZ(30)
    },
    animate() {
      requestAnimationFrame(this.animate)
      if (this.torus) {
        this.torus.rotation.x += 0.01
      }

      if (this.controls) {
        this.controls.update()
      }
      this.renderer.render(this.scene, this.camera)
    },
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
