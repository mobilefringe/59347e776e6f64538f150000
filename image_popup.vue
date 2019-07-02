<template>
    <div v-if="dataLoaded">
      <div class="popup_container" v-if="currentPopup && show_popup">
          <i class="fa fa-times close_popup" @click="closePopup()"></i>
          <a :href="currentPopup.photo_link" target="_target">
            <img :src="currentPopup.image_url">
          </a>
      </div>
    </div>
</template>
<script>
    define(["Vue", "vuex", "jquery", 'js-cookie'], function(Vue, Vuex,$, Cookies) {
        return Vue.component("image-popup-component", {
            template: template, // the variable template will be injected,
            data() {
                return {
                  show_popup: false,
                  dataLoaded:false
                }
            },
            created(){
                this.loadData().then(response => {
                    this.dataLoaded = true;  
                });
            },
            mounted() {
                var viewed = null;
                if (this.locale == "en") {
                  viewed = Cookies.get("popup_viewed_en");
                } else {
                  viewed = Cookies.get("popup_viewed_fr");
                }
            
                if (this.currentPopup && viewed !== "true") {
                  if (this.locale == "en") {
                    Cookies.set("popup_viewed_en", "true");
                  } else {
                    Cookies.set("popup_viewed_fr", "true");
                  }
                  this.show_popup = true;
                  this.currentPopup.image_url =
                    "//mallmaverick.cdn.speedyrails.net" + this.currentPopup.photo_url;
                  $('<div class="modal-backdrop custom_backdrop"></div>').appendTo(document.body);
                }
            },
            watch: {
                show_popup() {
                  if (this.show_popup === true) {
                    document.body.classList.add("no-scroll");
                  } else if (this.show_popup === false) {
                    document.body.classList.remove("no-scroll");
                  }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone'
                ]),
                currentPopup() {
                  //   var popup = this.$store.state.popups[0];
                  var popup = null;
                  if (this.locale == "fr") {
                    popup = _.find(this.$store.state.popups, function(o) {
                      return _.includes(o.slug, "french");
                    });
                  } else {
                    popup = _.find(this.$store.state.popups, function(o) {
                      return _.includes(o.slug, "english");
                    });
                  }
                  return popup;
                }
            },
            methods: {
                closePopup() {
                  this.show_popup = false;
                  $(".modal-backdrop").remove();
                },
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "popups")]);
                        return results;
                    } catch(e) {
                        console.log("Error loading data: " + e.message);    
                    }
                },
            }
        });
    });
</script>