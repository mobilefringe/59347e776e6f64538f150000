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
                  dataLoaded:false,
                  currentPopup: null
                }
            },
            created(){
                this.loadData().then(response => {
                    this.dataLoaded = true;  
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
                    });
            },
            mounted() {
                var viewed = null;
                viewed = Cookies.get("popup_viewed");
            
                if (this.currentPopup && viewed !== "true") {
                  Cookies.set("popup_viewed", "true");
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
                ])
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
<style>
    /******** popup ***********/
    .custom_backdrop {
      opacity: 0.5;
      display: none;
    }
    
    .close_popup {
      height: 33px;
      width: 56px;
      left: auto;
      right: 0px;
      bottom: auto;
      top: 0px;
      padding: 8px;
      color: #ffffff;
      font-size: 12px;
      line-height: 14px;
      border: 1px none #ffffff;
      border-radius: 0px;
      box-shadow: 0px 0px 0px 0px rgba(2, 2, 2, 0.23);
      text-shadow: 0px 0px 0px rgba(0, 0, 0, 0.23);
      background-color: #012d1c;
      text-align: center;
      position: absolute;
      font-weight: 700;
      cursor: pointer;
    }
    
    .popup_container {
      position: absolute;
      z-index: 1041;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
</style>