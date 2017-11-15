define(['Vue', 'vuex', 'axios', 'js-cookie', 'moment', 'moment-timezone', 'lodash'], function (Vue, Vuex, axios, Cookies, moment, tz, _) {
  Vue.use(Vuex);
  const store = new Vuex.Store({
    state: {
      results: [],
      meta_data: [],
      locale: null,
      url: null
    },
    actions: {
      LOAD_MALL_DATA: function ({commit}, list) {
        return new Promise((resolve, reject) => {
          axios.get(list.url).then(response => {
            commit('SET_MALL_DATA', { list: response.data })
            resolve(response);
          }).catch(error => {
            console.log("Data load error: " + error.message);
            reject(error);
          });
        })
      },
      LOAD_META_DATA: function ({ commit }) {
        return new Promise((resolve, reject) => {
          axios.get("/api/v1/get_meta_data").then(response => {
            commit('SET_META_DATA', { list: response.data })
            resolve(response);
          }).catch(error => {
            console.log("Meta Data load error: " + error.message);
            reject(error);
          });
        })
      },
      INITIALIZE_LOCALE: function ({ commit }) {
        return new Promise((resolve, reject) => {
          let _locale = Cookies.get('locale');
          if (!_locale) {
            _locale = 'en-ca';
          }
          commit('SET_LOCALE', { lang: _locale })
          resolve(_locale);
        })
      },
    },
    mutations: {
      SET_MALL_DATA: (state, { list }) => {
        state.results = list
      },
      SET_LOCALE: (state, { lang }) => {
        state.locale = lang
        Cookies.set('locale', lang);
      },
      SET_META_DATA: (state, { list }) => {
        state.meta_data = list
      }
    },
    getters: {
      getLocale: state => {
        let locale = state.locale;
        return locale;
      },
      getTimezone: state => {
        let property = state.results.property;
        let timezone = property !== undefined ? property.timezone_moment : null;
        return timezone;
      },
      getProperty: state => {
        let property = state.results.property;
        return property;
      },
      getTodayHours: state => {
        try {
          let hours = state.results.hours;
          let property = state.results.property;
          let timezone = property.timezone_moment;
          let todayHours = hours.find(hour => hour.day_of_week === moment().day());
          let holidayHours = hours.find(hour => hour.is_holiday == true && (moment(hour.holiday_date).tz(timezone).date() == moment().tz(timezone).date() && moment(hour.holiday_date).tz(timezone).month() + 1 == moment().tz(timezone).month() + 1 && moment(hour.holiday_date).tz(timezone).year() == moment().tz(timezone).year()));
          let hoursObject = null;
          if (holidayHours){
            hoursObject = holidayHours;
          }
          else{
            hoursObject = todayHours;
          }
          hoursObject.locale = state.locale; // IMPORTANT! Here I am adding the state's locale in the hours object such that it will trigger a change in the template anytime the locale changes in the app.
          return hoursObject;
        }
        catch (err) {
          return null;
        }
      },
      processedPromos: state => {
        try {
          let promos = state.results.promotions;
          let stores = state.results.stores;
          // Add image_url attribute with CDN link
          promos.map(promo => {
            promo.image_url = promo.promo_image_url_abs;
            promo.locale = state.locale;
            promo.store = null;
            if (promo.promotionable_type === "Store") {
              let foundStore = stores.find(store => store.id === promo.promotionable_id.toString());
              if (foundStore) {
                promo.store = foundStore;
              }
            }
          });
          return promos;
        }
        catch (err) {
          return [];
        }
      },
      processedStores: state => {
        try {
          let stores = state.results.stores;
          // Add image_url attribute with CDN link
          stores.map(store => {
            store.image_url = "https://mallmaverick.cdn.speedyrails.net" + store.store_front_url;
          });
          return stores;
        }
        catch (err) {
          return [];
        }
      },
      findStoreBySlug: (state, getters) => (slug) => {
        let stores = state.results.stores;
        return stores.find(store => store.slug === slug)
      },
      findPromoBySlug: (state, getters) => (slug) => {
        let promos = getters.processedPromos;
        return promos.find(promo => promo.slug === slug)
      },
      findPromoByID: (state, getters) => (slug) => {
        let promos = getters.processedPromos;
        return promos.find(promo => promo.slug === slug)
      },
      findMetaDataByPath: (state, getters) => (path) => {
        try {
          let meta_data = state.meta_data.meta_data;
          let found = meta_data.find(meta => meta.path === path);
          if (found) {
            return found;
          }
          else {
            let meta = {
              meta_title: "",
              meta_description: "",
              meta_keywords: ""
            }
            return meta;
          }
        }
        catch (err) {
          let meta = {
            meta_title: "",
            meta_description: "",
            meta_keywords: ""
          }
          return meta;
        }
      },
      storesByAlphaIndex: (state, getters) => {
        let stores = getters.processedStores;
        let grouped = _.groupBy(stores, store => (isNaN(store.name.charAt(0)) ? store.name.charAt(0) : "#"));
        return grouped;
      },
      storesByCategoryName: (state, getters) => {
        let stores = getters.processedStores;
        let categories = state.results.categories;
        let tempStores = [];
        let groupedCategoriesById = _.groupBy(categories, category => category.id.toString());
        _.each(stores, store => _.each(store.categories, cat => {
          catName = groupedCategoriesById[cat][0].name;
          store.category_name = catName;
          tempStores.push(store);
        }));
        tempStores = _.orderBy(tempStores, store => store.category_name);
        let groupedStoresByCategoryName = _.groupBy(tempStores, store => store.category_name);
        return groupedStoresByCategoryName;
      }
    },
    modules: {

    }
  });
  return store;
});
