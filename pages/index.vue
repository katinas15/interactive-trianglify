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
export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
    }
  },
  mounted() {
    this.init()
    this.animate()

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
    const material = new THREE.MeshBasicMaterial({
      color: 0xff4532,
      wireframe: true,
    })
    const torus = new THREE.Mesh(geometry, material)
    this.scene.add(torus)
    this.renderer.render(this.scene, this.camera)
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
