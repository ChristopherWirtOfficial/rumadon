<?php
$require_login = true;
include('includes/core.php');

if(in_array($_GET['controller'], $config['controllers'])) {
	$params = explode('/', $_GET['params']);
	
	include('classes/' . $_GET['controller'] . '.class.php');
	eval('$' . $_GET['controller'] . ' = new ' . $_GET['controller'] . '();');
} else {
	echo json_encode(array('success' => true, 'params' => print_r($_POST, true)));
}
?>