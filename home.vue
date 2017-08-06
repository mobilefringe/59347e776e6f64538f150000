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
        <button v-on:click="greet">Greet</button>
        <search-component :list="processedStores" :suggestion-attribute="suggestionAttribute" @select="onOptionSelect" :search="swap ? test2 : test1">
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
        <search-component :list="processedStores" :suggestion-attribute="suggestionAttribute" @select="onOptionSelect" :search="swap ? test1: test2">
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
  define(["Vue", "vue!today_hours.vue", "vue!search-component.vue"], function(Vue, TodayHoursComponent, SearchComponent) {
    return Vue.component("home-component", {
      template: template, // the variable template will be injected
      data: function() {
        return {
          title: "MM with Vue.js!",
          description: "An example of integration of Mall Maverick with Vue.js",
          suggestionAttribute: 'name',
          swap: false,
          test1: '',
          test2: ''
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
        },
        greet: function (event) {
      // `this` inside methods points to the Vue instance
      alert('Hello ' + this.name + '!')
      // `event` is the native DOM event
      if (event) {
        alert(event.target.tagName)
      }
    }
      }
    })
  })
</script>
