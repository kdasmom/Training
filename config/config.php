<?php

$__CONFIG = array(
	// Application root path
	'appRoot'			=> 'c:\\wwwroot\\NexusPayablesPHP\\',
	// Datasource configuration parameters
	'datasource'		=> array(
		    'driver'		=> 'Sqlsrv',
		    'hostname'		=> 'localhost\SQLEXPRESS',
		    //'database'		=> 'simpson', // NOTE: di_config.php sets the correct DB
		    'username'		=> 'sa',
		    'password'		=> 'romario'
	),
	/*
	 * These are the configs if using PDO driver
	
	'datasource'		=> array(
		    'driver'		=> 'Pdo=Pdo_Sqlsrv',
		    'dsn'			=> 'sqlsrv:server=localhost\SQLEXPRESS;database=', // NOTE: di_config.php appends the correct DB to this
		    'username'		=> 'sa',
		    'password'		=> 'romario'
	),
	*/
	// The length of a user session in minutes
	'sessionDuration'	=> 480,
	
	// Set logs that are enabled
	// Valid values are 'global','mail','fileupload','catalog','invoice','po'
	'enabledNamespaces'		=> array('global','mail','fileupload','catalog','invoice','po'),
	'fileLogEnabled'		=> false, 
	'debugLogEnabled'		=> true,
);

$__CONFIG['logPath']		= $__CONFIG['appRoot'] . 'logs';

?>