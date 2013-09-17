<?php
include('includes/core.php');

$login_error = '';

if(isset($_POST['do_login'])) {
	$username		= (isset($_POST['username'])) ? strtolower($_POST['username']) : '';
	$password		= (isset($_POST['password'])) ? $_POST['password'] : '';
	$password_md5	= md5($password);

	if(empty($username) || empty($password)) {
		$login_error = 'Please type your username and password';
	} else {
		$sql = 'SELECT id
					FROM users
						WHERE LOWER(username) = "' . $username . '"
							AND password = "' . $password_md5 . '"
								LIMIT 1';
		$valid_credentials_rs = mysql_query($sql);
		$valid_credentials = mysql_num_rows($valid_credentials_rs);

		if($valid_credentials) {
			$user_credentials = mysql_fetch_assoc($valid_credentials_rs);

			$new_session_key = md5(time());
			$_SESSION['username'] = $username;
			$_SESSION['password'] = $password_md5;
			$_SESSION['session_key'] = $new_session_key;

			$sql = 'UPDATE users
						SET session_key = "' . $new_session_key . '"
							WHERE id = ' . $user_credentials['id'] . '
								LIMIT 1';
			mysql_query($sql);

			header('location: index.php');
			exit(0);
		} else {
			$login_error = 'Invalid username and/or password';
		}
	}
}
?>
<html>
<head>
<title>Game</title>
<link rel="stylesheet" type="text/css" href="css/login.css" />
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="js/login.js"></script>
</head>
<body>
<div id="login-box">
	<h1>Login</h1>
	<form method="post" action="login.php" id="login-form">
		<div class="login-row">
			<div class="login-row-left">Username</div>
			<div class="login-row-right"><input type="text" name="username" id="username" /></div>
			<div class="spacer"> </div>
		</div>
		<div class="spacer"> </div>
		<div class="login-row">
			<div class="login-row-left">Password</div>
			<div class="login-row-right"><input type="password" name="password" id="password" /></div>
			<div class="spacer"> </div>
		</div>
		<div class="spacer"> </div>
		<div class="login-right">
			<input type="submit" value="Login" name="do_login" id="do_login" />
		</div>
	</form>
	<div class="spacer"> </div>
	&nbsp; &nbsp; <a href="#">Create New Account</a> &nbsp; &bull; &nbsp; <a href="#">Forgot Password?</a>
	<div id="login-error"><?php echo $login_error; ?></div>
</div>
</body>
</html>