<?php

// Bootstrap
require_once("bootstrap.php");

$isAuth = $di->get("NP\\system\\SecurityService")->isSessionAuthenticated();

if (!$isAuth) {
	$loginUrl = $di->get("NP\\system\\ConfigService")->get('PN.Main.LoginUrl');
	header("Location: $loginUrl/login.php");
} else {
?>
<!DOCTYPE html>
<html>
<head>
	<title>NexusPayables</title>
	
	<link rel="stylesheet" type="text/css" href="js/extjs/resources/css/ext-all.css">
	<script type="text/javascript" src="js/extjs/ext-all-dev.js"></script>
	<script type="text/javascript" src="js/deftjs/deft-debug.js"></script>
	<script type="text/javascript" src="js/CryptoJS/sha3.js"></script>
	<script type="text/javascript" src="app/Application.js"></script>
</head>
<body>
	
	<!-- Fields required for history management -->
	<form id="history-form" class="x-hide-display">
		<input type="hidden" id="x-history-field" />
		<iframe id="x-history-frame"></iframe>
	</form>
	
</body>
</html>

<?php } ?>