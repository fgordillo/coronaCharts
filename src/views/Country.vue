<template>
  <div>
    <h2>Country: {{ countryName }}</h2>
    <button
      @click="show = 'table'"
      v-if="show != 'table'"
    >
      Show table
    </button>

    <button
      @click="show = 'chart'"
      v-if="show != 'chart'"
    >
      Show chart
    </button>

    <table
      v-if="show == 'table' && loaded"
      style="width: 100%;"
    >
      <thead>
        <tr>
          <th>Day</th>
          <th>Cases</th>
          <th>Recovered</th>
          <th>Deaths</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(_, i) of days"
          :key="i"
        >
          <td>{{ days[i] }}</td>
          <td>{{ cases[i] }}</td>
          <td>{{ recovered[i] }}</td>
          <td>{{ deaths[i] }}</td>
        </tr>
      </tbody>
    </table>

    <high-charts
      v-if="show == 'chart' && loaded"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { Chart } from "highcharts-vue"

export default {
  props: {
    countryName: String,
  },

  data() {
    return {
      show: "chart",
      daysNumber: 7,
    }
  },

  computed: {
    loaded() {
      return !!this.$store.state[this.countryName]
    },

    chartOptions() {
      return {
        chart: {
          zoomType: "x",
        },
        title: {
          text: `${this.countryName} growth: ${this.formattedGrowth}`,
        },
        tooltip: {
          shared: true,
        },
        xAxis: {
          type: "datetime",
        },
        series: [
          {
            name: "Cases",
            data: this.cases,
            pointStart: Date.UTC(2020, 0, 22),
            pointInterval: 3600 * 1000 * 24, // 24h
          },
          {
            name: "Estimation",
            data: this.nextWeek,
            pointStart: Date.UTC(2020, 0, 22),
            pointInterval: 3600 * 1000 * 24, // 24h
          },
          /*
          {
            name: "Recovered",
            data: this.recovered,
            pointStart: Date.UTC(2020, 0, 22),
            pointInterval: 3600 * 1000 * 24, // 24h
          },
          {
            name: "Deaths",
            data: this.deaths,
            pointStart: Date.UTC(2020, 0, 22),
            pointInterval: 3600 * 1000 * 24, // 24h
          },
          */
        ],
      }
    },

    cases() {
      return Object.values(this.$store.state[this.countryName].timeline.cases)
    },

    casesDiff() {
      return this.cases.map((c, i) => {
        const prev = this.cases[i - 1] || 1
        return (c / prev) - 1
      })
    },

    growth() {
      const N = this.daysNumber
      const lastNelements = this.casesDiff.slice(Math.max(this.casesDiff.length - N, 0))
      return lastNelements.reduce((a, b) => a + b, 0) / N
    },

    formattedGrowth() {
      return `${(Math.round(this.growth * 10000) / 100).toFixed(2)}%`
    },

    nextWeek() {
      const casesClone = this.cases.slice()
      const { length } = this.cases
      const week = [0, 1, 2, 3, 4, 5, 6]
      week.forEach((i) => {
        casesClone[length + i] = Math.floor(casesClone[length + i - 1] * (this.growth + 1))
      })
      return casesClone
    },

    deaths() {
      return Object.values(this.$store.state[this.countryName].timeline.deaths)
    },

    recovered() {
      return Object.values(this.$store.state[this.countryName].timeline.recovered)
    },

    days() {
      return Object.keys(this.$store.state[this.countryName].timeline.recovered)
    },
  },

  components: {
    HighCharts: Chart,
  },
}
</script>
