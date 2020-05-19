<template>
    <div class="map">
        <div id="map" class="h-100"></div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import L from 'leaflet'
import Supercluster from 'supercluster'

let index: any = new Supercluster()
@Component({
    components: {}
})
export default class Map extends Vue {
    map: any = null
    streetLightLayer: any = L.geoJson(null)
    maskPoints: object = {}
    public created(): void {
        this.getMaskData()
        this.setLayer()
    }
    public mounted(): void {
        this.initMap()
        this.map.on('moveend', this.renderCluster)
    }
    public getMaskData() {
        fetch(
            'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR2qn9xVE2Bbh4RBP8gaoMCQYr3j9ZfV6-3T4AhpPCu3fMysTdze73Oh9aQ'
        )
            .then(response => {
                return response.json()
            })
            .then(jsonData => {
                console.log(jsonData)
                this.importDataToMap(jsonData)
            })
            .catch(error => {
                console.log(error)
            })
    }
    public setLayer() {
        this.streetLightLayer = L.geoJson(null, {
            pointToLayer: function(feature, latlng) {
                if (!feature.properties.cluster) {
                    return L.circleMarker(latlng, {
                        radius: 5,
                        stroke: true
                    }).bindTooltip(
                        `藥局名稱：${feature.properties.name}</br>
							TEL：${feature.properties.phone}</br>
							地址：${feature.properties.address}</br>
							成人口罩數量：${feature.properties.mask_adult}</br>
                            兒童口罩數量：${feature.properties.mask_child}</br>
							更新時間：${feature.properties.updated}`
                    )
                }
                const count = feature.properties.point_count
                const size = count < 100 ? 'small' : count < 1000 ? 'medium' : 'large'
                const icon = L.divIcon({
                    html: '<div><span>' + feature.properties.point_count_abbreviated + '</span></div>',
                    // html: '<div><span>' + feature.properties.point_count + '</span></div>',
                    className: 'marker-cluster marker-cluster-' + size,
                    iconSize: L.point(40, 40)
                })
                return L.marker(latlng, {
                    icon: icon
                })
            }
        })
    }
    public initMap() {
        this.map = L.map('map', {
            center: [23.505, 122.09],
            zoom: 8,
            layers: [this.streetLightLayer]
        })
        L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map)
    }
    public importDataToMap(maskData) {
        // console.log(maskData)
        index = new Supercluster({
            radius: 60,
            extent: 256,
            maxZoom: 15
        }).load(maskData.features)
        index = Object.freeze(index)
        this.renderCluster()
    }
    public renderCluster() {
        const bounds = this.map.getBounds()
        const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]
        const zoom = this.map.getZoom()
        const clusters = index.getClusters(bbox, zoom)
        this.streetLightLayer.clearLayers()
        this.streetLightLayer.addData(clusters)
    }
}
</script>
<style lang="scss">
@import '../../node_modules/leaflet/dist/leaflet.css';
@import './src/assets/plugins/supercluster.scss';
#map {
    // height: 100vh;
}
</style>