<template>
  <div style="position:relative; margin: auto;width: 100%;overflow: hidden;">
    <div id="mapplic" class="mapplic"  ></div>
    <div>
        <np-loader v-if="showLoader"></np-loader>
    </div>
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
</style>

<script>
    define(["Vue","jquery", "mousewheel", "hammer", "move", "mapplic"], function(Vue,$,mousewheel, hammer, move, mapplic) {
        console.log("move");
        console.log(move);
        return Vue.component('mapplic-map', {
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
                    default: true
                },
                sidebar: {
                    type: Boolean,
                    default: true
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
                    default: true
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
                    default: "#4d5e6d"
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
                }
            },
            data() {
                return {
                    map: null,
                    self: null,
                    developer: false,
                    showLoader : true,
                }
            },
            computed: {
                options() {
                    var options = {
                        source: this.loadStoreData(),
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
                        zoom: this.zoom
                    }
                    return options;
                },
                svgList () {
                    return _.map(this.storelist, 'svgmap_region');
                },
            },
            mounted() {
                // this.store_source = this.loadStoreData();
                this.initMapplic();
            },
            watch: {
                map: function() {
                    if(this.map != null) {
                        this.$emit('updateMap', this.map);
                        
                        //wait for map to load
                        setTimeout(() => {
                            this.mapLoaded();
                        }, 1500);
                    }
                    
                    
                }
            },
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
                    this.self = this.map.data('mapplic');
                    
                    $("body").on('mapready', this.mapready);
                    
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
                },
                locationopened(e, loc) {
                    if(loc) {
                        console.log(loc.title + ' opened.');
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
                mapLoaded (e){
                    var svg = document.getElementById('landmarks-1');
                    // NS = svg.getAttribute('xmlns');
                    var vm = this;
                    //get floors to be visible 
                    $(".mapplic-layer").show();
                    
                    //go through all the regions and recalculat the locations
                    _.forEach(this.svgList, function(val, key) {
                        var element = document.getElementById(val);
                        if (element){
                            elBBox = element.getBoundingClientRect();
                            var viewport_center_x = 0;
                            var viewport_center_y = 0;
                            viewport_center_x = _.toNumber(elBBox.x) + elBBox.width/2;
                            viewport_center_y = _.toNumber(elBBox.y) + elBBox.height/2;
                           
                            pt = svg.createSVGPoint();
                            pt.x = viewport_center_x;
                            pt.y = viewport_center_y;
                            var svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
                            // console.log("svg points", svgP.x,svgP.y);
                            var new_x = svgP.x/ 2500;
                            var new_y = svgP.y/ 2500;
                            
                            var location = vm.self.getLocationData(val);
                            if(location !== null && location.el){
                                location.x = new_x;
                                location.y =  new_y;
                                vm.self.updateLocation(val);
                            }
                        }
                    });
                    
                    //find which levels need to be hidden
                    hidden_level = _.filter(this.self.data.levels , function (o){ console.log (o); return o.show !== true;});
                    //doing it in a loop for future cases where there are more than two floors
                    _.forEach(hidden_level, function(val, key) {
                        $(".mapplic-layer[data-floor='"+val.id+"']").hide();
                    });
                    
                    this.showLoader = false;
                    console.log(vm.self);
                },
                loadStoreData() {
                    var mall_json = {};
                    var landmarks = {};
                    mall_json.mapwidth = "1000";
                    mall_json.mapheight = "1000";
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
                        floor_1.map = value.map;
                        
                        if(vm.minimap) {
                            floor_1.minimap = value.minimap;
                        }
                            
                        floor_1.show = value.show;
                        floor_1.locations = [];
                        var stores_on_floors = _.filter(vm.storelist, function(o) { return value.z_index === o.z_coordinate; }); // ['z_coordinate', value.z_index]);
                        _.forEach(stores_on_floors, function(val, key) {
                            //for testing limiting the store numbers to vm
                            var temp_val = {};
                            temp_val.id = val.svgmap_region;
                            temp_val.title = val.name;
                            temp_val.about = _.truncate(val.description, { 'length':200, 'separator': ' ' });
                            temp_val.category = val.categories[1];
                            temp_val.link = "/stores/" + val.slug;
                            temp_val.pin = "hidden";
                            temp_val.fill = "#";
                            
                            //get svg's wifth/height by checking the map
                            var svg_width = 1530;
                            var svg_height = 1358;
    
                            temp_val.x = val.x_coordinate / svg_width;
                            temp_val.y = val.y_coordinate / svg_height;
                            floor_1.locations.push(temp_val);
                        });
                        mall_json.levels.push(floor_1);
                    });
                    
                    return mall_json;
                }
            },
            beforeDestroy: function() {
                this.map.destroy();
                
                $("body").off('mapready', this.mapready);
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