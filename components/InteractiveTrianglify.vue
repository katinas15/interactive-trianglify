<template>
  <div>
    <div class="content">
      <v-row class="mt-3 ml-2">
        <v-dialog v-model="opts.dialogOptions" max-width="600px">
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
                    v-model="opts.speedRange"
                    :max="opts.MAX_CIRCLE_SPEED"
                    :min="opts.MIN_CIRCLE_SPEED"
                    hide-details
                    :step="opts.STEP_SIZE"
                    class="align-center"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        :value="opts.speedRange[0]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @input="$set(opts.speedRange, 0, $event)"
                      ></v-text-field>
                    </template>
                    <template v-slot:append>
                      <v-text-field
                        :value="opts.speedRange[1]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @input="$set(opts.speedRange, 1, $event)"
                      ></v-text-field>
                    </template>
                  </v-range-slider>
                </v-row>

                <v-row>
                  <v-subheader>Circle Size</v-subheader>

                  <v-range-slider
                    v-model="opts.circleSize"
                    :max="opts.MAX_CIRCLE_SIZE"
                    :min="opts.MIN_CIRCLE_SIZE"
                    hide-details
                    :step="opts.STEP_SIZE"
                    class="align-center"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        :value="opts.circleSize[0]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @input="$set(opts.circleSize, 0, $event)"
                      ></v-text-field>
                    </template>
                    <template v-slot:append>
                      <v-text-field
                        :value="opts.circleSize[1]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @input="$set(opts.circleSize, 1, $event)"
                      ></v-text-field>
                    </template>
                  </v-range-slider>
                </v-row>

                <v-row>
                  <v-subheader>Cell Size</v-subheader>

                  <v-slider
                    v-model="opts.cellSize"
                    :max="opts.MAX_CELL_SIZE"
                    :min="opts.MIN_CELL_SIZE"
                    hide-details
                    :step="opts.STEP_SIZE"
                    class="align-center"
                  >
                    <template v-slot:append>
                      <v-text-field
                        :value="opts.cellSize"
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
                    v-model="opts.variance"
                    :max="opts.MAX_VARIANCE"
                    :min="opts.MIN_VARIANCE"
                    hide-details
                    :step="opts.STEP_SIZE"
                    class="align-center"
                  >
                    <template v-slot:append>
                      <v-text-field
                        :value="opts.variance"
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
                  <v-checkbox v-model="opts.showCursor"></v-checkbox>
                </v-row>

                <v-row class="mt-n6">
                  <v-subheader class="mt-4">Circle Color</v-subheader>

                  <v-dialog v-model="opts.dialogCircle" max-width="400px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-col>
                        <v-btn
                          :color="opts.circleColor"
                          class="ma-2"
                          width="150px"
                          @click="opts.dialogCircle = true"
                        >
                          {{ opts.circleColor }}
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
                            v-model="opts.selectedCircleColor"
                          ></v-color-picker>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red darken-1"
                          text
                          @click="opts.dialogCircle = false"
                        >
                          Close
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="
                            opts.circleColor = opts.selectedCircleColor
                            opts.dialogCircle = false
                          "
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-row>

                <div class="mt-3 mb-5 ml-1">Colors (Click to edit)</div>
                <v-row :key="opts.xColors.length">
                  <v-dialog v-model="opts.dialogColors" max-width="400px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-col>
                        <v-btn
                          v-for="(color, index) in opts.xColors"
                          :key="'color' + index"
                          :color="color"
                          class="ma-2"
                          width="150px"
                          @click="
                            opts.selectedColor = { color, index }
                            opts.dialogColors = true
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
                            v-model="opts.selectedColor.color"
                          ></v-color-picker>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red darken-1"
                          text
                          @click="opts.dialogColors = false"
                        >
                          Close
                        </v-btn>
                        <v-btn
                          color="red darken-1"
                          text
                          @click="
                            opts.xColors.splice(opts.selectedColor.index, 1)
                            opts.dialogColors = false
                          "
                        >
                          Remove
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="
                            opts.xColors[opts.selectedColor.index] =
                              opts.selectedColor.color
                            opts.dialogColors = false
                          "
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-row>
                <v-select
                  v-model="opts.selectedPreset"
                  :items="presets"
                  label="Color Presets"
                  item-text="name"
                  return-object
                  single-line
                  width="60%"
                  class="mr-4 d-inline-block"
                  @change="changePreset"
                ></v-select>
                <v-btn
                  text
                  class="mr-8 d-inline-block"
                  @click="opts.xColors.push('#000000')"
                >
                  Add color
                </v-btn>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="red" text @click="reset()"> Reset </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="opts.dialogOptions = false"
              >
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
    randomizedPresets: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      background: {},
      opts: {
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
        selectedPreset: {
          ...this.randomizedPresets[
            Math.floor(Math.random() * this.randomizedPresets.length)
          ],
        },
      },
    }
  },
  computed: {
    computedOpts() {
      return {
        width: this.opts.width,
        height: this.opts.height,
        canvas: this.opts.canvas,
        minCircleSpeed: this.opts.speedRange[0],
        maxCircleSpeed: this.opts.speedRange[1],
        minCircleSize: this.opts.circleSize[0],
        maxCircleSize: this.opts.circleSize[1],
        cellSize: this.opts.cellSize,
        variance: this.opts.variance,
        xColors: this.opts.xColors,
        circleColor: this.opts.circleColor,
        showCursor: this.opts.showCursor,
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
    this.opts.width = window.outerWidth
    this.opts.height = window.innerHeight
    this.opts.canvas = document.querySelector('#bg')
    this.background = new Background(this.computedOpts)
    this.changePreset(this.opts.selectedPreset)
  },
  methods: {
    changePreset(value) {
      this.opts.xColors =
        value.xColors !== undefined ? value.xColors : this.opts.xColors
      this.opts.circleSize =
        value.circleSize !== undefined ? value.circleSize : this.opts.circleSize
      this.opts.showCursor =
        value.showCursor !== undefined ? value.showCursor : this.opts.showCursor
      this.updateBackground()
    },
    updateBackground() {
      this.background.setOpts(this.computedOpts)
    },
    reset() {
      this.opts.speedRange = SPEED_RANGE
      this.opts.circleSize = CIRCLE_SIZE
      this.opts.cellSize = CELLSIZE
      this.opts.variance = VARIANCE
      this.opts.width = window.innerWidth
      this.opts.height = window.innerHeight
      this.changePreset(
        this.randomizedPresets[
          Math.floor(Math.random() * this.randomizedPresets.length)
        ]
      )
      this.updateBackground()
    },
  },
}
</script>

<style scoped>
.content {
  position: absolute;
  z-index: 1;
}
</style>
