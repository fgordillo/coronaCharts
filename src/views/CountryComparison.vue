<template>
  <div>
    Select countries to compare their coronovirus infections
    <div class="mb-1">
      <select
        name="countries"
        id="countries"
        class="mr-1"
        v-for="i in countriesCount"
        :key="i"
        v-model="selectedCountries[i-1]"
      >
        <option
          v-for="country of countries"
          :key="country"
          :value="country"
          :disabled="selectedCountries.includes(country)"
        >
          {{ country }}
        </option>
      </select>
    </div>
    <button @click="countriesCount++">+ Add one more country</button>
    <button @click="restart">Restart</button>

    <high-charts
      v-if="selectedCountries.length > 0"
      :options="chartOptions"
    />

    <select
      name="field"
      id="field"
      v-model="field"
    >
      <option value="cases">Cases</option>
      <option value="recovered">Recovered</option>
      <option value="deaths">Deaths</option>
    </select>
  </div>
</template>

<script>
import { Chart } from "highcharts-vue"

export default {
  data() {
    return {
      selectedCountries: [],
      countriesCount: 1,
      field: "cases",
    }
  },

  computed: {
    countries() {
      return this.$store.getters.getCountriesList
    },

    chartOptions() {
      return {
        chart: {
          zoomType: "x",
        },
        title: {
          text: this.field,
        },
        xAxis: {
          type: "datetime",
        },
        tooltip: {
          shared: true,
          valueSuffix: ` ${this.field}`,
        },
        series: this.selectedCountries.map((c) => {
          const data = this.$store.state[c].timeline[this.field]
          return {
            name: c,
            data: Object.values(data),
            pointStart: Date.UTC(2020, 0, 22),
            pointInterval: 3600 * 1000 * 24, // 24h
          }
        }),
      }
    },
  },

  methods: {
    restart() {
      this.selectedCountries = []
      this.countriesCount = 1
    },
  },

  components: {
    HighCharts: Chart,
  },
}
</script>

<style lang="css">
  .mr-1 {
    margin-right: 1rem;
  }
  .mb-1 {
    margin-bottom: 1rem;
  }
</style>
