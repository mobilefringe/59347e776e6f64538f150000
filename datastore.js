define(['Vue', 'vuex', 'datastore_getters', 'datastore_actions', 'datastore_mutations'], function (Vue, Vuex, getters, actions, mutations) {
  Vue.use(Vuex);

  const state = {
    apiVersion: null,
    apiProperty: null,
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