<template>
    <div class="" id="map"></div>
</template>
<style>
      #map {
        height: 100%;
      }
      #map {
             max-height: none;
      }
</style>

<script>
    define(["Vue", "vuex", 'google-map-api', 'axios', 'json!google_theme.json'], function(Vue, Vuex, googleMapAPI, axios, GoogleTheme) {
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
              styles: GoogleTheme
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
