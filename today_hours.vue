<template>
  <div class="container">
    <h3>Shopping Hours</h3>
    <p v-if="!getTodayHours.is_closed">{{todayDate | moment("ddd", timezone)}} {{getTodayHours.open_time | moment("LT", timezone)}} - {{getTodayHours.close_time | moment("LT", timezone)}}</p>
    <p v-if="getTodayHours.is_closed">Closed</p>
  </div>
</template>

<script>
  define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
    return Vue.component("today-hours", {
      template: template, // the variable template will be injected,
      data: function() {
        return {
          todayDate: new Date(),
          description: "An example of integration of Mall Maverick with Vue.js"
        }
      },
      computed: {
        ...Vuex.mapGetters([
          'getTodayHours',
          'timezone'
        ])
      }
    });
  });
</script>
