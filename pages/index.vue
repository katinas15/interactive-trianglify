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
                  <v-range-slider
                    v-model="speedRange"
                    :max="MAX_CIRCLE_SPEED"
                    :min="MIN_CIRCLE_SPEED"
                    hide-details
                    class="align-center"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        :value="speedRange[0]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @change="$set(speedRange, 0, $event)"
                      ></v-text-field>
                    </template>
                    <template v-slot:append>
                      <v-text-field
                        :value="speedRange[1]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @change="$set(speedRange, 0, $event)"
                      ></v-text-field>
                    </template>
                  </v-range-slider>
                </v-row>
                <v-row>
                  <v-slider
                    v-model="opts.backgroundMovementSpeed"
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
      MAX_CIRCLE_SPEED: 20,
      MIN_CIRCLE_SPEED: -20,
      width: 0,
      height: 0,
      canvas: null,
      dialog: false,
      speedRange: [-0.5, 0.5],
      circleSize: [2, 5],
      cellSize: 110,
      variance: 1,
      background: {},
    }
  },
  computed: {
    opts() {
      return {
        width: this.width,
        height: this.height,
        canvas: this.canvas,
        minCircleSpeed: this.speedRange[0],
        maxCircleSpeed: this.speedRange[1],
        minCircleSize: this.circleSize[0],
        maxCircleSize: this.circleSize[1],
        cellSize: this.cellSize,
        variance: this.variance,
      }
    },
  },
  watch: {
    opts: {
      handler() {
        this.updateBackground()
      },
      deep: true,
    },
  },
  mounted() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas = document.querySelector('#bg')
    this.background = new Background(this.opts)
  },
  methods: {
    updateBackground() {
      this.background.setOpts(this.opts)
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

.content {
  position: relative;
  z-index: 1;
}
</style>
