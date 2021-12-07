<template>
  <GmapMap
    ref="mapRef"
    :center="{ lat: 16.047079, lng: 108.20623 }"
    :zoom="zoom"
    map-type-id="roadmap"
    style="width: 100%; height: 700px;"
  >
    <GmapMarker
      v-for="(m, index) in markers"
      :key="index"
      :position="m"
      :clickable="true"
      :draggable="true"
      @click="center = m"
    />
  </GmapMap>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
export default {
  name: 'GoogleMap',
  props: {
    location: {
      type: String,
      default: 'Việt Nam',
    },
    zoom: {
      type: Number,
      default: 15,
    },
  },
  data() {
    return {
      markers: [],
    }
  },
  computed: {
    google: gmapApi,
  },
  mounted() {
    this.$refs.mapRef.$mapPromise.then((map) => {
      const request = {
        query: this.location,
        fields: ['name', 'geometry'],
      }

      const service = new this.google.maps.places.PlacesService(map)
      service.findPlaceFromQuery(request, (results, status) => {
        if (
          status === this.google.maps.places.PlacesServiceStatus.OK &&
          results
        ) {
          this.markers = results.map((result) => result.geometry.location)
          map.setCenter(results[0].geometry.location)
        }
      })
    })
  },
}
</script>
