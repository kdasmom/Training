<?php

// Bootstrap
require_once("bootstrap.php");

$isAuth = $di['SecurityService']->isSessionAuthenticated();

if (!$isAuth) {
    $loginUrl = rtrim($di['ConfigService']->get('PN.Main.LoginUrl'), '/');
    header("Location: $loginUrl/login.php");
} else {
?>
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>NexusPayables</title>
    <!-- <x-compile> -->
        <!-- <x-bootstrap> -->
            <link rel="stylesheet" href="ext/packages/ext-theme-classic/build/resources/ext-theme-classic-all-debug.css" />
            <link rel="stylesheet" href="resources/VerticalTabPanel.css" />
            <link rel="stylesheet" href="resources/app.css" />
            <link rel="stylesheet" href="resources/uploader.css" />
            <link rel="stylesheet" href="vendor/jquery-uploadify/uploadify.css" />
            <link rel="stylesheet" href="vendor/jquery-uploadifive/uploadifive.css" />
            <script src="ext/ext-dev.js"></script>
            <script src="bootstrap.js"></script>
        <!-- </x-bootstrap> -->

        <script src="vendor/jquery/jquery-2.0.3.min.js"></script>
        <script src="vendor/jquery-uploadify/jquery.uploadify.min.js"></script>
        <script src="vendor/jquery-uploadifive/jquery.uploadifive.min.js"></script>
        <script src="vendor/CryptoJS/sha1.js"></script>
        <script src="app.js"></script>
    <!-- </x-compile> -->
</head>
<body>
    <div id="loading-app">
        <img src="resources/images/login_loader_logo.gif" /><br />
        Loading...
    </div>
</body>
</html>

<?php } ?>