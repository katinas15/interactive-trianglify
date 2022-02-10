<template>
  <div>
    <div class="content">
      <v-row class="mt-3 ml-2">
        <v-dialog v-model="dialogOptions" max-width="600px">
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
                  <v-subheader>Circle Speed</v-subheader>

                  <v-range-slider
                    v-model="speedRange"
                    :max="MAX_CIRCLE_SPEED"
                    :min="MIN_CIRCLE_SPEED"
                    hide-details
                    :step="STEP_SIZE"
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
                        @input="$set(speedRange, 0, $event)"
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
                        @input="$set(speedRange, 1, $event)"
                      ></v-text-field>
                    </template>
                  </v-range-slider>
                </v-row>

                <v-row>
                  <v-subheader>Circle Size</v-subheader>

                  <v-range-slider
                    v-model="circleSize"
                    :max="MAX_CIRCLE_SIZE"
                    :min="MIN_CIRCLE_SIZE"
                    hide-details
                    :step="STEP_SIZE"
                    class="align-center"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        :value="circleSize[0]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @input="$set(circleSize, 0, $event)"
                      ></v-text-field>
                    </template>
                    <template v-slot:append>
                      <v-text-field
                        :value="circleSize[1]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @input="$set(circleSize, 1, $event)"
                      ></v-text-field>
                    </template>
                  </v-range-slider>
                </v-row>

                <v-row>
                  <v-subheader>Cell Size</v-subheader>

                  <v-slider
                    v-model="cellSize"
                    :max="MAX_CELL_SIZE"
                    :min="MIN_CELL_SIZE"
                    hide-details
                    :step="STEP_SIZE"
                    class="align-center"
                  >
                    <template v-slot:append>
                      <v-text-field
                        :value="cellSize"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                      ></v-text-field>
                    </template>
                  </v-slider>
                </v-row>

                <v-row>
                  <v-subheader>Start Variance</v-subheader>

                  <v-slider
                    v-model="variance"
                    :max="MAX_VARIANCE"
                    :min="MIN_VARIANCE"
                    hide-details
                    :step="STEP_SIZE"
                    class="align-center"
                  >
                    <template v-slot:append>
                      <v-text-field
                        :value="variance"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                      ></v-text-field>
                    </template>
                  </v-slider>
                </v-row>

                <v-row class="mt-n3">
                  <v-subheader class="mt-2">Show Cursor</v-subheader>
                  <v-checkbox v-model="showCursor"></v-checkbox>
                </v-row>

                <v-row class="mt-n6">
                  <v-subheader class="mt-4">Circle Color</v-subheader>

                  <v-dialog v-model="dialogCircle" max-width="400px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-col>
                        <v-btn
                          :color="circleColor"
                          class="ma-2"
                          width="150px"
                          @click="dialogCircle = true"
                        >
                          {{ circleColor }}
                        </v-btn>
                      </v-col>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">Color Picker</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-color-picker
                            v-model="selectedCircleColor"
                          ></v-color-picker>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red darken-1"
                          text
                          @click="dialogCircle = false"
                        >
                          Close
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="
                            circleColor = selectedCircleColor
                            dialogCircle = false
                          "
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-row>

                <div class="mt-3 mb-5 ml-1">Colors (Click to edit)</div>
                <v-row :key="xColors.length">
                  <v-dialog v-model="dialogColors" max-width="400px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-col>
                        <v-btn
                          v-for="(color, index) in xColors"
                          :key="'color' + index"
                          :color="color"
                          class="ma-2"
                          width="150px"
                          @click="
                            selectedColor = { color, index }
                            dialogColors = true
                          "
                        >
                          {{ index }}: {{ color }}
                        </v-btn>
                      </v-col>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">Color Picker</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-color-picker
                            v-model="selectedColor.color"
                          ></v-color-picker>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red darken-1"
                          text
                          @click="dialogColors = false"
                        >
                          Close
                        </v-btn>
                        <v-btn
                          color="red darken-1"
                          text
                          @click="
                            xColors.splice(selectedColor.index, 1)
                            dialogColors = false
                          "
                        >
                          Remove
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="
                            xColors[selectedColor.index] = selectedColor.color
                            dialogColors = false
                          "
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-select
                v-model="selectedPreset"
                :items="presets"
                label="Color Presets"
                item-text="name"
                return-object
                single-line
                class="mr-5"
                @change="changePreset"
              ></v-select>
              <v-btn text class="mr-10" @click="xColors.push('#000000')">
                Add color
              </v-btn>
              <v-btn color="red" text @click="reset()"> Reset </v-btn>
              <v-btn color="blue darken-1" text @click="dialogOptions = false">
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

const SPEED_RANGE = [-0.5, 0.5]
const CIRCLE_SIZE = [2, 5]
const CELLSIZE = 110
const VARIANCE = 1
const CIRCLE_COLOR = '#000000'

export default {
  props: {
    presets: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      STEP_SIZE: 0.1,
      MAX_CIRCLE_SPEED: 20,
      MIN_CIRCLE_SPEED: -20,
      MAX_CIRCLE_SIZE: 30,
      MIN_CIRCLE_SIZE: 0,
      MIN_CELL_SIZE: 20,
      MAX_CELL_SIZE: 500,
      MIN_VARIANCE: 0,
      MAX_VARIANCE: 1,
      width: 0,
      height: 0,
      canvas: null,
      dialogOptions: false,
      dialogColors: false,
      dialogCircle: false,
      speedRange: SPEED_RANGE,
      circleSize: CIRCLE_SIZE,
      cellSize: CELLSIZE,
      variance: VARIANCE,
      circleColor: CIRCLE_COLOR,
      selectedCircleColor: CIRCLE_COLOR,
      showCursor: true,
      xColors: [],
      selectedColor: '#ffffff',
      background: {},
      selectedPreset: {
        ...this.presets[Math.floor(Math.random() * this.presets.length)],
      },
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
        xColors: this.xColors,
        circleColor: this.circleColor,
        showCursor: this.showCursor,
      }
    },
  },
  mounted() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas = document.querySelector('#bg')
    this.background = new Background(this.opts)
    this.changePreset(this.selectedPreset)
  },
  methods: {
    changePreset(value) {
      this.xColors = value.xColors !== undefined ? value.xColors : this.xColors
      this.circleSize =
        value.circleSize !== undefined ? value.circleSize : this.circleSize
      this.showCursor =
        value.showCursor !== undefined ? value.showCursor : this.showCursor
      this.updateBackground()
    },
    updateBackground() {
      this.background.setOpts(this.opts)
    },
    reset() {
      this.speedRange = SPEED_RANGE
      this.circleSize = CIRCLE_SIZE
      this.cellSize = CELLSIZE
      this.variance = VARIANCE
      this.changePreset(PRESETS[Math.floor(Math.random() * PRESETS.length)])
      this.updateBackground()
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
