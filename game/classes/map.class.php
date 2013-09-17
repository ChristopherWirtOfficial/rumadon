<?php
class map {
	var $actions;

	function __construct() {
		$actions = array('get', 'getTiles');

		//Check the action is valid to prevent hacking
		if(in_array($_GET['action'], $actions)) {
			eval('$this->' . $_GET['action'] . '();');
		}
	}
	
	function get() {
		global $params;
		
		//Map_ID param comes from /map/get/MAP_ID. First param
		$map_id = $params[0];
		
		//Get the map
		$sql = 'SELECT id, width, height, terrain
					FROM maps
						WHERE id = ' . $map_id . '
							LIMIT 1';
		$maps_rs = mysql_query($sql);
		$valid_map = mysql_num_rows($maps_rs);
		
		//Check the map exists
		if($valid_map) {
			//Then return the details of it
			$map_data = mysql_fetch_assoc($maps_rs);
			echo json_encode(
				array(
					'id'		=> $map_data['id'],
					'width'		=> $map_data['width'],
					'height'	=> $map_data['height'],
					'terrain'	=> $map_data['terrain']
				)
			);
		}
	}

	function getTiles() {
		global $params, $me;
		
		//Map_ID param comes from /map/get/MAP_ID. First param
		$map_id = $params[0];
		
		if($map_id != $me->map) {
			die(json_encode(
				array(
					'success' => false,
					'tiles' => array()
				)
			));
		}
		
		//Get the tiles
		$sql = 'SELECT id, xpos, ypos, map, type
					FROM tiles
						WHERE map = ' . $map_id;
		$tiles_rs = mysql_query($sql);
		
		$tiles = array();
		
		//Loop through and put them in to an array
		while($tile = mysql_fetch_assoc($tiles_rs)) {
			$tiles[] = $tile;
		}
		
		//Now output ut
		echo json_encode(
			array(
				'success' => true,
				'tiles' => $tiles
			)
		);
	}
}
?>