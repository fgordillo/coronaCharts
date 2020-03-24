<template>
    <div
        class="bg-white"
        :style="borderRadiusStyle"
    >
        <div
            :aria-valuenow="value"
            :style="[barStyle, borderRadiusStyle]"
            :aria-valuemax="max"
            :aria-valuemin="min"
            class="text-nowrap bg-primary"
            role="progressbar"
        />

        <slot />
    </div>
</template>

<script>
export default {
  props: {
    value: { type: Number, required: true },
    max: { type: Number, default: 100 },
    min: { type: Number, default: 0 },
    smooth: { type: Boolean, default: true },
    height: { type: Number, default: 4 },
  },

  computed: {
    percent() {
      const proportion = this.value / (this.max - this.min)
      return 100 * proportion
    },
    barStyle() {
      return {
        height: `${this.height}px`,
        width: `${this.percent}%`,
        transition: this.smooth ? "width 0.5s ease" : "",
      }
    },
    borderRadiusStyle() {
      return {
        borderRadius: `${this.height}px`,
      }
    },
  },
}
</script>

<style lang="css">
  .bg-primary {
    background-color: blue;
  }
  .bg-gray {
    background-color: gray;
  }
  .bg-white {
    background-color: white;
  }
  .text-nowrap {
    white-space: nowrap;
  }
</style>
