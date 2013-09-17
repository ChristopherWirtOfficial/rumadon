function keyCatch(keyEvent) {
	//If they pressed left
	if(keyEvent.keyCode == 37) {
		walkCharacter('left');
	}

	//If they pressed up
	if(keyEvent.keyCode == 38) {
		walkCharacter('up');
	}

	//If they pressed right
	if(keyEvent.keyCode == 39) {
		walkCharacter('right');
	}

	//If they pressed down
	if(keyEvent.keyCode == 40) {
		walkCharacter('down');
	}
}