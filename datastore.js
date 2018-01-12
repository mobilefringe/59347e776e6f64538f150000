define(['Vue', 'vuex', 'datastore_getters', 'datastore_actions', 'datastore_mutations'], function (Vue, Vuex, getters, actions, mutations) {
  Vue.use(Vuex);

  const state = {
    api: {
      site: null,
      version: null
    }
    results: [],
    meta_data: [],
    locale: null,
    url: null
  }

  const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
  })

  return store;
    
});