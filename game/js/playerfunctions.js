function playerNames() {
	$(".player").hover(function() {
		$(this).children(".player-title").stop().fadeIn(300);
	}, function() {
		$(this).children(".player-title").stop().fadeOut(300);
	});
}

function centerView(playerUsername, doAnimation) {
	//Get the player's left/top offset
	var player_obj = $("#player_" + playerUsername);
	var playerOffsetLeft = parseInt(player_obj.css("left"));
	var playerOffsetTop = parseInt(player_obj.css("top"));

	//Then figure out where center on is
	var centerOffsetLeft = playerOffsetLeft - (viewportWidth/2) + (playerWidth/2);
	var centerOffsetTop = playerOffsetTop - (viewportHeight/2) + (playerHeight/2);
	
	if(doAnimation) {
		$("#contain-map").stop().animate({scrollLeft: centerOffsetLeft, scrollTop: centerOffsetTop}, 1);
	} else {
		//and scroll the view to there
		$("#contain-map").scrollLeft(centerOffsetLeft);
		$("#contain-map").scrollTop(centerOffsetTop);
	}
}

function walkCharacter(direction, username, doQueuing) {
	//If a username isn't specified, it's the current user
	if(!username) {
		username = me.username;
	}

	//Get the player object
	var playerObj = players[username];

	//Check the character isn't already walking
	if(playerObj.walking == true) {
		if(doQueuing) {
			setTimeout('walkCharacter("' + direction + '", "' + username + '", true)', 10);
		}
		return;
	}

	switch(direction) {
		case 'left':
			if(playerObj.xpos-1 < 0) {
				return;
			}
		break;
		case 'up':
			if(playerObj.ypos-1 < 0) {
				return;
			}
		break;
		case 'right':
			if((playerObj.xpos+1) > (totalTilesX-1)) {
				return;
			}
		break;
		case 'down':
			if((playerObj.ypos+1) > (totalTilesY-1)) {
				return;
			}
		break;
	}

	playerObj.walking = true;
	playerObj.walkingStepInt = 1;

	//Switch the direction and direction sprite
	playerObj.object.removeClass(playerObj.sprite + '_' + playerObj.direction);
	playerObj.direction = direction;
	playerObj.object.addClass(playerObj.sprite + '_' + playerObj.direction);

	//If it's yourself walking...
	if(username == me.username) {
		//Then update the server on where we're at
		$.getJSON('actions/player/walk/' + playerObj.direction, function(data) {
			if(data.success) {
				//success
			} else {
				alert('Something went wrong. The game will now reload.');
				window.location.href = window.location.href;
			}
		});
	}

	//Start the walking move/animation loop
	playerObj.walkingInterval = window.setInterval('walkCharacterStep("' + username + '")', 150);
}

function walkCharacterStep(username) {
	//$("#updatelog").append('Move step<br />');

	//Get the player object
	var playerObj = players[username];

	//Get the current left and top
	var currentLeft	= playerObj.left;
	var currentTop	= playerObj.top;

	//Get the new left/top by the direction
	switch(playerObj.direction) {
		case 'left':
			newLeft = currentLeft-(tileWidth/16);
			newTop = currentTop-(tileHeight/16);
		break;
		case 'up':
			newLeft = currentLeft+(tileWidth/16);
			newTop = currentTop-(tileHeight/16);
		break;
		case 'right':
			newLeft = currentLeft+(tileWidth/16);
			newTop = currentTop+(tileHeight/16);
		break;
		case 'down':
			newLeft = currentLeft-(tileWidth/16);
			newTop = currentTop+(tileHeight/16);
		break;
	}

	//Set the new left/top vars
	playerObj.left	= newLeft;
	playerObj.top	= newTop;

	//Animate to the new left and top
	playerObj.object.animate({left: newLeft, top: newTop}, 150, function() {
		if(username == me.username) {
			//Center the view
			centerView(username, true);
		}

		//Increment the step number
		playerObj.walkingStepInt++;

		//There are 9 animation/movement steps to a step
		if(playerObj.walkingStepInt == 8) {
			//Clear the walking intervals
			window.clearInterval(playerObj.walkingInterval);

			if(playerObj.walkingStep != 'still' && playerObj.walkingStep != 'still2') {
				//Set the class prefix
				var classPrefix = (playerObj.walkingStep == 'still' || playerObj.walkingStep == 'still2') ? '' : '_' + playerObj.walkingStep;
	
				//Reset it to still sprite
				playerObj.object.removeClass(playerObj.sprite + '_' + playerObj.direction + classPrefix);
				playerObj.object.addClass(playerObj.sprite + '_' + playerObj.direction);

				playerObj.walkingStep = 'still';
			}
			
			//set the xpos/ypos
			switch(playerObj.direction) {
				case 'left':
					playerObj.xpos = playerObj.xpos-1;
				break;
				case 'up':
					playerObj.ypos = playerObj.ypos-1;
				break;
				case 'right':
					playerObj.xpos = playerObj.xpos+1;
				break;
				case 'down':
					playerObj.ypos = playerObj.ypos+1;
				break;
			}

			//And reset the status so he can walk again
			playerObj.walking = false;
		}
	});

	//Set the class prefix
	var classPrefix = (playerObj.walkingStep == 'still' || playerObj.walkingStep == 'still2') ? '' : '_' + playerObj.walkingStep;
	
	//Remove the old class
	playerObj.object.removeClass(playerObj.sprite + '_' + playerObj.direction + classPrefix); 
	
	//Toggle the walking steps
	playerObj.walkingStep = (playerObj.walkingStep == 'still') ? 'forward' : (playerObj.walkingStep == 'forward') ? 'still2' : ((playerObj.walkingStep == 'still2') ? 'back' : ((playerObj.walkingStep == 'back') ? 'still' : playerObj.walkingStep));

	//Set the class prefix
	var classPrefix = (playerObj.walkingStep == 'still' || playerObj.walkingStep == 'still2') ? '' : '_' + playerObj.walkingStep;
	
	//Add the class
	playerObj.object.addClass(playerObj.sprite + '_' + playerObj.direction + classPrefix);
	
	if(username == me.username) {
		//Center the view
		centerView(username, true);
	}
}