<template>
  <div id="app">
    <transition name="fade">
      <div
        v-if="loading"
        style="width: 400px;"
        class="m-auto"
      >
        Loading coronavirus data...
        <progress-bar
          :value="progress"
          :max="100"
        />
      </div>
    </transition>

    <div
      id="nav"
      v-if="!loading"
    >
      Select a country
      <select
        name="countries"
        id="countries"
        v-model="country"
      >
        <option
          v-for="country of countries"
          :key="country"
          :value="country"
        >
          {{ country }}
        </option>
      </select>
      Or <router-link to="/Compare">Compare countries</router-link>
    </div>
    <router-view style="max-width: 600px; margin: auto;" />
  </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar.vue"

export default {
  data() {
    return {
      country: null,
      loading: true,
      progress: 0,
    }
  },

  async mounted() {
    await this.$store.dispatch("getCases", this.config)
    this.progress = 98
    window.setTimeout(() => {
      this.loading = false
      this.progress = 100
    }, 500)
  },

  watch: {
    country(country) {
      if (country) {
        this.$router.push(`/country/${country}`)
      }
    },
  },

  computed: {
    countries() {
      return this.$store.getters.getCountriesList
    },

    config() {
      return {
        onDownloadProgress: (event) => {
          const progress = event.loaded / 1209701
          this.progress = progress * 100
        },
      }
    },
  },

  components: {
    ProgressBar,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.m-auto {
  margin: auto;
}

.loading-bar {
  width: 100%;
  border: 1px solid black;
  height: 20px;
  text-align: left;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
