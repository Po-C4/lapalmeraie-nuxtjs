<template>
  <b-button-group class="w-100">
    <b-button
      variant="danger"
      class="button"
      @mousedown="longPressOn(decrement)"
      @touchstart="longPressOn(decrement)"
      @click="
        decrement();
        delayedBlur($event);
      "
    >
      -
    </b-button>
    <b-input
      ref="input"
      class="text-center"
      type="text"
      :value="stringValue"
      :formatter="formatter"
      @input="inputValue"
      @focus="removeSymbol"
      @blur="decimalFormatter(true)"
    />
    <b-button
      variant="success"
      class="button"
      @mousedown="longPressOn(increment)"
      @touchstart="longPressOn(increment)"
      @click="
        increment();
        delayedBlur($event);
      "
    >
      +
    </b-button>
  </b-button-group>
</template>

<script>
export default {
  name: 'InputSpinner',
  props: {
    value: {
      type: Number,
      default: 0,
    },
    defaultValue: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: -100,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    longPressDelay: {
      type: Number,
      default: 600,
    },
    longPressInterval: {
      type: Number,
      default: 100,
    },
    longPressFastDelay: {
      type: Number,
      default: 20,
    },
    integerOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      numericValue: this.defaultValue,
      stringValue: null,
      longPressDelayTimer: null,
      longPressTimer: null,
      longPressIterations: 0,
    };
  },
  watch: {
    numericValue(val, oldVal) {
      this.numericValue = this.parse(this.decimalFormatter(false));
      this.$emit('input', this.numericValue, oldVal);
    },
  },
  mounted() {
    this.decimalFormatter();
    window.addEventListener('mouseup', this.longPressOff);
    window.addEventListener('touchend', this.longPressOff);
  },
  destroyed() {
    window.removeEventListener('mouseup', this.longPressOff);
    window.removeEventListener('touchend', this.longPressOff);
  },
  methods: {
    delayedBlur(e) {
      setTimeout(() => e.target.blur(), 200);
    },
    clamp(value) {
      return value < this.min ? this.min : value > this.max ? this.max : value;
    },
    parse(value) {
      value = this.integerOnly ? parseInt(value) : parseFloat(value);
      return isNaN(value) ? 0 : value;
    },
    formatter(value) {
      value = value
        .replace(
          /^.*?(?:0?(-))?-*(?:0*([0-9]+)(?:([.,])[.,]*)?([0-9]{0,2}))?.*$/,
          this.integerOnly ? '$1$2' : '$1$2$3$4'
        )
        .replace(',', '.');

      if (value === '') return;

      const parsedValue = this.parse(value);
      const clampedValue = this.clamp(parsedValue);
      return parsedValue === clampedValue ? value : clampedValue;
    },
    decimalFormatter(apply = true) {
      if (this.stringValue === '') {
        this.numericValue = this.defaultValue;
      }
      const value = this.integerOnly
        ? this.numericValue
        : this.numericValue.toFixed(2);
      if (apply) this.stringValue = `${value} €`;
      return value;
    },
    inputValue() {
      if (this.$refs.input.$el.value === '') return;
      this.numericValue = this.clamp(this.parse(this.$refs.input.$el.value));
    },
    increment(isFast = false) {
      this.numericValue = this.clamp(
        this.numericValue + (isFast ? this.step * 5 : this.step)
      );
      this.decimalFormatter();
    },
    decrement(isFast = false) {
      this.numericValue = this.clamp(
        this.numericValue - (isFast ? this.step * 5 : this.step)
      );
      this.decimalFormatter();
    },
    longPressOn(callback) {
      if (this.longPressDelayTimer !== null || this.longPressTimer !== null) {
        return;
      }
      this.longPressDelayTimer = setTimeout(() => {
        callback();
        this.longPressTimer = setInterval(() => {
          this.longPressIterations++;
          const isFast = this.longPressIterations >= this.longPressFastDelay;
          callback(isFast);
        }, this.longPressInterval);
      }, this.longPressDelay);
    },
    longPressOff() {
      clearTimeout(this.longPressDelayTimer);
      clearInterval(this.longPressTimer);
      this.longPressDelayTimer = null;
      this.longPressTimer = null;
      this.longPressIterations = 0;
    },
    removeSymbol() {
      this.stringValue = this.stringValue.replace(/^(.*) €$/, '$1');
    },
  },
};
</script>

<style scoped>
.form-control {
  background-color: #272b30 !important;
  color: var(--primary) !important;
  border: 0;
  border-radius: 0;
}

.button {
  width: 38px;
}

.is-valid {
  border: 0px solid var(--success);
  color: var(--success) !important;
}

.is-invalid {
  border: 1px solid var(--danger);
  color: var(--danger) !important;
}
</style>
