<template>
    <div v-masonry transition-duration="0.3s" item-selector=".stores-grid-item" horizontal-order="true">
        <transition-group name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" tag="div">
            <div v-masonry-tile  v-for="(store, index) in filteredStores" :key="index" class="stores-grid-item">
        	    <div class="store_logo_container">
        	        <router-link :to="'/stores/'+ store.slug">
            			<div v-if="!store.no_store_logo">
            			    <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png" alt="">
            			    <img  class="store_img" :src="store.store_front_url_abs" :alt="'Click here to view info about ' + store.name +  store.id"/>
            			</div>
            			
                        <div v-else class="no_logo_container">
                            <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png" alt="">
                            <div class="no_logo_text">
                                <div class="store_text"><h2>{{ store.name }}</h2></div>
                            </div>
                        </div>
            			<div class="store_tag" v-if="store.total_published_promos">
							<div class="store_tag_text">Promotion</div>
						</div>
						<div class="store_tag" v-if="!store.total_published_promos && store.is_coming_soon_store">
							<div class="store_tag_text">Coming Soon</div>
						</div>
						<div class="store_tag" v-if="!store.total_published_promos && !store.is_coming_soon_store && store.is_new_store">
							<div class="store_tag_text">New Store</div>
						</div>
						<div class="store_details">
						    <div class="store_text"><h2>{{ store.name }}</h2></div>    
						</div>
            		</router-link>
        	    </div>
            </div>
        </transition-group>
    </div>
</template>
<script>
    define(["Vue", "vuex",  "masonry","vue-masonry-plugin"], function(Vue, Vuex, masonry, VueMasonryPlugin) {
        Vue.use(VueMasonryPlugin.default);
        return Vue.component("store-masonry", {
            template: template, // the variable template will be injected,
            props: ["filteredStores"]
        });
    });
</script>