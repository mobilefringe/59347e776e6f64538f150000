define(['datastore_mutation_types', 'js-cookie'], function (types, Cookies) {
  const mutations = {
    [types.SET_API_DETAILS] (state, {api}) {
      state.api = api;
    },
    [types.SET_BANNERS] (state, {banners}) {
      state.banners = banners;
    },
    [types.SET_CATEGORIES] (state, {categories}) {
      state.categories = categories;
    },
    [types.SET_CONTESTS] (state, {contests}) {
      state.contests = contests;
    },
    [types.SET_COUPONS] (state, {coupons}) {
      state.coupons = coupons;
    },
    [types.SET_EVENTS] (state, {events}) {
      state.events = events;
    },
    [types.SET_FASHIONS] (state, {fashions}) {
      state.fashions = fashions;
    },
    [types.SET_FEATURE_ITEMS] (state, {feature_items}) {
      state.feature_items = feature_items;
    },
    [types.SET_HOURS] (state, {hours}) {
      state.hours = hours;
    },
    [types.SET_JOBS] (state, {jobs}) {
      state.jobs = jobs;
    },
    [types.SET_LANDMARKS] (state, {landmarks}) {
      state.landmarks = landmarks;
    },
    [types.SET_LOCALE] (state, {lang}) {
      state.locale = lang
      Cookies.set('locale', lang);
    },
    [types.SET_MALL_DATA] (state, {list}) {
      state.results = list;
    },
    [types.SET_META_DATA] (state, {list}) {
      state.meta_data = list;
    },
    [types.SET_POIS] (state, {pois}) {
      state.pois = pois;
    },
    [types.SET_POPUPS] (state, {popups}) {
      state.popups = popups;
    },
    [types.SET_PROMOTIONS] (state, {promotions}) {
      state.promotions = promotions;
    },
    [types.SET_PROPERTY] (state, {property}) {
      state.property = property;
    },
    [types.SET_REPOS] (state, {repos}) {
      state.repos = repos;
    },
    [types.SET_STORES] (state, {stores}) {
      state.stores = stores;
    }
  }
  return mutations;
});