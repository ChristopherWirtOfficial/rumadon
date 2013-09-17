<?php
class player {
	var $actions;

	function __construct() {
		$actions = array('me', 'onmap', 'walk');

		//Check the action is valid to prevent hacking
		if(in_array($_GET['action'], $actions)) {
			eval('$this->' . $_GET['action'] . '();');
		}
	}
	
	function me() {
		global $me;

		//Output the current user's data
		echo json_encode(
			array(
				'id'			=> $me->id,
				'username'		=> $me->username,
				'user_level'	=> $me->user_level,
				'xpos'			=> $me->xpos,
				'ypos'			=> $me->ypos,
				'map'			=> $me->map,
				'sprite'		=> $me->sprite,
				'direction'		=> $me->direction
			)
		);
	}

	function onmap() {
		global $params, $me;
		
		//Get all players on the same map as me that aren't me
		$sql = 'SELECT id, username, xpos, ypos, map, sprite, direction
					FROM users
						WHERE map = ' . $params[0] . '
							AND id != ' . $me->id . '
								AND UNIX_TIMESTAMP(now())-UNIX_TIMESTAMP(lastactivity) <= 60';
		$players_onmap_rs = mysql_query($sql);
		
		//And put them in to an array
		$players_onmap = array();
		while($player_onmap = mysql_fetch_assoc($players_onmap_rs)) {
			$players_onmap[] = $player_onmap;
		}
		
		//and return it
		echo json_encode($players_onmap);
	}

	function walk() {
		global $params, $me;
		
		//Let's get the map details to check I don't walk off the edge
		$sql = 'SELECT width, height
					FROM maps
						WHERE id = ' . $me->map . '
							LIMIT 1';
		$map_rs = mysql_query($sql);
		$map = mysql_fetch_assoc($map_rs);
		
		//Now create the SQL to go in the right direction
		$direction_sql = '';
		
		switch($params[0]) {
			case 'left':
				//Make sure they don't walk off the edge
				if($me->xpos-1 < 0) {
					die(json_encode(array('success' => 0)));
				}
				
				$direction_sql = 'xpos = xpos-1, direction = "left"';
			break;
			case 'up':
				//Make sure they don't walk off the edge
				if($me->ypos-1 < 0) {
					die(json_encode(array('success' => 0)));
				}

				$direction_sql = 'ypos = ypos-1, direction = "up"';
			break;
			case 'right':
				//Make sure they don't walk off the edge
				if($me->xpos+1 > ($map['width']-1)) {
					die(json_encode(array('success' => 0)));
				}

				$direction_sql = 'xpos = xpos+1, direction = "right"';
			break;
			case 'down':
				//Make sure they don't walk off the edge
				if($me->ypos+1 > ($map['height']-1)) {
					die(json_encode(array('success' => 0)));
				}

				$direction_sql = 'ypos = ypos+1, direction = "down"';
			break;
		}

		//Now run the update SQL
		//Notice the timestampdiff to make sure there's 1 second between movements
		$sql = 'UPDATE users
					SET ' . $direction_sql . ',
						last_move = now()
							WHERE id = ' . $me->id . '
								AND TIMESTAMPDIFF(MICROSECOND, last_move, now()) > 50000
									 LIMIT 1';
		$move_query = mysql_query($sql);

		if(mysql_affected_rows() > 0) {
			echo json_encode(array('success' => 1));
			//Now add a row in micro_actions
			$sql = 'INSERT INTO micro_actions
						SET type = "move",
							subject = "' . $me->username . '",
								value = "' . $params[0] . '",
										action_time = ' . time();
			mysql_query($sql);
		} else {
			echo json_encode(array('success' => 0));
		}
	}
}
?>