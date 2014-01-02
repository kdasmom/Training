<?php

// Bootstrap
require_once("bootstrap.php");

$isAuth = $di['SecurityService']->isSessionAuthenticated();

if (!$isAuth) {
	echo 'Unauthorized access';
} else {
	// TODO: add some kind of additional security so people can't just load whatever image they want by ID
	$di['ImageService']->show($_REQUEST['image_index_id']);
}

?>