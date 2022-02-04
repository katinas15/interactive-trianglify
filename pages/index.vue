<template>
  <div>
    <canvas id="bg"></canvas>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6"> nice content </v-col>
    </v-row>
  </div>
</template>

<script>
import Background from '../utils/trianglifyBackground.ts'
export default {
  data() {
    return {
      backgroud: {},
    }
  },
  mounted() {
    const width = window.innerWidth
    const height = window.innerHeight
    const canvas = document.querySelector('#bg')
    this.background = new Background({
      width,
      height,
      canvas,
      cellSize: 110,
      variance: 1,
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
