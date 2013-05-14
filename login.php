<?php

require_once("bootstrap.php");

$securityService = $di['SecurityService'];
$authenticator = $securityService->getAuthenticator();

$errors = array();

// If the authenticator says to not show login, move to authentication
if (!$authenticator->showLogin()) {
	if (array_key_exists('username', $_POST)) {
		$authenticator->setUsername($_POST['username']);
		$authenticator->setPassword($_POST['pwd']);
	}

	// Authenticate the user
	$success = $authenticator->authenticate();
	
	// If there were no errors, proceed
	if ($success) {
		// Log the user in
		$userprofile_id = $securityService->login($authenticator->getUsername());
		if ($userprofile_id) {
			// Get the URL to enter the app from configuration
			$loginUrl = $di['ConfigService']->get('PN.Main.LoginUrl');
			// Redirect to the NexusPayables home
			header("Location: $loginUrl") ;
			die;
		} else {
			$errors = array('Authentication failed');
		}
	// If authentication failed, get the errors
	} else {
		$errors = $authenticator->getErrors();
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
if (file_exists($__CONFIG['appRoot'] . $customLoginPath)) {
	include $customLoginPath;
} else {
	foreach ($errors as $error) { ?>
		<div style="color:red"><?= $error ?></div>
	<?php } ?>
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