//Admin variables
var activeAdminTool = 'Add';
var adminSelectedTile = 'grass';

function initAdmin() {
	//Prepare the selected tool - Add by default
	initAdminTool();

	//Switch for selecting tools
	$("#admin-add-tool, #admin-delete-tool").click(function() {
		//Make all the tools unbolded
		$("#admin-tool-panel a").css({fontWeight: 'normal'});
		//Make the active tool bold
		$(this).css({fontWeight: 'bold'});

		//Set the active tool variable
		activeAdminTool = $(this).html();

		//And initialize it
		initAdminTool();
	});

	//Setup the save button
	$("#admin-save").click(function() {
		if(confirm("Are you sure you wish to save? This can not be undone")) {
			//Save here
		}
	});
}

function initAdminTool() {
	//Setup red tile hovers for the tools
	$(".tile").hover(function() {
		$(this).append('<div class="tile selected-tile"></div>');
	}, function() {
		$(this).children('.selected-tile').remove();
	});

	//Check which tool is active
	switch(activeAdminTool) {
		case 'Add':
			//Show the tiles panel
			$("#admin-tile-panel").stop().fadeIn(200);
			$("#admin-panel").stop().animate({height: 140}, 300);
			
			//Initia2lize the add tool
			initAdminAddTool();
		break;
		case 'Delete':
			//Hide the tiles panel
			$("#admin-tile-panel").stop().fadeOut(200);
			$("#admin-panel").stop().animate({height: 50}, 300);
			
			//Initialize the delete tool
			initAdminDeleteTool();
		break;
	}
}

function initAdminAddTool() {
	//Hover effects for the tiles in the panel
	$("#admin-tile-panel img").hover(function() {
		$(this).stop().animate({opacity: 0.9}, 200);
	}, function() {
		$(this).stop().animate({opacity: 0.8}, 200);
	});

	//Code for selecting tiles in the panel
	$("#admin-tile-panel img").click(function() {
		$(".selected-admin-tile").removeClass('selected-admin-tile');
		$(this).addClass('selected-admin-tile');
		
		var tileType = $(this).attr("id").split('admin_tile_')[1];
		adminSelectedTile = tileType;
	});

	//Code to add/edit the tile
	$(".tile").click(function() {
		if(activeAdminTool == 'Add') {
			//Adds the tile
			var currentTile = $(this).attr("class").split(' ')[1];
			$(this).removeClass(currentTile).addClass(adminSelectedTile);
		}
	});	
}

function initAdminDeleteTool() {
	//Code to delete the tile
	$(".tile").click(function() {
		if(activeAdminTool == 'Delete') {
			//Doesn't actually remove, just sets to map default
			var currentTile = $(this).attr("class").split(' ')[1];
			$(this).removeClass(currentTile).addClass(mapType);
		}
	});
}