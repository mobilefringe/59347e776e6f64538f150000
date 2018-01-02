<template>
  <div class="row">
    <div class="large-6 columns">
      <div>
        <h1>{{title}}</h1>
        <p>{{description}}</p>
        <hr/>
        <h5>Translated text example:</h5>
        <p>{{ $t("message.hello") }}</p>
        <p>{{property.name}}</p>
        <hr/>
        <today-hours></today-hours>
        <v-calendar
    is-double-paned>
  </v-calendar>
        <search-component v-model="search" :list="processedStores" :suggestion-attribute="suggestionAttribute" @select="onOptionSelect">
          <template slot="item" scope="option">
            <article class="media">
              <!--<figure class="media-left">
                <p class="image is-64x64">
                  <img :src="option.data.store_front_url_abs">
                </p>
              </figure>-->
              <p>
                <strong>{{ option.data.name }}</strong>
              </p>
            </article>
          </template>
        </search-component>
        
      </div>
    </div>
  </div>
</template>

<script>
  define(["Vue", "vue!today_hours.vue", "vue!search-component.vue", "v-calendar"], function(Vue, TodayHoursComponent, SearchComponent, VCalendar) {
    Vue.use(VCalendar);
    return Vue.component("home-component", {
      template: template, // the variable template will be injected
      data: function() {
        return {
          title: "MM with Vue.js!",
          description: "An example of integration of Mall Maverick with Vue.js",
          suggestionAttribute: 'name',
          search: ''
        }
      },
      computed: {
        property(){
          return this.$store.getters.getProperty;
        },
        processedStores() {
          return this.$store.getters.processedStores;
        }
      },
      methods: {
        onOptionSelect(option) {
          console.log('Selected option:', option)
        }
      }
    })
  })
</script>
