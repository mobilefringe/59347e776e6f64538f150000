<template>
    <div class="popup_container" v-if="currentPopup && show_popup">
      <i class="fa fa-times close_popup" @click="closePopup()"></i>
      <a :href="currentPopup.photo_link" target="_target">
        <img :src="currentPopup.image_url">
      </a>
    </div>
</template>
<script>
    define(["Vue", "vuex"], function(Vue, Vuex) {
        return Vue.component("image-popup", {
            template: template, // the variable template will be injected,
            data() {
                return {
                  show_popup: false
                };
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
                },
            },
            methods: {
                closePopup() {
                  this.show_popup = false;
                  document.getElementById("popup_backdrop").style.display = "none";
                }
            }
        });
    });
</script>