<template>
  <v-app dark>
    <Nuxt />

    <v-footer app>
      <span>
        <a href="https://github.com/katinas15/interactive-trianglify"
          >Source Code</a
        >
        |

        <a href="https://trianglify.io">Original Idea</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>

<style>
html {
  overflow: hidden; /* Hide scrollbars */
}
</style>
