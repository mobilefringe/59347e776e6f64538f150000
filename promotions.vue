<template>
  <div class="container"> <!-- for some reason if you do not put an outer container div this component template will not render -->
    <div class="columns large-3 medium 6" v-for="promo in promotions">
      <div class="card">
        <div class="card-divider">
          {{ promo.name }}
        </div>
        <div class="card-section center">
          <a :href="promo.image_url" target="_blank"><img :src="promo.image_url"></a>
        </div>
        <div class="card-section">
          <div class="center">
            <p>{{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}</p>
            <router-link :to="{ name: 'promotionDetails', params: { id: promo.slug }}">Read More</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .center{
    text-align: center
  }
  .store-section a{
    color: #708090;
  }
</style>

<script>
  define(["Vue", "moment", "moment-timezone", "vue-moment", "vue-meta"], function(Vue, moment, tz, VueMoment, Meta) {
    Vue.use(Meta);
    return Vue.component("promos-component", {
      template: template, // the variable template will be injected
      computed: {
        promotions() {
          return this.$store.getters.processedPromos;
        },
        timezone () {
          return this.$store.getters.getTimezone;
        }
      }
    });
  });
</script>
