<?php
class player_obj {
	var $id;
	var $username;
	var $user_level;
	var $xpos;
	var $ypos;
	var $map;
	var $sprite;
	var $direction;

	function __construct() {
		$this->id			= 0;
		$this->username		= 'guest';
		$this->user_level	= 0;
		$this->xpos			= 0;
		$this->ypos			= 0;
		$this->map			= 1;
		$this->sprite		= 'human';
		$this->direction	= 'down';
	}

	function checkIsMe($require_login = false) {
		// Temporary - force logged in
		/*$_SESSION['username']		= 'daniel';
		$_SESSION['password']		= md5('Magma425');
		$_SESSION['session_key']	= 'force_session';*/

		if(isset($_SESSION['username']) && isset($_SESSION['password']) && isset($_SESSION['session_key'])) {
			$username		= $_SESSION['username'];
			$password		= $_SESSION['password'];
			$session_key	= $_SESSION['session_key'];
	
			$sql = 'SELECT id, username, user_level, xpos, ypos, map, sprite, direction
						FROM users
							WHERE username = "' . $username . '"
								AND password = "' . $password . '"
									AND session_key = "' . $session_key . '"
										LIMIT 1';
			$player_rs = mysql_query($sql);
			$player_exists = mysql_num_rows($player_rs);
	
			if($player_exists) {
				$player_data = mysql_fetch_assoc($player_rs);
				$this->id			= $player_data['id'];
				$this->username		= $player_data['username'];
				$this->user_level	= $player_data['user_level'];
				$this->xpos			= $player_data['xpos'];
				$this->ypos			= $player_data['ypos'];
				$this->map			= $player_data['map'];
				$this->sprite		= $player_data['sprite'];
				$this->direction	= $player_data['direction'];
				return true;
			}
		}

		if($require_login) {
			header('location: login.php');
			exit(0);
		}
	}
}
?>