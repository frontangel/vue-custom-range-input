<script setup lang="ts">
import VueCustomRangeInput from './components/VueCustomRangeInput.vue'
import { ref } from 'vue'

const value = ref(10)
</script>

<template>
  <pre>{{ value }}</pre>
  <vue-custom-range-input
    v-model="value"
    :steps="[{ foo: 'bar' }, { foo: 'rab' }, 'some']"
  >
    <template #label="{ value }">
      {{ value.foo || value }}
    </template>
  </vue-custom-range-input>
</template>

