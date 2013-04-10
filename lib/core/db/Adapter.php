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
			// Try to connect
			try {
				$this->conn = new \PDO("sqlsrv:Server={$this->server};Database={$this->dbName}", $this->username, $this->pwd);
				// Set error mode to make sure errors throw exceptions
				$this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
			// If connection fails, catch the exception and throw a custom error with it
			} catch(\PDOException $e) {
				throw new \NP\core\Exception("Connection failed: {$e->getMessage()}");
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

		// Create the SQL statement and execute it
		$stmt = $this->conn->prepare($sql);
		$res = $stmt->execute($params);
		
		// If we ran a select statement, return the data
		if ($stmt->columnCount() > 0) {
			// Fetch and return as an associative array
			return $stmt->fetchAll(\PDO::FETCH_ASSOC);
		// Otherwise, if it was an insert or update, return the result of execute statement
		} else {
			return $res;
		}
	}

	/**
	 * Return the last inserted ID
	 *
	 * @return int
	 */
	public function lastInsertId() {
		return $this->conn->lastInsertId();
	}

	/**
	 * Initiate a transaction
	 */
	public function beginTransaction() {
		if ($this->transactionLevel == 0) {
			$this->conn->beginTransaction();
		}
		$this->transactionLevel++;
	}

	/**
	 * Check if a transaction has been started
	 *
	 * @return boolean
	 */
	public function inTransaction() {
		return $this->conn->inTransaction();
	}

	/**
	 * Commit a transaction
	 */
	public function commit() {
		if ($this->transactionLevel == 1) {
			$this->conn->commit();
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
			$this->conn->rollback();
			$this->transactionLevel = 0;
		}
	}
}
?>