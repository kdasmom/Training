<?php
namespace NP\core\db;

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

	/**
	 * Connects to the database
	 */
	public function connect() {
		// Only try to connect if a connection hasn't been established yet
		if ($this->conn === null) {
			// Set error mode to make sure errors throw exceptions
			sqlsrv_configure('WarningsReturnAsErrors', 1);

			// Try to connect
			$connectionInfo = array('Database'=>$this->dbName, 'UID'=>$this->username, 'PWD'=>$this->pwd, 'ReturnDatesAsStrings'=>true);
			$this->conn = sqlsrv_connect($this->server, $connectionInfo);

			if (!$this->conn) {
				die( print_r( sqlsrv_errors(), true) );
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
		$beginSql = strtolower(substr($sql, 0, 6));

		// If dealing with an insert statement, append SCOPE_IDENTITY QUERY at the end
		if ($beginSql == 'insert') {
			$sql .= ';SELECT SCOPE_IDENTITY() AS last_id;';
		}

		// Create the SQL statement and execute it
		$stmt = sqlsrv_query($this->conn, $sql, $params);
		if (!$stmt) {
			$error = "Error running query. SQL was the following:\n\n{$sql}\n\nError was the following:\n\n";
			$error .= print_r( sqlsrv_errors(), true);
			throw new \NP\core\Exception($error);
			die;
		}
		
		// If we ran a select statement, return the data
		if (!in_array($beginSql, array('insert','update','delete'))) {
			// Fetch and return as an associative array
			$res = array();
			while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
				$res[] = $row;
			}

			return $res;
		// If dealing with an insert statement, we need to get the last insert ID and store it
		} else if ($beginSql == 'insert') {
			sqlsrv_next_result($stmt);
     		sqlsrv_fetch($stmt);
			$this->lastInsertId = sqlsrv_get_field($stmt, 0);
		}

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
?>