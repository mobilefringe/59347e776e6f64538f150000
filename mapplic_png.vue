<template>
  <div style="position:relative; margin: auto;width: 100%;overflow: hidden;">
    <div id="mapplic" class="mapplic"  ></div>
    <!--<div>-->
    <!--    <loader v-if="showLoader"></loader>-->
    <!--</div>-->
</div>
</template>



<style>
    .mapplic-pin{
        /*background-color: transparent!important;    */
    }
    /* INTERACTIVE ELEMENTS */
    /* clickable elements */
    .mapplic-clickable:not(g),
    g.mapplic-clickable > * {
    	opacity: 1;
    	/*fill: #b7a6bd*/;
    }
    
    /* hovered elements */
    .mapplic-clickable:not(g):hover,
    g.mapplic-clickable:hover > * {
    	opacity: 1;
    	fill: #858585;
    }
    
    /* active elements */
    .mapplic-active,
    a.mapplic-active > path,
    g.mapplic-active > * {
    	fill: #6b6b6b;
    	opacity: 1.0 !important;
    }
    /*.mapplic-coordinates {*/
    /*    visibility: hidden;*/
    /*}*/
    .mapplic-map .mapplic-map-image {
        left: 0;
    }
</style>

<script>
    define(["Vue", "mapplic", "vue!loader"], function(Vue, mapplic, Loader) {
        return Vue.component('mapplic-png-map', {
            template: template,
            props: {
                storelist: {
                    type: Array,
                    required: true
                },
                floorlist: {
                    type: Array,
                    required: true
                },
                categories: {
                    type: Array
                },
                height: {
                    type: Number,
                    default: 1000
                },
                landmark: {
                    type: String,
                    default: null
                },
                mapfill: {
                    type: Boolean,
                    default: false
                },
                markers: {
                    type: Boolean,
                    default: true
                },
                minimap: {
                    type: Boolean,
                    default: false
                },
                sidebar: {
                    type: Boolean,
                    default: false
                },
                search: {
                    type: Boolean,
                    default: true
                },
                lightbox: {
                    type: Boolean,
                    default: false
                },
                deeplinking: {
                    type: Boolean,
                    default: false
                },
                clearbutton: {
                    type: Boolean,
                    default: false
                },
                zoombuttons: {
                    type: Boolean,
                    default: true
                },
                zoomoutclose: {
                    type: Boolean,
                    default: false
                },
                hovertip: {
                    type: Boolean,
                    default: false
                },
                tooltip: {
                    type: Object,
                    default: this.getTooltip
                },
                smartip: {
                    type: Boolean,
                    default: true
                },
                mousewheel: {
                    type: Boolean,
                    default: true
                },
                fullscreen: {
                    type: Boolean,
                    default: false
                },
                fillcolor: {
                    type: String,
                    default: "none"
                },
                action: {
                    type: String,
                    default: 'tooltip'
                },
                maxscale: {
                    type: Number,
                    default: 4
                },
                zoom: {
                    type: Boolean,
                    default: true
                },
                bindLocationOpened : {
                    type: Boolean,
                    default: false
                },
                bindLocationClosed : {
                    type: Boolean,
                    default: false
                },
                bindLevelSwitched : {
                    type: Boolean,
                    default: false
                },
                bindPositionChanged : {
                    type: Boolean,
                    default: false
                },
                svgWidth: {
                    type: Number,
                    default: 2500
                },
                svgHeight: {
                    type: Number,
                    default: 2500
                },
                tooltiplabel: {
                    type: String,
                    default: 'More Info'
                },
                showPin : {
                    type: Boolean,
                    default: false
                }
            },
            data() {
                return {
                    map: null,
                    self: null,
                    developer: false,
                    showLoader : true,
                    locationJSON: {}
                }
            },
            computed: {
                options() {
                    var options = {
                        source: this.locationJSON,
                        height: this.height,
                        landmark: this.landmark,
                        mapfill: this.mapfill,
                        markers: this.markers,
                        minimap: this.minimap,
                        sidebar: this.sidebar,
                        search: this.search,
                        lightbox: this.lightbox,
                        deeplinking: this.deeplinking,
                        clearbutton: this.clearbutton,
                        zoombuttons: this.zoombuttons,
                        zoomoutclose: this.zoomoutclose,
                        hovertip: this.hovertip,
                        tooltip: this.tooltip,
                        smartip: this.smartip,
                        mousewheel: this.mousewheel,
                        fullscreen: this.fullscreen,
                        developer: this.developer,
                        fillcolor: this.fillcolor,
                        action: this.action,
                        maxscale: this.maxscale,
                        zoom: this.zoom,
                        tooltiplabel : this.tooltiplabel
                    }
                    return options;
                },
                svgList () {
                    return _.map(this.storelist, 'svgmap_region');
                },
            },
            created(){
              this.loadStoreData();
            },
            mounted() {
                // this.store_source = this.loadStoreData();
                this.initMapplic();
            },
            // watch: {
            //     map: function() {
            //         if(this.map != null) {
            //             // this.$emit('updateMap', this.map);
                        
            //             //wait for map to load
            //             setTimeout(() => {
            //                 this.mapLoaded();
            //             }, 1500);
            //         }
                    
                    
            //     }
            // },
            methods: {
                getTooltip() {
                    //   { thumb: true, desc: true, link: true }  
                    return {
                        thumb: true,
                        desc: true,
                        link: true
                    };
                },
                initMapplic() {
                    this.map = $('#mapplic').mapplic(this.options);
                    //this.self = this.map.data('mapplic');
                    this.map.on('mapready', this.mapready);
                    if (this.bindLocationOpened) {
                        $("body").on('locationopened',this.locationopened);
                    }
                    if (this.bindLocationClosed) {
                        $("body").on('locationclosed',this.locationclosed);
                    }
                    if (this.bindLevelSwitched) {
                        $("body").on('levelswitched',this.levelswitched);
                    }
                    if (this.bindPositionChanged) {
                        $("body").on('positionchanged',this.positionchanged);
                    }
                },
                mapready(e, location) {
                    console.log('Map is ready!');
                    this.self = location;
                    
                    // this.mapLoaded();
                    this.$emit('updateMap');
                    this.showLoader = false;
                },
                locationopened(e, loc) {
                    if(loc) {
                        console.log(loc.title + ' opened.');
                        console.log(loc);
                    } else {
                        console.log(Cannot open)
                    }
                },
                locationclosed(e) {
                    console.log('Location closed.');
                },
                levelswitched(e, level) {
                    if(level) {
                        console.log('Switched to ' + level + ' level.');
                    }
                },
                positionchanged(e, self) {
                    if(self) {
                        console.log('Pan or zoom performed, current scale: ' + self);
                    }
                },
                switchLevel(target) {
                    this.self.switchLevel(target);
                },
                moveTo(x, y, s, d) {
                    this.self.moveTo(x, y, s, d);
                },
                getLocationData(id) {
                    this.self.getLocationData(id);
                },
                showLocation(id, d) {
                    this.self.showLocation(id, d);
                },
                hideLocation() {
                    this.self.hideLocation();
                },
                updateLocation(id) {
                    this.self.updateLocation(id);
                },
                loadStoreData() {
                    var mall_json = {};
                    var landmarks = {};
                    mall_json.mapwidth = this.svgWidth;
                    mall_json.mapheight = this.svgHeight;
                    mall_json.categories = [];
                    var vm = this;
                    if(vm.categories!= null && vm.categories!= undefined && vm.categories.length > 0) {
                        _.forEach(vm.categories, function(val, key) {
                            var temp_val = {};
                            temp_val.id = val.id;
                            temp_val.title = val.name;
                            temp_val.color = "#b7a6bd";
                            temp_val.show = "true";
                            mall_json.categories.push(temp_val);
                        });
                    }
                    mall_json.levels = [];
                    // need to add the following for each floor we want to configure.
                    _.forEach(vm.floorlist, function(value) { 
                        var floor_1 = {};
                        floor_1.id = value.id;
                        floor_1.title = value.title;
                        floor_1.map = value.map.split("?")[0];
                        
                        if(vm.minimap) {
                            floor_1.minimap = value.minimap.split("?")[0];
                        }
                            
                        floor_1.show = value.show;
                        floor_1.locations = [];
                        var stores_on_floors= [];
                        if(!value.z_index) {
                            stores_on_floors = vm.storelist;
                        } else {
                            stores_on_floors = _.filter(vm.storelist, function(o) { if(o.z_coordinate == null) {return true;} else { return value.z_index === o.z_coordinate; }});
                        }
                        
                        _.forEach(stores_on_floors, function(val, key) {
                            //for testing limiting the store numbers to vm
                            var temp_val = {};
                            temp_val.id = val.id;
                            temp_val.title = val.name;
                            if(val.show_desc) {
                                temp_val.description = _.truncate(val.tooltip_desc, { 'length':200, 'separator': ' ' });
                            }
                            if(val.categories != null) {
                                if(val.categories.length>1){
                                temp_val.category = val.categories[1];
                                }
                                else {
                                    temp_val.category = val.categories[0];
                                }
                            }
                            temp_val.link = "/stores/" + val.slug;
                            
                            if(val.zoom){
                                temp_val.zoom = val.zoom;
                            }
                            
                            //get svg's wifth/height by checking the map
                            if(val.x_coordinate) {
                                temp_val.x = val.x_coordinate / vm.svgWidth;
                            }
                            else {
                                temp_val.x = 0.5;
                            }
                            if(val.y_coordinate) {
                                temp_val.y = val.y_coordinate / vm.svgHeight;
                            }
                            else {
                                temp_val.y = 0.5;
                            }
                            // temp_val.y = val.y_coordinate / vm.svgHeight;
                            if(val.showPin){
                                temp_val.pin = "black-pin";
                               
                            }
                            else {
                                temp_val.pin = "hidden";
                            }
                            
                            floor_1.locations.push(temp_val);
                        });
                        mall_json.levels.push(floor_1);
                    });
                    
                    this.locationJSON = mall_json;
                },
                addActiveClass(id) {
                    $("#"+id).removeClass('mapplic-active');
                    $("#"+id).addClass('mapplic-active');
                }
            },
            beforeDestroy: function() {
                // this.map.destroy();
                
                this.map.off('mapready', this.mapready);
                if (this.bindLocationOpened) {
                    $("body").off('locationopened',this.locationopened);
                }
                if (this.bindLocationClosed) {
                    $("body").off('locationclosed',this.locationclosed);
                }
                if (this.bindLevelSwitched) {
                    $("body").off('levelswitched',this.levelswitched);
                }
                if (this.bindPositionChanged) {
                    $("body").off('positionchanged',this.positionchanged);
                }
                    
                console.log("Destroyed!");
            }
        });
    });
</script>