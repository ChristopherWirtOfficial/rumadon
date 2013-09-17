<?php
class microactions {
	var $actions;

	function __construct() {
		$actions = array('get');

		//Check the action is valid to prevent hacking
		if(in_array($_GET['action'], $actions)) {
			eval('$this->' . $_GET['action'] . '();');
		}
	}
	
	function get() {
		global $params, $me;

		$sql = 'UPDATE users
					SET lastactivity = now()
						WHERE id = ' . $me->id . '
							LIMIT 1';
		mysql_query($sql);
		
		$last_update = (int)$params[0];

		if($last_update == 0) {
			$sql = 'SELECT id
						FROM micro_actions
							ORDER BY id DESC
								LIMIT 1';
			$new_id_rs = mysql_query($sql);
			$new_id = mysql_fetch_assoc($new_id_rs);
			
			die(json_encode(array(
				'actions'	=> array(),
				'new_id'	=> $new_id['id']
			)));
		} else {
			$sql = 'SELECT id, type, subject, value
						FROM micro_actions
							WHERE id > ' . $last_update . '
								AND subject != "' . $me->username . '"
									ORDER BY id ASC';
			$microactions_rs = mysql_query($sql);

			$actions = array();
			while($microaction = mysql_fetch_assoc($microactions_rs)) {
				$actions[] = $microaction;
			}

			$sql = 'SELECT id
						FROM micro_actions
							ORDER BY id DESC
								LIMIT 1';
			$new_id_rs = mysql_query($sql);
			$new_id = mysql_fetch_assoc($new_id_rs);
			
			die(json_encode(array(
				'actions'	=> $actions,
				'new_id'	=> $new_id['id']
			)));
		}
	}
}
?>