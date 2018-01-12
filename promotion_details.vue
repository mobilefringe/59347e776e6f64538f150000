<template>
  <div class="row" v-if="currentPromo">
    <div class="large-6 columns">
      <div>
        <h1>{{currentPromo.name}}</h1>
        <p><router-link :to="{ name: 'storeDetails', params: { id: currentPromo.store.slug }}">{{currentPromo.store.name}}</router-link> | {{currentPromo.start_date | moment("MMM D", timezone)}} - {{currentPromo.end_date | moment("MMM D", timezone)}}</p>
        <p>{{currentPromo.description}}</p>
        <img :src="currentPromo.image_url">
      </div>
    </div>
  </div>
</template>

<script>
  define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
    return Vue.component("promo-details-component", {
      template: template, // the variable template will be injected,
      data: function() {
        return {
          currentPromo: null
        }
      },
      beforeRouteEnter (to, from, next) {
        next(vm => {
          // access to component instance via `vm`
          vm.currentPromo = vm.findPromoBySlug(to.params.id);
          if (vm.currentPromo === null || vm.currentPromo === undefined){
            vm.$router.replace({ name: '404'});
          }
        })
      },
      beforeRouteUpdate (to, from, next) {
        this.currentPromo = this.findPromoBySlug(to.params.id);
        if (this.currentPromo === null || this.currentPromo === undefined){
          this.$router.replace({ name: '404'});
        }
      },
      created(){
        this.$store.dispatch("getData", "promotions");
      },
      computed: {
        ...Vuex.mapGetters([
          'findPromoBySlug',
          'timezone'
        ])
      }
    });
  });
</script>
