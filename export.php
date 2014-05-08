<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 5/8/2014
 * Time: 2:20 PM
 */

// Bootstrap
require_once("bootstrap.php");

// If isRemote isn't defined, this is the first request coming in from the local server
if (!array_key_exists('isRemote', $_POST)) {
	$_POST['isRemote'] = 0;
}

// Deserialize some of the complex variables passed in
$extraParams = json_decode($_POST["extraParams"], true);
$options = [];


$di['ReportService']->showReport($_POST['report'], $_POST['format'], $options, $extraParams, $_POST['isRemote']);