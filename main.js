require.config({
  paths: {
    'Vue': 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min',
    'vue_router': 'https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.5.2/vue-router.min',
    'axios': 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.1/axios.min',
    'jquery': 'https://code.jquery.com/jquery-3.2.1.min',
    'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min',
    'moment': 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min',
    'moment-timezone': 'https://momentjs.com/downloads/moment-timezone-with-data-2012-2022.min',
    'vue2-filters': 'https://cdn.jsdelivr.net/vue2-filters/0.1.8/vue2-filters.min',
    'vue': 'https://cdn.rawgit.com/edgardleal/require-vuejs/aeaff6db/dist/require-vuejs.min',
    'vuex': 'https://cdnjs.cloudflare.com/ajax/libs/vuex/2.3.1/vuex.min',
    'vue-i18n': 'https://cdnjs.cloudflare.com/ajax/libs/vue-i18n/6.1.1/vue-i18n.min',
    'text': 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
    'json': 'https://unpkg.com/requirejs-plugins-current@1.0.3/src/json',
    'js-cookie': 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min',
    'vue-meta': 'https://unpkg.com/vue-meta@1.0.4/lib/vue-meta.min'
  }
});

require(['Vue', 'vue2-filters', 'vue_router', 'routes', 'store', 'vue-i18n', 'locales', 'moment', "vue-meta"], function (Vue, Vue2Filters, VueRouter, appRoutes, store, VueI18n, messages, moment, Meta) {
  Vue.config.devtools = true;
  Vue.use(Meta);
  Vue.use(VueRouter);
  Vue.use(Vue2Filters);
  Vue.use(VueI18n);

  /* initialize router */
  const router = new VueRouter({
    mode: 'history',
    routes: appRoutes
  });

  /* initialize i18n */
  const i18n = new VueI18n({
    locale: 'en-ca',
    fallbackLocale: 'en-ca',
    messages,
  });

  /* bootstrap app */
  const vm = new Vue({
    el: '#app',
    data: function () {
      return {
        dataLoaded: false,
        message: 'Hello Vue!'
      }
    }
  });
});
