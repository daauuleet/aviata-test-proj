<template>
  <div class="results container">
    <div class="filter-wrapper" :class="{'active': mobileFilterShown}">
      <div class="sticky-block">
        <div class="filter">
          <h2 class="filter__title">Опции тарифа</h2>
          <div class="filter__body">
            <label class="filter__input-row" for="сb-direct">
              <input type="checkbox" class="filter__checkbox" id="сb-direct" v-model="isCheckedDirect">
              <span class="filter__label">Только прямые</span>
            </label>
            <label class="filter__input-row" for="cb-baggage">
              <input type="checkbox" class="filter__checkbox" id="cb-baggage" v-model="isCheckedBaggage">
              <span class="filter__label">Только с багажом</span>
            </label>
            <label class="filter__input-row" for="cb-refundable">
              <input type="checkbox" class="filter__checkbox" id="cb-refundable" v-model="isCheckedRefundable">
              <span class="filter__label">Только возвратные</span>
            </label>
          </div>
        </div>
        <div class="filter">
          <h2 class="filter__title">Авиакомпании</h2>
          <div class="filter__body filter__body--scroll">
            <label class="filter__input-row" for="cb-all">
              <input type="checkbox" class="filter__checkbox" id="cb-all" v-model="isCheckedAll" @click.stop="checkAll">
              <span class="filter__label">Все</span>
            </label>
            <label
                v-for="(airline, name, index) in airlines"
                :for="airline"
                :key="index"
                class="filter__input-row">
              <input type="checkbox" class="filter__checkbox" @change="updateCheckedAll" :id="airline" :value="name"
                     v-model="isCheckedAirlines">
              <span class="filter__label">{{ airline }}</span>
            </label>
          </div>
        </div>
        <button class="btn--bottom-dashed" @click="resetAllFilters">Сбросить все фильтры</button>
      </div>
      <button class="btn--mobile-filter-close" @click="mobileFilterShown=false">Применить</button>
    </div>
    <div class="results__content">
      <div class="tickets">
        <the-ticket :options="filteredTickets"/>
        <div v-if="filteredTickets.length === 0">
          <h3>Мы нашли {{ tickets.length }} вариантов перелета, но ни один из вариантов не соответствует заданным
            фильтрам</h3>
        </div>
      </div>
    </div>
    <button class="btn--mobile-filter" @click="mobileFilterShown=true">Фильтры</button>
  </div>
</template>

<script>
import results from '/src/results.json'
import TheTicket from "../components/TheTicket";

export default {
  name: 'Results',
  components: {
    TheTicket
  },
  data() {
    return {
      airlines: results.airlines,
      flights: results.flights,
      tickets: [],
      isCheckedAll: true,
      isCheckedAirlines: [],
      isCheckedDirect: false,
      isCheckedBaggage: false,
      isCheckedRefundable: false,
      mobileFilterShown: false,
    }
  },

  mounted() {
    this.flights.forEach((flight) => {
      flight.itineraries.forEach((itinerary) => {
        itinerary.forEach((item) => {
          this.tickets.push(item);
        })
      })
    });
    if (this.isCheckedAll) {
      for (let airline in this.airlines) {
        this.isCheckedAirlines.push(airline);
      }
    }
  },
  computed: {
    filteredTickets() {
      let filters = {
        checkDirect: item => item.stops === 0,
        checkCarrier: item => this.isCheckedAirlines.includes(item.carrier),
        checkBaggage: item => item.segments[0].baggage_options[0].value > 0,
        checkRefundable: item => item.refundable === false,
      }
      let selected = [filters.checkCarrier]

      if (this.isCheckedDirect) selected.push(filters.checkDirect)
      if (this.isCheckedBaggage) selected.push(filters.checkBaggage)
      if (this.isCheckedRefundable) selected.push(filters.checkRefundable)

      return this.tickets.filter(item => selected.every(f => f(item)));
    }
  },
  methods: {
    updateCheckedAll() {
      Object.values(this.airlines).length === this.isCheckedAirlines.length ? this.isCheckedAll = true : this.isCheckedAll = false
    },
    checkAll() {
      this.isCheckedAll = !this.isCheckedAll;
      this.isCheckedAirlines = [];
      if (this.isCheckedAll) {
        for (let airline in this.airlines) {
          this.isCheckedAirlines.push(airline);
        }
      }
    },
    resetAllFilters() {
      this.isCheckedDirect = false;
      this.isCheckedBaggage = false;
      this.isCheckedRefundable = false;
      this.isCheckedAll = true;
      if (this.isCheckedAll) {
        for (let airline in this.airlines) {
          this.isCheckedAirlines.push(airline);
        }
      }
    }
  },
  watch: {
    mobileFilterShown(value) {
      if (value) {
        document.body.classList.add('scroll-lock')
      } else {
        document.body.classList.remove('scroll-lock')
      }
    },
  }
}
</script>

<style lang="scss">

</style>
