<?php

require_once("bootstrap.php");

$error = "";
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	$securityService = $di->get("NP\system\SecurityService");
	$loginUrl = $di->get("NP\\system\\ConfigService")->get('PN.Main.LoginUrl');
	
	// Attempt authentication
	$userprofile_id = $securityService->login($_POST["username"], $_POST["pwd"]);
	
	// Check if authentication succeeded (userprofile_id is not zero), log the user in and redirect to home page
	if ($userprofile_id) {
		header("Location: $loginUrl") ;
		die;
	// If authentication fails, set error message
	} else {
		$error = "Authentication failed";
	}
}

echo $error;
?>

<form action="login.php" method="post">
	<div>
		<label>Username:</label>
		<input type="text" name="username" value="" />
	</div>
	<div>
		<label>Password:</label>
		<input type="password" name="pwd" />
	</div>
	<div>
		<input type="submit" value="Login" />
	</div>
</form>