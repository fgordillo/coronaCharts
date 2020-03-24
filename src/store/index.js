import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },

  getters: {
    getCountriesList(state) {
      return Object.keys(state).sort()
    },
  },

  mutations: {
    init(state) {
      Vue.set(state, {})
    },

    setCountryTimeline(state, { timeline, country }) {
      if (!state[country]) {
        Vue.set(state, country, {})
      }
      if (!state[country].timeline) {
        Vue.set(state[country], "timeline", timeline)
      } else {
        const { cases, recovered, deaths } = state[country].timeline
        Object.keys(cases).forEach((day) => {
          cases[day] += timeline.cases[day]
          recovered[day] += timeline.recovered[day]
          deaths[day] += timeline.deaths[day]
        })
      }
    },
  },

  actions: {
    async getCases({ commit }, config) {
      commit("init")
      const countriesData = (await axios.get("https://corona.lmao.ninja/historical/", config)).data
      countriesData.shift()
      countriesData.forEach((countryData) => {
        const { country, timeline } = countryData
        if (timeline) {
          Object.keys(timeline.cases).forEach((day) => {
            timeline.cases[day] = Number(timeline.cases[day])
            timeline.recovered[day] = Number(timeline.recovered[day])
            timeline.deaths[day] = Number(timeline.deaths[day])
          })
          commit("setCountryTimeline", {
            timeline,
            country,
          })
        }
      })
    },
  },

  modules: {
  },
})
