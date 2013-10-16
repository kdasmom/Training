<?php

// Bootstrap
require_once("bootstrap.php");

$isAuth = $di['SecurityService']->isSessionAuthenticated();

if (!$isAuth) {
	echo 'Unauthorized access';
} else {
	// TODO: add some kind of additional security so people can't just load whatever image they want by ID
	try {
		$file = $di['ImageService']->getImagePath($_REQUEST['image_index_id']);
		if ($file === null || !file_exists($file)) {
			echo 'Invalid file';
		} else {
			$filename = explode('\\', $file);
			$filename = array_pop($filename);

			header('Content-type: application/pdf');
			header('Content-Disposition: inline; filename="' . $filename . '"');
			header('Content-Transfer-Encoding: binary');
			header('Content-Length: ' . filesize($file));
			header('Accept-Ranges: bytes');

			@readfile($file);
		}
	} catch (Exception $e) {
		echo 'Invalid file';
	}
}

?>