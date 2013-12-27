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
			$errors = array($di['LocalizationService']->getMessage('authenticationFailedError'));
		}
	// If authentication failed, get the errors
	} else {
		$errors = $authenticator->getErrors();
	}
}

$customLogo = $di['ConfigService']->getCustomLogoName();
?>

<html>
<head>
    <meta charset="UTF-8">
    <title>NexusPayables Sign-on</title>
    <link rel="stylesheet" href="resources/login.css" />
</head>
<body>
	<table width="100%" height="100%" cellpadding="0" cellspacing="0">
	<tr id="header">
		<td width="99%"><img src="resources/images/payables-top.jpg" /></td>
		<td id="header-name">NexusSystems.com</td>
	</tr>
	<tr>
		<td id="toolbar" colspan="2"></td>
	</tr>
	<tr>
		<td colspan="2" align="center">
			<?php if (!empty($customLogo)) { ?>
				<div id="custom-logo-wrap">
					<img src="showClientLogo.php" />
				</div>
			<?php } ?>
			<div id="content-wrap">
				<div id="welcome-text" class="blue-text">Welcome to NexusPayables</div>
				<div id="login-field-container">
					<form action="login.php" method="post">
						<div id="login-text" class="blue-text">Please Log In:</div>
						<div>
							<input class="text-field" type="text" name="username" placeholder="Username" />
						</div>
						<div>
							<input class="text-field" type="password" name="pwd" placeholder="Password" />
						</div>
						<div>
							<input type="submit" value="Log In" />
						</div>
						<?php foreach ($errors as $error) { ?>
							<div style="color:red"><?= $error ?></div>
						<?php } ?>
					</form>
				</div>
			</div>
		</td>
	</tr>
	<tr>
		<td id="footer" colspan="2"	>
			<table width="100%" cellpadding="0" cellspacing="0">
			<tr>
				<td width="99%" id="footer-text">
					&copy; Nexus Systems &nbsp;&nbsp;&nbsp; Terms of Service
				</td>
				<td id="powered-by">
					<img src="resources/images/payables-powered-by.jpg" />
				</td>
			</tr>
			</table>
		</td>
	</tr>
	</table>
</body>
</html>