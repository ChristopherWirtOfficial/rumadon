<?php
session_start();

include('includes/config.php');
include('classes/database.class.php');
include('classes/player_obj.class.php');

$database = new Database();
$database->server	= $config['db']['server'];
$database->username	= $config['db']['username'];
$database->password	= $config['db']['password'];
$database->name		= $config['db']['name'];

$database->connect();

if(!isset($require_login)) {
	$require_login = false;
}

$me = new player_obj();
$me->checkIsMe($require_login);

?>