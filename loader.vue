<template>
    <div id="overlay">
        <div class="loading-container">
            <vue-simple-spinner size="huge" :message="property.name + ' is loading...'" v-if="property"></vue-simple-spinner>
        </div>
    </div>
</template>

<script>
    define(["Vue", "vuex", "vue-simple-spinner"], function (Vue, Vuex, Spinner) {
        Vue.component("vue-simple-spinner", Spinner);
        return Vue.component("loader", {
            template: template, // the variable template will be injected,
            data: function () {
                return {};
            },
            computed: {
                ...Vuex.mapGetters([
                    'property'
                ]),
            },
        });
    });
</script>

<style>
    #overlay {
        position: fixed;
        /* Sit on top of the page content */
        width: 100%;
        /* Full width (cover the whole page) */
        height: 100%;
        /* Full height (cover the whole page) */
        overflow: hidden;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ffffff;
        z-index: 999;
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: -moz-flex;
        display: -ms-flexbox;
        display: flex;
    }
    .loading-container .vue-simple-spinner-text{
        line-height: 1;
    }
</style>