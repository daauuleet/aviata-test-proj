<template>
  <div>
    <div class="ticket ticket-wrapper" v-for="(option, index) in options" :key="index">
      <div class="ticket__main">
        <div class="ticket__main__top-row">
          <div class="ticket__carrier">
            <img :src="getImage(option.carrier)" :alt="option.carrier" class="ticket__carrier__image">
            <h2 class="ticket__carrier__name">{{ option.carrier_name }}</h2>
          </div>
          <div class="ticket__info">
            <div class="ticket__date">
              <p class="ticket__date__day">
                {{ transformDate(option.segments[0].dep_time) }}
              </p>
              <p class="ticket__date__time">
                {{ transformTime(option.segments[0].dep_time) }}
              </p>
            </div>
            <div class="ticket__flight">
              <div class="ticket__flight__distance">
                <div class="ticket__flight__distance__text">
                  <span class="ticket__flight__point">{{ option.segments[0].origin_code }}</span>
                  <p class="ticket__flight__time">
                    {{ hoursDifference(option.segments[0].dep_time_iso, option.segments[option.segments.length - 1].arr_time_iso) }}
                  </p>
                  <span class="ticket__flight__point">{{ option.segments[option.segments.length - 1].dest_code }}</span>
                </div>
              </div>
              <div class="ticket__flight__range">
                <span class="ticket__flight__dot"></span>
                <span class="ticket__flight__dot"></span>
                <span class="ticket__flight__dot"></span>
              </div>
              <p class="ticket__flight__transfer" v-for="(stop, stop_index) in option.stops" :key="stop_index">
                через {{ option.segments[stop_index].dest }},
                {{ hoursDifference(option.segments[stop_index].arr_time_iso, option.segments[stop_index + 1].dep_time_iso) }}
              </p>
            </div>
            <div class="ticket__date">
              <p class="ticket__date__day">
                {{ transformDate(option.segments[option.segments.length - 1].arr_time) }}
                <span
                    class="ticket__date__difference">{{ daysDifference(option.segments[0].dep_time, option.segments[option.segments.length - 1].arr_time) }}</span>
              </p>
              <p class="ticket__date__time">
                {{ transformTime(option.segments[option.segments.length - 1].arr_time) }}
              </p>
            </div>
          </div>
        </div>
        <div class="ticket__main__bottom-row">
          <div class="ticket__dashed-buttons">
            <div class="ticket__dashed-buttons__item">
              <button class="btn--bottom-dashed">Детали перелета</button>
            </div>
            <div class="ticket__dashed-buttons__item">
              <button class="btn--bottom-dashed">Условия тарифа</button>
            </div>
          </div>
          <div class="ticket__irrevocable" v-if="option.refundable">
            <svg class="ticket__irrevocable__icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M4.62478 4.63246L2.18383 5.00013L2 3.77966L5.66142 3.22816L6.21291 6.88958L4.99244 7.07341L4.62478 4.63246Z"
                    fill="#707276"/>
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M5.50024 3.53115C3.45478 4.96006 2.1168 7.33197 2.1168 10.0164C2.1168 14.3824 5.65618 17.9218 10.0222 17.9218C14.3883 17.9218 17.9277 14.3824 17.9277 10.0164C17.9277 5.66297 14.4087 2.13144 10.0601 2.11105L10.035 3.11097C13.8429 3.11788 16.9277 6.20689 16.9277 10.0164C16.9277 13.8302 13.836 16.9218 10.0222 16.9218C6.20847 16.9218 3.1168 13.8302 3.1168 10.0164C3.1168 7.8267 4.13598 5.87506 5.72584 4.60994L5.50024 4.61575V3.99863V3.53115Z"
                    fill="#707276"/>
              <path
                  d="M1.64918 16.7664L1.2933 17.1176L1.64451 17.4735L2.51148 18.352L2.86269 18.7078L3.21857 18.3566L18.2986 3.47419L18.6545 3.12297L18.3032 2.76709L17.4363 1.88862L17.0851 1.53274L16.7292 1.88396L1.64918 16.7664Z"
                  fill="#707276" stroke="white"/>
            </svg>
            <p class="ticket__irrevocable__text">невозвратный</p>
          </div>
        </div>
      </div>
      <div class="ticket__end">
        <div class="ticket__end__row ticket__end__row--mobile-hidden">
          <p class="ticket__price">{{ option.price.amount }} ₸</p>
        </div>
        <div class="ticket__end__row">
          <button class="btn--primary ticket__main-btn">
            <span class="desktop-value">Выбрать</span>
            <span class="mobile-value">{{ option.price.amount }} ₸</span>
          </button>
        </div>
        <div class="ticket__end__row">
          <p class="ticket__desc">Цена за всех пассажиров</p>
        </div>
        <div class="ticket__end__row">
          <div class="ticket__baggage-info" v-if="option.segments[0].baggage_options[0].value === 0">
            <p class="ticket__baggage-info__text">Нет багажа</p>
            <button class="btn--plus">+ Добавить багаж</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheTicket",
  props: {
    options: {
      type: Array
    }
  },
  methods: {
    getImage(img) {
      return `https://aviata.kz/static/airline-logos/80x80/${img}.png`
    },
    getSegment(index) {
      return this.options[index].segments;
    },
    hoursDifference(arr_time, dep_time) {
      let minutes = ((new Date(dep_time) - new Date(arr_time)) / 1000) / 60
      return this.timeConvert(minutes)
    },
    daysDifference(dep_time, arr_time) {
      let day1 = parseInt(dep_time.substring(0, 2));
      let day2 = parseInt(arr_time.substring(0, 2));
      let res = day2 - day1
      if (res > 0) return '+' + res;
    },
    transformDate(date) {
      return date.substring(0, date.length - 5);
    },
    transformTime(time) {
      return time.substr(time.length - 5);
    },
    timeConvert(n) {
      let hours = (n / 60);
      let rhours = Math.floor(hours);
      let minutes = (hours - rhours) * 60;
      let rminutes = Math.round(minutes);
      if (rhours > 0 && rminutes > 0) {
        return rhours + " ч " + rminutes + " м"
      } else {
        return rhours + " ч "
      }
    }
  },
}
</script>

<style scoped>

</style>
