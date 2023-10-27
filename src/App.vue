<script setup lang="ts">
import VueCustomRangeInput from './components/VueCustomRangeInput.vue'
import { ref } from 'vue'

const value = ref(10)
const value2 = ref('John')
</script>

<template>
  <vue-custom-range-input
    v-model="value"
    :min="-7"
    :max="80"
    show-rule
  />

  <vue-custom-range-input
    v-model="value2"
    :steps="['John', 'Sam', 'Marta']"
    show-rule
  />
</template>

<style lang="scss" scoped>

</style>

