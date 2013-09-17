var tiles = new Array();
var tileCoords = new Array();

function getCurrentMap() {
	//Set the loading status text
	$("#loadingStep").html('Loading Map...');
	$("#loadingPercent").html('0%');

	$.getJSON("actions/map/get/" + me.map, function(data) {
		//Set the loading status text
		$("#loadingStep").html('Loading Map...');
		$("#loadingPercent").html('50%');

		var map = data;

		//Set the variables for rendering
		totalTilesX = map.width;
		totalTilesY	= map.height;
		mapType		= map.terrain;

		//Now get the tiles on this map
		$.getJSON("actions/map/getTiles/" + me.map, function(data) {
			$("#loadingStep").html('Loading Map...');
			$("#loadingPercent").html('50%');
			
			var tilesArray = data.tiles;
			
			$(tilesArray).each(function(i, item) {
				if(! tiles[item.ypos]) {
					tiles[item.ypos] = new Array();
				}
				tiles[item.ypos][item.xpos] = item;
			});
			
			//Now we're ready to start the map rendering
			renderMap();
		});
	});
}