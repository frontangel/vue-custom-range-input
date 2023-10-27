<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: any
  min?: number
  max?: number
  steps?: any
  step?: number
  showRule?: boolean
}>(), {
  modelValue: () => 0,
  min: () => 0,
  max: () => 100,
  steps: () => [],
  step: () => 1
})

const emits = defineEmits(['update:modelValue'])

const inputValue = ref(0)
const inputRef = ref()
const rangeWidth = ref(0)

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

const computedRuleMarkers = computed(() => {
  if (!rangeWidth.value) return 1
  const dif = props.max - props.min
  const q = [1, 5, 10, 25, 50]
  return findCount(q,rangeWidth.value / dif, 0, 75)
})

const computedRuleSubMarkers = computed(() => {
  if (!rangeWidth.value) return 1
  const dif = props.max - props.min
  const q = [1, 2, 3, 5]
  return findCount(q, rangeWidth.value / dif, 0, 10)
})

function findCount(q: number[], width: number, index: number, minWidth: number) {
  if (width * q[index] < minWidth) {
    return findCount(q, width, index + 1, minWidth)
  }
  return q[index] || 100
}

function handleChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emitsValue(value)
}

function emitsValue(value: any) {
  if (computedSteps.value.length) {
    return emits('update:modelValue', computedSteps.value[+value])
  }
  emits('update:modelValue', +value)
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
  const updateWidth = () => {
    if (inputRef.value) {
      rangeWidth.value = inputRef.value.offsetWidth
    }
  }
  window.addEventListener('resize', updateWidth)
  const unwatchHandlers = [
    watch(() => props.modelValue, onModelChange, { immediate: true })
  ]
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWidth)
    unwatchHandlers.forEach((unwatch) => unwatch())
  })
  updateWidth()
})
</script>

<template>
  <div ref="inputRef" class="vue-custom-range-input">
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
      <ul :class="[{ 'show-rule': showRule }]">
        <template v-if="computedSteps?.length">
          <li
            v-for="(value, index) of computedSteps"
            :key="index"
            :class="['marker', { active: value === modelValue }]"
            @click="emitsValue(index)"
          >
          <span class="vue-custom-range-input__label">
            <template v-if="!$slots.label">
              {{ value }}
            </template>
            <slot name="label" :value="value" />
          </span>
          </li>
        </template>
        <template v-else>
          <li
            v-for="(n, index) of (max - min + 1)"
            :key="n"
            :class="{ marker : !(index%computedRuleMarkers), 'sub-marker': !(index%computedRuleSubMarkers), active: min + index === modelValue }"
            @click="!(index%computedRuleMarkers) ? emitsValue(min + index) : null"
          >
            <span v-if="!(index%computedRuleMarkers) || (max === min + index)">{{ min + index }}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vue-custom-range-input {
  display: flex;
  flex-direction: column;
  width: 100%;
  input {
    margin: 0;
    padding: 0;
  }
  &__labels {
    color: black;
    ul {
      list-style: none;
      display: flex;
      margin: 0;
      padding: 0;
      justify-content: space-between;
      &.show-rule {
        li {
          &.marker {
            cursor: pointer;
          }
          &:before {
            content: '';
            height: 1rem;
            width: 2px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            background-color: gray;
          }
          &:not(.marker):not(.sub-marker):not(:last-child) {
            display: none;
          }
          &.sub-marker:not(.marker):not(:last-child):before {
            height: 0.5rem;
          }
        }
      }
      li {
        width: 6px;
        position: relative;
        display: flex;
        span {
          display: flex;
          width: 0;
          padding-top: 1rem;
          align-items: center;
          justify-content: center;
          line-height: 1.5;
        }
        &:first-child {
          justify-content: left;
          span {
            justify-content: left;
          }
        }
        &:last-child {
          justify-content: right;
          span {
            justify-content: right;
          }
        }
      }
    }
  }
}
</style>
