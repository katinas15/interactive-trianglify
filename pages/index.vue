<template>
  <InteractiveTrianglify :presets="presets" />
</template>

<script>
import InteractiveTrianglify from '../components/InteractiveTrianglify'

const COLORS_WHITE_GREY = ['#FFFFFF', '#0D0D0D']
const COLORS_DEUS_EX = [
  '#000000',
  '#0D0D0D',
  '#351409',
  '#a15501',
  '#d0902f',
  '#fff69f',
  '#fdd870',
  '#d0902f',
  '#a15501',
  '#351409',
  '#0D0D0D',
  '#000000',
]
const COLORS_VINTAGE = ['#FBF8F1', '#F7ECDE', '#E9DAC1', '#54BAB9']
const COLORS_NATURE = ['#D3ECA7', '#A1B57D', '#B33030', '#19282F']
const PRESETS = [
  {
    name: 'White and Grey',
    xColors: COLORS_WHITE_GREY,
    circleSize: [2, 5],
  },
  {
    name: 'Deus Ex',
    xColors: COLORS_DEUS_EX,
    circleSize: [2, 5],
  },
  {
    name: 'Vintage',
    xColors: COLORS_VINTAGE,
    circleSize: [0, 0],
  },
  {
    name: 'Nature',
    xColors: COLORS_NATURE,
    circleSize: [0, 0],
  },
]
export default {
  components: {
    InteractiveTrianglify,
  },
  data() {
    return {
      presets: PRESETS,
    }
  },
}
</script>
