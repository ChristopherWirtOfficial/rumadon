//Event variables
var renderInterval;

//Static variables
var currentTileX;
var currentTileY;
var currentTileLeft;
var currentTileTop;
var previousRowTileLeft;
var previousRowTileTop;

//Dynamic variables - these come from DB
var totalTilesX;
var totalTilesY;
var mapType;

/*
	Setting these sets where drawing starts
	We want to give it some space to show the whole map to the left
	So we calculate it based on how many tiles extend left from the center,
	on each render
*/
var startTileLeft	= 0;
var startTileTop	= 0;

//The function that initialises rendering
function renderMap() {
	//Let's clear any existing render processing
	window.clearInterval(renderInterval);

	//Set the loading status text
	$("#loadingStep").html('Rendering Map...');
	$("#loadingPercent").html('0%');

	//Show the loading screen, hide the map
	$("#map").stop().fadeOut(350);
	$("#loading-display").stop().fadeIn(350);

	//Figure out how far over to start. See above
	startTileLeft = Math.ceil(totalTilesX/2)*tileWidth*2;
	startTileTop = startTileLeft;

	//And set the variables back to default
	currentTileX		= 0;
	currentTileY		= 0;
	currentTileLeft		= startTileLeft;
	currentTileTop		= startTileTop;
	previousRowTileLeft	= currentTileLeft;
	previousRowTileTop	= currentTileTop;

	//Then start rendering
	renderInterval = window.setInterval(renderStep, 2);
}

//This function performs each render step - the function is looped
function renderStep() {
	if(!tileCoords[currentTileY]) {
		tileCoords[currentTileY] = new Array();
	}

	//Check we're not done on all Y rows
	if(currentTileY < totalTilesY) {
		//Check we're not done with this X row
		if(currentTileX < totalTilesX) {
			//Set the tile type to the map type by default
			var tileType = mapType;
			//Check if there's a tile on this position
			if(tiles[currentTileY]) {
				if(tiles[currentTileY][currentTileX]) {
					tileType = tiles[currentTileY][currentTileX].type;
				}
			}
			
			var thisCoord = new Array();
			thisCoord['left'] = currentTileLeft;
			thisCoord['top'] = currentTileTop;
			tileCoords[currentTileY][currentTileX] = thisCoord;
			
			//Add the tile in the map
			$("#map").append('<div class="tile ' + tileType + '" style="left:' + currentTileLeft + '; top: ' + currentTileTop + '"></div>');
			
			$("#map .tile:last-child").attr("xpos", currentTileX);
			$("#map .tile:last-child").attr("ypos", currentTileY);
			
			//Check if there's a player on this position
			if(playerCoords[currentTileY]) {
				if(playerCoords[currentTileY][currentTileX] && playerCoords[currentTileY][currentTileX].length > 0) {
					var playersHere = playerCoords[currentTileY][currentTileX];
					
					//Loop through players here
					for(var i = 0; i < playersHere.length; i++) {
						var playerHere = players[playersHere[i]];
						
						//Draw the player
						var playerLeft = (currentTileLeft + (tileWidth/2)) - (playerWidth/2);
						var playerTop = (currentTileTop + (tileHeight/2)) - playerHeight;
						$("#map").append('<div id="player_' + playerHere.username + '" class="player ' + playerHere.sprite + '_' + playerHere.direction + '" style="left:' + playerLeft + 'px; top: ' + playerTop + 'px"><div class="player-title">' + playerHere.username + '</div></div>');
						playerHere.left = playerLeft;
						playerHere.top = playerTop;
						playerHere.object = $("#player_" + playerHere.username);
					}
				}
			}

			//Increment pixel positions, etc
			currentTileX++;
			currentTileLeft += tileWidth/2;
			currentTileTop += tileHeight/2;
		} else {
			//We're done with the row. Back to start. Descend 1
			currentTileX = 0;
			currentTileY++;
			currentTileLeft		= previousRowTileLeft-(tileWidth/2);
			currentTileTop		= previousRowTileTop+(tileHeight/2);
			
			/*We set previous row left and top as this now
			Because we want to start the next row relative to this position*/
			previousRowTileLeft	= currentTileLeft;
			previousRowTileTop	= currentTileTop;

			//Update the loading %
			var tilesLoaded			= (currentTileY*totalTilesX)+currentTileX;
			var tilesTotal			= totalTilesX*totalTilesY;
			var loadedPercentage	= Math.floor(tilesLoaded*100/tilesTotal);
			$("#loadingPercent").html(loadedPercentage + "%");
		}
	} else {
		//We are done, clear the interval
		window.clearInterval(renderInterval);

		//Now hide the loading display and show the map
		$("#loading-display").stop().fadeOut(350);
		$("#map").stop().fadeIn(350);

		//And center the view on the player
		centerView(me.username);

		//And setup for player names on hover
		playerNames();

		//Start checking for new microactions repeatedly
		getMicroActions();

		//Init admin if the user is an admin
		if(me.user_level == 2) {
			initAdmin();
		}
	}
	
}