<?php
/**
 * THIS FILE CAN BE SETUP ON A REMOTE SERVER THAT HAS A LIMITED VERSION OF NEXUSPAYABLES INSTALLED
 * (ONLY THE MAIN PHP FRAMEWORK FILES ARE REQUIRED, NONE OF THE JS FILES) SO THAT A DEDICATED
 * REPORT SERVER CAN BE RUN INSTEAD OF RUNNING REPORTS LOCALLY
 */

// Bootstrap
require_once("bootstrap.php");

// If isRemote isn't defined, this is the first request coming in from the local server
if (!array_key_exists('isRemote', $_POST)) {
	$_POST['isRemote'] = 0;
}

// Deserialize some of the complex variables passed in
$options = json_decode($_POST["options"], true);
$extraParams = json_decode($_POST["extraParams"], true);

// Reconstitute PropertyContext object if it exists
if (array_key_exists('propertyContext', $options)) {
	$options['propertyContext'] = new \NP\property\PropertyContext(
		$options['propertyContext']['userprofile_id'],
		$options['propertyContext']['delegation_to_userprofile_id'],
		$options['propertyContext']['type'],
		$options['propertyContext']['selection'],
		$options['propertyContext']['property_status'],
		$options['propertyContext']['includeCodingOnly']
	);
}

// Reconstitute dateFrom object if it exists
if (array_key_exists('dateFrom', $options)) {
	$options['dateFrom'] = \DateTime::createFromFormat('Y-m-d H:i:s.u', $options['dateFrom'] . ' 00:00:00.000');
}

// Reconstitute dateTo object if it exists
if (array_key_exists('dateTo', $options)) {
	$options['dateTo'] = \DateTime::createFromFormat('Y-m-d H:i:s.u', $options['dateTo'] . ' 00:00:00.000');
}

// Call the function to show report, it'll take care of running it locally or calling
// the remote server based on settings in config file
$di['ReportService']->showReport($_POST['report'], $_POST['format'], $options, $extraParams, $_POST['isRemote']);
?>