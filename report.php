<?php
// Bootstrap
require_once("bootstrap.php");

$params = json_decode($_POST["params"]);
$queryParams = json_decode($_POST["queryParams"]);

$di['ReportService']->generateReport($_POST['report'], $_POST['format'], $params, $queryParams);
?>