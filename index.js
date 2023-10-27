import VueCustomRangeInput from './src/components/VueCustomRangeInput.vue'

export default {
  install: (app) => {
    app.component('CustomRangeInput', VueCustomRangeInput)
  }
}

export { VueCustomRangeInput }
