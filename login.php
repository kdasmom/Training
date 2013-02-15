<?php

require_once("bootstrap.php");

$error = "";
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	$securityService = $di['SecurityService'];
	$loginUrl = $di['ConfigService']->get('PN.Main.LoginUrl');
	
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

$siteService = $di['SiteService'];
?>

<html>
<head>
	<title>NexusPayables Sign-on</title>
</head>
<body>

<?php

$customLoginPath = 'clients/'.$siteService->getAppName().'/login.php';
if (file_exists($__CONFIG['appRoot'].$customLoginPath)) {
	include $customLoginPath;
} else {
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
<?php } ?>

</body>
</html>