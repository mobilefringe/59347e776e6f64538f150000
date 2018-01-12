define(['datastore_mutation_types', 'js-cookie'], function (types, Cookies) {
  const mutations = {
    [types.SET_MALL_DATA] (state, {list}) {
      state.results = list;
    },
    [types.SET_LOCALE] (state, {lang}) {
      state.locale = lang
      Cookies.set('locale', lang);
    },
    [types.SET_META_DATA] (state, {list}) {
      state.meta_data = list;
    }
  }
  return mutations;
});