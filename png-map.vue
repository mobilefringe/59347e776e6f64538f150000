<template>
    <div class="svg-map" >
        <div class="map">
            <div id="zoom_container">
                <img id="png_map" class="png_map" alt="center map" :src="pngMapUrl" width="938" height="700"/>
            
                <div class="landmarks" data-show-at-zoom="100" data-allow-drag="true">
                    
        	    </div>    
            </div>
        </div>
    </div>
</template>

<script>
    define(["Vue"], function(Vue) {
        return Vue.component('png-map', {
            template: template,
            props: {
                pngMapUrl: {
                    type: String,
                    required: true
                },
                // colours:{
                //     type: Object,
                //     default: this.getColour
                // },
                // viewBox : {
                //     type : Array,
                //     default: this.getEmptyArray //viewBox: [3000,0,6000,6000],
                // },
                // disableAll: {
                //     type: Boolean,
                //     default: false
                // },
                height: {
                    type: Number,
                    default: 1000
                },
                width:{
                    type: Number,
                    default: 1300
                },
                regions: {
                    type: Array,
                    default: this.getEmptyArray
                },
                buttonAlign: {
                    type: String,
                    default: "top right"
                },
                zoom: {
                    type: Boolean,
                    default: true
                },
                zoomButtons: {
                    type: Object,
                    default: this.getZoomBtn
                },
                pan: {
                    type: Boolean,
                    default: true
                },
                cursor: {
                    type: String,
                    default: 'pointer'
                },
                responsive: {
                    type: Boolean,
                    default: true
                },
                zoomLimit: {
                    type: Array,
                    default: this.getZoomLimit
                }
            },
            data() {
                return {
                    isOpen: false,
                    map: null,
                    all_markers : []
                }
            },
             activated () {
                // this.$forceUpdate();
                console.log("activedthis");
                // this.currentStore = this.findStoreBySlug(to.params.id);
                // if (this.currentStore === null || this.currentStore === undefined){
                //     this.$router.replace({ name: '404'});
                // }
            },
            created() {
                // console.log(vm.$on('setMarker',this.addMarker));
            },
            watch : {
                map : function () {
                    this.$emit('updateMap', this.map);  
                    // console.log(this.$on('setMarker',this.addMarker));
                }
            },
            mounted () {
                this.map = $('#png_map').smoothZoom({
        		    height: this.height,
        		    width: this.height,
        		    initial_ZOOM: 0,
        			zoom_MIN: 0,
        			zoom_MAX: 200,
        			responsive: true,
        		    responsive_maintain_ratio: true,
        			zoom_BUTTONS_SHOW : 'YES',
        			pan_BUTTONS_SHOW : 'NO',
        			pan_LIMIT_BOUNDARY : 'NO',
        			button_ALIGN: this.buttonAlign,
        			container: 'zoom_container'
        		});
                
                console.log("mounted", this.map);
            },
            methods : {
                getColour() {
                    return {stroke: '#aaaaaa', selected: "#CC00CC", hover: "#CC00CC"} ;
                },
                getEmptyArray () {
                    return [];
                },
                getZoomBtn () {
                    return {'show': true,'location': 'left' };
                },
                getZoomLimit () {
                    return [0,10];
                },
                addMarker (val, image ) {
                    if ( val!= null && val.svgmap_region != null && typeof(val.svgmap_region)  != 'undefined' ){
                        var coords = this.map.get_coords(val.svgmap_region);
                        var height = parseInt(coords["height"])
                        var width = parseInt(coords["width"])
                        var x_offset = (parseInt(width) / 2);
                        var y_offset = (parseInt(height) /2);
                        var mark = { xy: [coords["x"]    + x_offset-15, coords["y"]  + y_offset-55],
                            attrs: {
                                id:"marker_"+ val.id,
                                src:image , // image for marker
                                href: '/stores/'+val.slug
                            },
                            tooltip : "<p class='tooltip_name'>"+val.name +"</p>",
                            id:"marker_"+ val.id
                        };
                        this.setMarkerOnMap([mark]);
                        this.all_markers.push(mark);
                    }
                },
                setMarkerOnMap (mark) {
                    this.map.setMarks(mark);
                },
                setViewBox(val){
                    this.map.setViewBox(val.svgmap_region);
                },
                hideMarkers () {
                    this.map.marksHide();
                },
                removeMark (id) {
                    this.resetMapMarks(id)
                },
                resetMapMarks(id) {
                    var mark_id = "marker_"+ id;
                    console.log(this.all_markers);
                    this.all_markers = _.filter(this.all_markers, function(o) { if(o !== null || o !== undefined) {return (o.id !== mark_id)} });
                    this.hideMarkers();
                    this.setMarkerOnMap(this.all_markers);
                    
                }
            },
            beforeDestroy: function() {
                this.map.destroy();
                console.log("Destroyed!");
            }
        });
    });
</script>