<template>
    <div class="" id="map"></div>
</template>
<style>
    /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 100%;
      }
</style>

<script>
    define(["Vue", "vuex", 'google-map-api', 'axios', 'json!google_theme.json'], function(Vue, Vuex, googleMapAPI, axios) {
        return Vue.component("google-map", {
            template: template, 
            props: {
                property: {
                    type: Object,
                    required: true
                },
                zoom: {
                    type: Number,
                    default: 15
                }
            },
            data: function() {
                return {
                    position: null
                }
            },
            mounted() {
                property_string = this.property.address1+"+"+ this.property.city + "+" + this.property.country + "+" + this.property.postal_code;
                property_string = property_string.replace(/ /g,"+");
                axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='+property_string +'&key=AIzaSyCukCjH3fsuDYBdI44hZKL43m60jEToJjY').then(response => {
                    geometry = response.data.results[0].geometry;
                    var new_pos = {};
                    new_pos.lat = geometry.location.lat;
                    new_pos.lng = geometry.location.lng;
                    this.position = new_pos;
                });
            },
            watch : {
                position () {
                    this.initMap();
                }
            },
            methods : {
                initMap() {
            // Styles a map in night mode.
            var map = new google.maps.Map(document.getElementById('map'), {
              center: this.position,
              zoom: this.zoom,
              styles: [
                {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                {
                  featureType: 'administrative.locality',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#d59563'}]
                },
                {
                  featureType: 'poi',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#d59563'}]
                },
                {
                  featureType: 'poi.park',
                  elementType: 'geometry',
                  stylers: [{color: '#263c3f'}]
                },
                {
                  featureType: 'poi.park',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#6b9a76'}]
                },
                {
                  featureType: 'road',
                  elementType: 'geometry',
                  stylers: [{color: '#38414e'}]
                },
                {
                  featureType: 'road',
                  elementType: 'geometry.stroke',
                  stylers: [{color: '#212a37'}]
                },
                {
                  featureType: 'road',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#9ca5b3'}]
                },
                {
                  featureType: 'road.highway',
                  elementType: 'geometry',
                  stylers: [{color: '#746855'}]
                },
                {
                  featureType: 'road.highway',
                  elementType: 'geometry.stroke',
                  stylers: [{color: '#1f2835'}]
                },
                {
                  featureType: 'road.highway',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#f3d19c'}]
                },
                {
                  featureType: 'transit',
                  elementType: 'geometry',
                  stylers: [{color: '#2f3948'}]
                },
                {
                  featureType: 'transit.station',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#d59563'}]
                },
                {
                  featureType: 'water',
                  elementType: 'geometry',
                  stylers: [{color: '#17263c'}]
                },
                {
                  featureType: 'water',
                  elementType: 'labels.text.fill',
                  stylers: [{color: '#515c6d'}]
                },
                {
                  featureType: 'water',
                  elementType: 'labels.text.stroke',
                  stylers: [{color: '#17263c'}]
                }
              ]
            });
            var marker = new google.maps.Marker({
              position: this.position,
              map: map
            });
          }
            }
        });
    });
</script>
