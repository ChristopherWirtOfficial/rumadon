var players = new Array();
var playerCoords = new Array();
var me;

function getMyPlayer() {
	//Set the loading status text
	$("#loadingStep").html('Loading User...');
	$("#loadingPercent").html('0%');

	$.getJSON("actions/player/me", function(data) {
		//Set the loading status text
		$("#loadingPercent").html('100%');

		//Set some variables of myself
		me					= data;
		me.walking			= false;
		me.walkingStep		= 'still';
		me.walkingStepInt	= 1;
		me.xpos				= parseInt(me.xpos);
		me.ypos				= parseInt(me.ypos);

		//Set my coordinates in the array
		playerCoords[me.ypos] = new Array();
		playerCoords[me.ypos][me.xpos] = new Array();
		playerCoords[me.ypos][me.xpos].push(me.username);
		
		//Put myself in to the players array
		players[me.username] = me;

		//Now get the other players
		getPlayersOnMap();
	});
}

function getPlayersOnMap() {
	//Set the loading status text
	$("#loadingStep").html('Loading Other Players...');
	$("#loadingPercent").html('0%');

	$.getJSON("actions/player/onmap/" + me.map, function(data) {
		//Set the loading status text
		$("#loadingPercent").html('100%');
		
		//Loop through the players and put them in the players array
		$(data).each(function(i, item) {
			//Set some variables of myself
			item.walking		= false;
			item.walkingStep	= 'still';
			item.walkingStepInt	= 1;
			item.xpos			= parseInt(item.xpos);
			item.ypos			= parseInt(item.ypos);
			
			//Set my coordinates in the array
			if(!playerCoords[item.ypos]) {
				playerCoords[item.ypos] = new Array();
			}

			if(!playerCoords[item.ypos][item.xpos]) {
				playerCoords[item.ypos][item.xpos] = new Array();
			}

			playerCoords[item.ypos][item.xpos].push(item.username);
			
			//Put myself in to the players array
			players[item.username] = item;
		});
		
		//Now we can get the map and render it
		getCurrentMap();
	});
}