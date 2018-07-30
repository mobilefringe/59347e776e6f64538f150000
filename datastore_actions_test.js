define(['axios', 'datastore_mutation_types', 'js-cookie'], function (axios, types, Cookies) {
  const actions = {
    initializeApi: function({commit}, api) {
      commit(types.SET_API_DETAILS, {api: api});
    },
    getData: function ({state, commit}, resource) {
      if (!state.api.version || !state.api.site){
        console.error("api version and api site must be set!");
        return;
      }
      return new Promise((resolve, reject) => {
        if(resource !== "subcategories") {
            axios.get('https://www.mallmaverick.com/api/' + state.api.version + "/" + state.api.site + "/" + resource + ".json").then(response => {
              switch(resource) {
                case "banners":
                  commit(types.SET_BANNERS, { banners: response.data.banners });
                  break;
                case "blogs":
                  commit(types.SET_BLOGS, { blogs: response.data.blogs });
                  break;
                case "categories":
                  commit(types.SET_CATEGORIES, { categories: response.data.categories });
                  break;
                case "contests":
                  commit(types.SET_CONTESTS, { contests: response.data.contests });
                  break;
                case "coupons":
                  commit(types.SET_COUPONS, { coupons: response.data.coupons });
                  break;
                case "events":
                  commit(types.SET_EVENTS, { events: response.data.events });
                  break;
                case "fashions":
                  commit(types.SET_FASHIONS, { fashions: response.data.fashions });
                  break;
                case "feature_items":
                  commit(types.SET_FEATURE_ITEMS, { feature_items: response.data.feature_items });
                  break;
                case "hours":
                  commit(types.SET_HOURS, { hours: response.data.hours });
                  break;
                case "jobs":
                  commit(types.SET_JOBS, { jobs: response.data.jobs });
                  break;
                case "landmarks":
                  commit(types.SET_LANDMARKS, { landmarks: response.data.landmarks });
                  break;
                case "point_of_interests":
                  commit(types.SET_POIS, { pois: response.data.pois });
                  break;
                case "popups":
                  commit(types.SET_POPUPS, { popups: response.data.popups });
                  break;
                case "promotions":
                  commit(types.SET_PROMOTIONS, { promotions: response.data.promotions });
                  break;
                case "property":
                  commit(types.SET_PROPERTY, { property: response.data });
                  break;
                case "repos":
                  commit(types.SET_REPOS, { repos: response.data.repos });
                  break;
                case "stores":
                  commit(types.SET_STORES, { stores: response.data.stores });
                  break;
              }
              resolve(response);
            }).catch(error => {
              reject(error);
            });
        }
        else {
            axios.get('https://www.mallmaverick.com/api/' + state.api.version + "/" + state.api.site + "/" + resource + ".json?bust=true").then(response => {
                commit(types.SET_SUBCATEGORIES, { subcategories: response.data.subcategories });
                resolve(response);
            }).catch(error => {
              reject(error);
            });
        }
      })
    },
    setDataLoaded: function ({commit}, dataLoaded) {
      return new Promise((resolve, reject) => {
        commit(types.SET_DATA_LOADED, {
          dataLoaded: dataLoaded
        })
        resolve(dataLoaded);
      })
    },
    LOAD_MALL_DATA: function ({commit}, list) {
      console.warn("Load Mall Data has been deprecated.")
      return new Promise((resolve, reject) => {
        axios.get(list.url).then(response => {
          commit(types.SET_MALL_DATA, {
            list: response.data
          })
          resolve(response);
        }).catch(error => {
          console.log("Data load error: " + error.message);
          reject(error);
        });
      })
    },
    LOAD_META_DATA: function ({commit}) {
      return new Promise((resolve, reject) => {
        axios.get("/api/v1/get_meta_data").then(response => {
          commit(types.SET_META_DATA, {
            list: response.data
          })
          resolve(response);
        }).catch(error => {
          console.log("Meta Data load error: " + error.message);
          reject(error);
        });
      })
    },
    INITIALIZE_LOCALE: function ({commit}) {
      return new Promise((resolve, reject) => {
        let _locale = Cookies.get('locale');
        if (!_locale) {
          _locale = 'en-ca';
        }
        commit(types.SET_LOCALE, {
          lang: _locale
        })
        resolve(_locale);
      })
    },
    LOAD_PAGE_DATA: function ({commit}, list) {
      return new Promise((resolve, reject) => {
        axios.get(list.url).then(response => {
          // commit('SET_MALL_DATA', { list: response.data })
          resolve(response);
        }).catch(error => {
          console.log("Data load error: " + error.message);
          reject(error);
        });
      })
    },
    CONTACT_US: function ({commit}, send_data) {
      return new Promise((resolve, reject) => {
        axios.post('/api/v1/contact_us', {
          form_data: send_data.form_data
        }).then(response => {
          resolve(response);
        }).catch(error => {
          console.log("Data load error: " + error.message);
          reject(error);
        });
      })
    },
    POST_TO_MM: function ({commit}, send_data) {
      return new Promise((resolve, reject) => {
        axios.post(send_data.url, send_data.form_data).then(response => {
          resolve(response);
        }).catch(error => {
          console.log("Data load error: " + error.message);
          reject(error);
        });
      })

    }
  }
  return actions;
});