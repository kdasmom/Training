<?php

// Bootstrap
require_once("bootstrap.php");

$isAuth = $di['SecurityService']->isSessionAuthenticated();

if (!$isAuth) {
	$loginUrl = $di['ConfigService']->get('PN.Main.LoginUrl');
	header("Location: $loginUrl/login.php");
} else {
?>
<!DOCTYPE html>
<html>
<head>
	<title>NexusPayables</title>
	
	<link rel="stylesheet" type="text/css" href="vendor/extjs/resources/css/ext-all<?php echo ($__CONFIG['serverType'] == 'dev') ? '-debug' : ''; ?>.css" />
	<link rel="stylesheet" type="text/css" href="vendor/extjs/examples/ux/css/ItemSelector.css" />
	<link rel="stylesheet" type="text/css" href="resources/css/main.css" />
	<script type="text/javascript" src="vendor/extjs/ext-all<?php echo ($__CONFIG['serverType'] == 'dev') ? '-dev' : ''; ?>.js"></script>
	<script type="text/javascript" src="vendor/extjs/examples/ux/form/MultiSelect.js"></script>
	<script type="text/javascript" src="vendor/extjs/examples/ux/form/ItemSelector.js"></script>
	<script type="text/javascript" src="vendor/deftjs/deft<?php echo ($__CONFIG['serverType'] == 'dev') ? '-debug' : ''; ?>.js"></script>
	<script type="text/javascript" src="vendor/CryptoJS/sha1.js"></script>
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