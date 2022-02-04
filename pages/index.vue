<template>
  <div>
    <div class="content">
      <v-row class="mt-3 ml-2">
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn x-small dark v-bind="attrs" v-on="on">
              Background Options
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Background Options</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-slider
                    v-model="backgroundMovementSpeed"
                    step="10"
                    thumb-label
                    ticks
                  ></v-slider>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </div>

    <canvas id="bg"></canvas>
  </div>
</template>

<script>
import Background from '../utils/trianglifyBackground.ts'
export default {
  props: {},
  data() {
    return {
      dialog: false,
      opts: {
        backgroundMovementSpeed: 0.5,
        minBackgroundCircleSize: 2,
        maxBackgroundCircleSize: 5,
        cellSize: 110,
        variance: 1,
      },
      backgroud: {},
    }
  },
  mounted() {
    const width = window.innerWidth
    const height = window.innerHeight
    const canvas = document.querySelector('#bg')
    this.background = new Background({
      ...this.opts,
      width,
      height,
      canvas,
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

.content {
  position: relative;
  z-index: 1;
}
</style>
