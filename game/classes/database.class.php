<?php
class Database {
	var $server;
	var $username;
	var $password;
	var $name;

	function __construct() {
		$this->server	= 'localhost';
		$this->username	= 'root';
		$this->password	= '';
		$this->name		= 'game';
	}

	function connect() {
		@mysql_connect($this->server, $this->username, $this->password) or die('Unable to connect to the Database server.');
		@mysql_select_db($this->name) or die('Could not select the Database.');
	}
}
?>
