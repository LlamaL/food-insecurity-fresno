var map = L.map('map');

L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=69738c0286394cfdbd18f802963f7e8a', {
	maxZoom: 22
})
  .addTo(map);

map.setView([36.73, -119.78], 12);
