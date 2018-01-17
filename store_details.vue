<template>
  <div class="row" v-if="currentStore">
    <div class="large-6 columns">
      <div>
        <h1>{{currentStore.name}}</h1>
        <p>{{currentStore.description}}</p>
        <a v-bind:href="currentStore.website">{{currentStore.website}}</a>
      </div>
    </div>
  </div>
</template>

<script>
  define(["Vue", "vuex"], function(Vue, Vuex) {
    return Vue.component("store-details-component", {
      template: template, // the variable template will be injected,
      data: function() {
        return {
          title: "MM with Vue.js!",
          description: "An example of integration of Mall Maverick with Vue.js",
          currentStore: null
        }
      },
      props:['id'],
      created(){
        console.log(this.$store.state);
        this.currentStore = this.findStoreBySlug(this.id);
        if (this.currentStore === null || this.currentStore === undefined){
          this.$router.replace({ name: '404'});
        }
      },
      /*
      beforeRouteEnter (to, from, next) {
        next(vm => {
          // access to component instance via `vm`
          vm.currentStore = vm.findStoreBySlug(to.params.id);
          if (vm.currentStore === null || vm.currentStore === undefined){
            vm.$router.replace({ name: '404'});
          }
        })
      },
      beforeRouteUpdate (to, from, next) {
        this.currentStore = this.findStoreBySlug(to.params.id);
        if (this.currentStore === null || this.currentStore === undefined){
          this.$router.replace({ name: '404'});
        }
      },
      */
      computed: {
        ...Vuex.mapGetters([
          'findStoreBySlug'
        ])
      }
    });
  });
</script>
