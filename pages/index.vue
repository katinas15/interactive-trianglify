<template>
  <div>
    <canvas id="bg"></canvas>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6"> </v-col>
    </v-row>
  </div>
</template>

<script>
import ThreeJSBackground from '../utils/threejs/triangles'

export default {
  data() {
    return {
      threeJSBackground: null,
    }
  },
  mounted() {
    this.threeJSBackground = new ThreeJSBackground(
      document.querySelector('#bg')
    )

    this.threeJSBackground.triangulate()
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
