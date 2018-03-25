var map = L.map('map');

L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=69738c0286394cfdbd18f802963f7e8a', {
	maxZoom: 22
})
  .addTo(map);

map.setView([36.78, -119.78], 12);

for (var num = 0; num < store.length; num++) {
	var stores = store[num];
	var store_lat = stores["Lat"];
	var store_lng = stores["Lng"];
	var store_name = stores["name"];
	var marker = L.circleMarker([store_lat, store_lng], {
		stroke: false,
		radius: 6,
		fillOpacity: 0.6,
	})
	   .addTo(map)
		 .bindTooltip(store_name);
}

for (var num = 0; num < liquor.length; num++) {
	var liquors = liquor[num];
	var liquor_lat = liquors["Lat"];
	var liquor_lng = liquors["Lng"];
	var liquor_name = liquors["name"];
	var marker = L.circleMarker([liquor_lat, liquor_lng], {
		stroke: false,
		radius: 6,
		fillOpacity: 0.6,
		fillColor: "red",
	})
	   .addTo(map)
		 .bindTooltip(liquor_name);
}
