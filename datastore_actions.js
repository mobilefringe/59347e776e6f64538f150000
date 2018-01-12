define(['axios', 'datastore_mutation_types', 'js-cookie'], function (axios, types, Cookies) {
  const actions = {
    LOAD_MALL_DATA: function ({commit}, list) {
      console.warn("This method is deprecated. Please avoid using all.json")
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