<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
  steps?: any
  step?: number
}>(), {
  modelValue: () => 0,
  min: () => 0,
  max: () => 100,
  steps: () => [],
  step: () => 1
})

const emits = defineEmits(['update:modelValue'])

const computedSteps = computed(() => {
  if (Array.isArray(props.steps)) {
    return props.steps
  }
  if (typeof props.steps === 'string') {
    return props.steps.split(',')
  }
  console.error('Props steps must be Array or String. Exp: [1,2,3] or 1,2,3')
  return []
})
const computedProps = computed(() => {
  if (computedSteps.value.length) {
    return {
      min: 0,
      max: computedSteps.value.length - 1,
      step: 1
    }
  }
  return {
    min: props.min,
    max: props.max,
    step: props.step
  }
})

const inputValue = ref(0)

function handleChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emitsValue(value)
}

function emitsValue(value: any) {
  if (computedSteps.value.length) {
    return emits('update:modelValue', computedSteps.value[+value])
  }
  emits('update:modelValue', value)
}

function onModelChange(value: number) {
  if (computedSteps.value?.length) {
    let index = typeof value === 'object'
      ? computedSteps.value.findIndex(v => JSON.stringify(v) === JSON.stringify(value))
      : computedSteps.value.indexOf(value)

    inputValue.value = index < 0 ? 0 : index
    return
  }
  inputValue.value = value
}

onMounted(() => {
  const unwatchHandlers = [
    watch(() => props.modelValue, onModelChange, { immediate: true })
  ]
  onBeforeUnmount(() => {
    unwatchHandlers.forEach((unwatch) => unwatch())
  })
})
</script>

<template>
  <pre>{{ props.modelValue }}</pre>
  <div class="vue-custom-range-input">
    <input
      :value="inputValue"
      :min="computedProps.min"
      :max="computedProps.max"
      :step="computedProps.step"
      class="vue-custom-range-input"
      type="range"
      @input="handleChange"
    />
    <div class="vue-custom-range-input__labels">
      <ul>
        <li v-for="(value, index) of computedSteps" :key="index" @click="emitsValue(index)">
          <span>
            <template v-if="!$slots.label">
              {{ value }}
            </template>
            <slot name="label" :value="value" />
          </span>
        </li>
      </ul>
    </div>
  </div>

  <pre>{{ computedProps }}</pre>
  <pre>{{ computedSteps }}</pre>
</template>

<style lang="scss" scoped>
.vue-custom-range-input {
  display: flex;
  flex-direction: column;
  background: greenyellow;
  width: 100%;
  input {
    margin: 0;
    padding: 0;
  }
  &__labels {
    ul {
      list-style: none;
      display: flex;
      margin: 0;
      padding: 0;
      justify-content: space-between;
      li {
        width: 10px;
        height: 2rem;
        background: red;
        position: relative;
        span {
          position: absolute;
          white-space: nowrap;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
        }
        &:first-child {
          span {
            left: 0;
            transform: none;
          }
        }
        &:last-child {
          span {
            right: 0;
            left: initial;
            transform: none;
          }
        }
      }
    }
  }
}
</style>
