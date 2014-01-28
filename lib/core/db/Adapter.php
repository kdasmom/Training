<?php
namespace NP\core\db;

use NP\system\LoggingService;

/**
 * Database adapter class
 *
 * This class is used to abstract out database operations. Should we want to change databases, modifying
 * the functions in this class is all that will be needed to properly connect to and query the database 
 * (though changes to other classes may be needed to generate proper SQL).
 *
 * @author Thomas Messier
 */
class Adapter {
	/**
	 * @var resource
	 */
	protected $conn = null;

	/**
	 * @var string
	 */
	protected $server;
	
	/**
	 * @var string
	 */
	protected $dbName;
	
	/**
	 * @var string
	 */
	protected $username;
	
	/**
	 * @var string
	 */
	protected $pwd;
	
	/**
	 * @var array
	 */
	protected $options;

	/**
	 * @var int
	 */
	protected $transactionLevel = 0;

	/**
	 * @var int
	 */
	protected $lastInsertId = null;

	protected $loggingService;

	/**
	 * @param $server   string Server address
	 * @param $dbName   string Name of the database
	 * @param $username string Username to connect to database
	 * @param $pwd      string Password to connect to database
	 * @param $options  array  Additional connection options
	 */
	public function __construct($server, $dbName, $username, $pwd, $options=array()) {
		$this->server   = $server;
		$this->dbName   = $dbName;
		$this->username = $username;
		$this->pwd      = $pwd;
		$this->options  = $options;
	}

	public function setLoggingService(\NP\system\LoggingService $loggingService) {
		$this->loggingService = $loggingService;
	}

	/**
	 * Connects to the database
	 */
	public function connect() {
		// Only try to connect if a connection hasn't been established yet
		if ($this->conn === null) {
			// Set error mode to make sure errors throw exceptions
			sqlsrv_configure('WarningsReturnAsErrors', 1);

			// Try to connect
			$connectionInfo = array('Database'=>$this->dbName, 'UID'=>$this->username, 'PWD'=>$this->pwd, 'ReturnDatesAsStrings'=>true, 'CharacterSet'=>'UTF-8');
			$this->conn = sqlsrv_connect($this->server, $connectionInfo);

			if (!$this->conn) {
				$errors = sqlsrv_errors();
				$message = "Error connecting to database. Errors were the following:";
				foreach ($errors as $error) {
					$message .= "\n\nSQLSTATE: {$error['SQLSTATE']}\ncode: {$error['code']}\nmessage: {$error['message']}";
				}
				throw new \NP\core\Exception($message);
				die;
			}
		}
	}

	/**
	 * Run a query
	 *
	 * @param  $sql    string|NP\core\db\SQLInterface The SQL query to run
	 * @param  $params array                          The named or positional parameters for the query (optional)
	 * @return 
	 */
	public function query($sql, $params=array()) {
		// Make sure there's a connection to DB
		$this->connect();

		// If $sql is an object, convert it to a string
		if ($sql instanceOf SQLInterface) {
			$sql = $sql->toString();
		}

		$sql = trim($sql);
		$beginSql = strtolower(substr(trim($sql), 0, 6));

		// If dealing with an insert statement, append SCOPE_IDENTITY QUERY at the end
		if ($beginSql == 'insert') {
			$sql .= ';SELECT SCOPE_IDENTITY() AS last_id;';
		}

		// Log SQL queries
		$this->loggingService->log('sql', $sql, array('sql'=>$sql, 'params'=>$params));

		// Create the SQL statement and execute it
		$stmt = sqlsrv_query($this->conn, $sql, $params);
		if (!$stmt) {
			$errors = sqlsrv_errors();
			$paramStr = (count($params)) ? implode('|', $params) : '<none>';
			$message = "Error running query. SQL was the following:\n\n{$sql};\n\nParameters were the following: {$paramStr};\n\nError was the following:";
			foreach ($errors as $error) {
				$message .= "\n\nSQLSTATE: {$error['SQLSTATE']};\ncode: {$error['code']};\nmessage: {$error['message']}";
			}
			throw new \NP\core\Exception($message);
			die;
		}
		
		// This array will store all the results
		$results = [];
		do {
			// Check the metadata on the statement
			$meta = sqlsrv_field_metadata($stmt);
			// If there's metadata (fields), it means it's a select statement, so we can get the data
			if (count($meta)) {
				// Fetch and return as an associative array
				$res = [];
				while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
					$res[] = $row;
				}
				// Add the data to the global result set
				$results[] = $res;
			}
		} while(sqlsrv_next_result($stmt)); // Fetch the next result
		
		// If dealing with a single insert statement, we need to do something different to capture the
		// ID of the record inserted
		if ($beginSql == 'insert') {
			$this->lastInsertId = $results[0][0]['last_id'];
			return true;
		}

		// If we have only one result set, pop it out of the result set and return it
		if (count($results) === 1) {
			return $results[0];
		// If we have multiple result sets, return them all in the main array
		} else if (count($results) > 1) {
			return $results;
		}

		// If we had no result sets to return, just return true (for insert/update/delete)
		return true;
	}

	/**
	 * Return the last inserted ID
	 *
	 * @return int
	 */
	public function lastInsertId() {
		return $this->lastInsertId;
	}

	/**
	 * Return the current ID for a table (the next insert ID)
	 *
	 * @return int
	 */
	public function currentId($table) {
		$rec = $this->query("SELECT IDENT_CURRENT('{$table}') as current_id");
		
		return $rec[0]['current_id'];
	}

	/**
	 * Initiate a transaction
	 */
	public function beginTransaction() {
		// Make sure there's a connection to DB
		$this->connect();
		
		if ($this->transactionLevel == 0) {
			sqlsrv_begin_transaction($this->conn);
		}
		$this->transactionLevel++;
	}

	/**
	 * Check if a transaction has been started
	 *
	 * @return boolean
	 */
	public function inTransaction() {
		// Make sure there's a connection to DB
		$this->connect();
		
		return ($this->transactionLevel) ? true : false;
	}

	/**
	 * Commit a transaction
	 */
	public function commit() {
		if ($this->transactionLevel == 1) {
			sqlsrv_commit($this->conn);
		}
		if ($this->transactionLevel > 0) {
			$this->transactionLevel--;
		}
	}

	/**
	 * Rollback a transaction
	 */
	public function rollback() {
		if ($this->transactionLevel > 0) {
			sqlsrv_rollback($this->conn);
			$this->transactionLevel = 0;
		}
	}
}