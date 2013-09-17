var lastMicroActionID = 0;

function getMicroActions() {
	//Check with the server for actions since last check
	$.getJSON("actions/microactions/get/" + lastMicroActionID, function(data) {
		//Use the new returned time as the new check time
		lastMicroActionID = data.new_id;

		//Loop through the actions. See what's up
		$(data.actions).each(function(i, item) {
			switch(item.type) {
				case 'move':
					//If it's move, then process it with the move function
					microActionMove(item);
				break;
				case 'online':
					//If it's somebody coming online, process it
					microActionOnline(item);
				break;
				case 'offline':
					//If it's somebody going offline, process it
					microActionOffline(item);
				break;
			}
		});

		setTimeout('getMicroActions()', 100);
	});
}

function microActionMove(item) {
	walkCharacter(item.value, item.subject, true);
}

function microActionOnline(item) {
	//
}