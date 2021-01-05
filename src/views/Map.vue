<template>
	<div class="map">
		<div
			id="map"
			class="h-100"
		></div>
	</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import L from 'leaflet'
import Supercluster from 'supercluster'

let index: any = new Supercluster()
@Component({
	components: {},
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
		this.streetLightLayer.on('click', (e) => {
			// console.log(this)
			this.clickClusterToZoomIn(e)
		})
	}
	public getMaskData() {
		fetch('data/demo_points.geojson')
			.then((response) => {
				return response.json()
			})
			.then((jsonData) => {
				// console.log(jsonData)
				this.importDataToMap(jsonData)
				this.$store.dispatch('storeData', { data: jsonData })
			})
			.catch((error) => {
				console.log(error)
			})
	}
	public setLayer() {
		this.streetLightLayer = L.geoJson(null, {
			pointToLayer: function (feature, latlng) {
				if (!feature.properties.cluster) {
					const status: number = feature.properties.status
					let fillColor: string
					switch (status) {
						case 0:
							fillColor = 'green'
							break
						case 2:
							fillColor = 'orange'
							break
						case 4:
							fillColor = 'red'
							break
						default:
							fillColor = 'yellow'
							alert('Error on status')
							break
					}
					return L.circleMarker(latlng, {
						color: 'gray',
						fillColor: fillColor,
						fillOpacity: 1,
						weight: 2,
						radius: 10,
						stroke: true,
					}).bindTooltip(
						`ID:${feature.properties.id}</br>
						名稱:${feature.properties.display_name}</br>
						地址:${feature.properties.address}</br>
						電話:${feature.properties.phone}`
					)
				}
				const count = feature.properties.point_count
				const size = count < 100 ? 'small' : count < 1000 ? 'medium' : 'large'
				const icon = L.divIcon({
					html: '<div><span>' + feature.properties.point_count_abbreviated + '</span></div>',
					// html: '<div><span>' + feature.properties.point_count + '</span></div>',
					className: 'marker-cluster marker-cluster-' + size,
					iconSize: L.point(40, 40),
				})
				return L.marker(latlng, {
					icon: icon,
				})
			},
		})
	}
	public initMap() {
		this.map = L.map('map', {
			center: [23.505, 122.09],
			zoom: 8,
			layers: [this.streetLightLayer],
		})
		L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.map)
	}
	public importDataToMap(maskData) {
		console.log(maskData)
		index = new Supercluster({
			radius: 60,
			extent: 256,
			maxZoom: 15,
		}).load(maskData.geojson.features)
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
	public clickClusterToZoomIn(e) {
		let expansionZoom: number
		if (e.layer.feature.properties.cluster_id) {
			expansionZoom = index.getClusterExpansionZoom(e.layer.feature.properties.cluster_id)
			this.map.flyTo(e.latlng, expansionZoom) // flyTo(center_Lat&Lng, zoomLevel)
		}
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