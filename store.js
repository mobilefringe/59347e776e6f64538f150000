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
        CONTACT_US: function ({commit},send_data) {
            return new Promise((resolve, reject) => {
                console.log(send_data);
                console.log("form data is: " , send_data.form_data);
                axios.post(send_data.url, send_data.form_data).then(response => {
                    resolve(response);
                }).catch(error => {
                    console.log("Data load error: " + error.message);
                    reject(error);
                });
            })
            
        },
    },
    mutations: {
        SET_MALL_DATA: (state, { list, data_id }) => {
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
                } else {
                    hoursObject = todayHours;
                }
                hoursObject.locale = state.locale; // IMPORTANT! Here I am adding the state's locale in the hours object such that it will trigger a change in the template anytime the locale changes in the app.
                return hoursObject;
            } 
            catch (err) {
                return null;
            }
        },
        getPropertyHours: state => {
            try {
                let hours = state.results.hours;
                let property = state.results.property;
                let timezone = property.timezone_moment;
                let hoursObject = _.filter(hours, function(o) { return o.store_ids === null && !o.is_holiday; });
                
                hoursObject.locale = state.locale; // IMPORTANT! Here I am adding the state's locale in the hours object such that it will trigger a change in the template anytime the locale changes in the app.
                return hoursObject;
            } 
            catch (err) {
                return null;
            }
        },
        getPropertyHolidayHours: state => {
            try {
                let hours = state.results.hours;
                let property = state.results.property;
                let timezone = property.timezone_moment;
                let hoursObject = _.filter(hours, function(o) { return o.store_ids === null && o.is_holiday; });
                
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
        processedEvents: state => {
            try {
                let events = state.results.events;
                let stores = state.results.stores;
                // Add image_url attribute with CDN link
                events.map(event => {
                    event.image_url = event.event_image_url_abs;
                    event.locale = state.locale;
                    event.store = null;
                    if (event.eventable_type === "Store") {
                        let foundStore = stores.find(store => store.id === event.eventable_id.toString());
                        if (foundStore) {
                            event.store = foundStore;
                        }
                    }
                });
                return events;
            } 
            catch (err) {
                return [];
            }
        },
        processedCoupons: state => {
            try {
                let coupons = state.results.coupons;
                let stores = state.results.stores;
                // Add image_url attribute with CDN link
                coupons.map(coupon => {
                    coupon.image_url = coupon.promo_image_url_abs;
                    coupon.locale = state.locale;
                    coupon.store = null;
                    if (coupon.promotionable_type === "Store") {
                        let foundStore = stores.find(store => store.id === coupon.promotionable_id.toString());
                        if (foundStore) {
                            coupon.store = foundStore;
                        }
                    }
                });
                return coupons;
            } 
            catch (err) {
                return [];
            }
        },
        processedJobs: state => {
            try {
                let jobs = state.results.jobs;
                let stores = state.results.stores;
                // Add image_url attribute with CDN link
                jobs.map(job => {
                    job.locale = state.locale;
                    job.store = null;
                    if (job.jobable_type === "Store") {
                        let foundStore = stores.find(store => store.id === job.jobable_id.toString());
                        if (foundStore) {
                            job.store = foundStore;
                        }
                    }
                });
                return jobs;
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
        processedCategories: state => {
            try {
                return state.results.categories;
            }
            catch (err) {
                return [];
            }
        },
        findStoreBySlug: (state, getters) => (slug) => {
            let stores = state.results.stores;
            return stores.find(store => store.slug === slug)
        },
        findStoreById: (state, getters) => (id) => {
            let stores = state.results.stores;
            return stores.find(store => _.toNumber(store.id) === _.toNumber(id))
        },
        findCategoryById: (state, getters) => (id) => {
            let categories = getters.processedCategories;
            return categories.find(category => _.toNumber(category.id) === _.toNumber(id))
        },
        findCategoryByName: (state, getters) => (name) => {
            let categories = getters.processedCategories;
            return categories.find(category => _.toString(category.name) === _.toString(name))
        },
        findPromoBySlug: (state, getters) => (slug) => {
            let promos = getters.processedPromos;
            return promos.find(promo => promo.slug === slug)
        },
        findPromoById: (state, getters) => (id) => {
            let promos = getters.processedPromos;
            return promos.find(promo => _.toNumber(promo.id) === _.toNumber(id))
        },
        findEventBySlug: (state, getters) => (slug) => {
            let events = getters.processedEvents;
            return events.find(event => event.slug === slug)
        },
        findEventById: (state, getters) => (id) => {
            let events = getters.processedEvents;
            return events.find(event => _.toNumber(event.id) === _.toNumber(id))
        },
        findCouponBySlug: (state, getters) => (slug) => {
            let coupons = getters.processedCoupons;
            return coupons.find(coupon => coupon.slug === slug)
        },
        findCouponById: (state, getters) => (id) => {
            let coupons = getters.processedCoupons;
            return coupons.find(coupon => _.toNumber(coupon.id) === _.toNumber(id))
        },
        findJobBySlug: (state, getters) => (slug) => {
            let jobs = getters.processedJobs;
            return jobs.find(job => job.slug === slug)
        },
        findJobById: (state, getters) => (id) => {
            let jobs = getters.processedJobs;
            return jobs.find(job => _.toNumber(job.id) === _.toNumber(id))
        },
        findBlogByName: (state, getters) => (name) => {
            let blogs = state.results.blogs;
            return blogs.find(blog => blog.name === name )
        },
        findBlogBySlug: (state, getters) => (slug) => {
            let blogs = state.results.blogs;
            return blogs.find(blog => blog.slug === slug )
        },
        findBlogPostBySlug : (state, getters) => (name, slug) => {
            let blogs =  getters.findBlogByName(name);
            let blog_posts = blogs.posts;
            return blog_posts.find(blog_post => blog_post.slug === slug )
        },
        findHourById: (state, getters) => (id) => {
            let hours = state.results.hours;
            return hours.find(hour => _.toNumber(hour.id) === _.toNumber(id))
        },
        findRepoByName: (state, getters) => (name) => {
            let repos = state.results.repos;
            return repos.find(repo => repo.name === name)
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
        },
        findNewStores: (state, getters) => {
            let stores = getters.processedStores;
            let new_stores = _.filter(stores, function(o) { return o.is_new_store == true; });
            return new_stores
        },
        findComingSoonStores: (state, getters) => {
            let stores = getters.processedStores;
            let coming_soon = _.filter(stores, function(o) { return o.is_coming_soon_store == true; });
            return coming_soon
        }
    },
    modules: {

    }
    });
    return store;
});
