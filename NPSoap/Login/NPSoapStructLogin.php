<?php
/**
 * File for class NPSoapStructLogin
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructLogin originally named Login
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructLogin extends NPSoapWsdlClass
{
	/**
	 * The username
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $username;
	/**
	 * The password
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $password;
	/**
	 * The client_name
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $client_name;
	/**
	 * The client_ip
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $client_ip;
	/**
	 * Constructor method for Login
	 * @see parent::__construct()
	 * @param string $_username
	 * @param string $_password
	 * @param string $_client_name
	 * @param string $_client_ip
	 * @return NPSoapStructLogin
	 */
	public function __construct($_username = NULL,$_password = NULL,$_client_name = NULL,$_client_ip = NULL)
	{
		parent::__construct(array('username'=>$_username,'password'=>$_password,'client_name'=>$_client_name,'client_ip'=>$_client_ip));
	}
	/**
	 * Get username value
	 * @return string|null
	 */
	public function getUsername()
	{
		return $this->username;
	}
	/**
	 * Set username value
	 * @param string $_username the username
	 * @return string
	 */
	public function setUsername($_username)
	{
		return ($this->username = $_username);
	}
	/**
	 * Get password value
	 * @return string|null
	 */
	public function getPassword()
	{
		return $this->password;
	}
	/**
	 * Set password value
	 * @param string $_password the password
	 * @return string
	 */
	public function setPassword($_password)
	{
		return ($this->password = $_password);
	}
	/**
	 * Get client_name value
	 * @return string|null
	 */
	public function getClient_name()
	{
		return $this->client_name;
	}
	/**
	 * Set client_name value
	 * @param string $_client_name the client_name
	 * @return string
	 */
	public function setClient_name($_client_name)
	{
		return ($this->client_name = $_client_name);
	}
	/**
	 * Get client_ip value
	 * @return string|null
	 */
	public function getClient_ip()
	{
		return $this->client_ip;
	}
	/**
	 * Set client_ip value
	 * @param string $_client_ip the client_ip
	 * @return string
	 */
	public function setClient_ip($_client_ip)
	{
		return ($this->client_ip = $_client_ip);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructLogin
	 */
	public static function __set_state(array $_array,$_className = __CLASS__)
	{
		return parent::__set_state($_array,$_className);
	}
	/**
	 * Method returning the class name
	 * @return string __CLASS__
	 */
	public function __toString()
	{
		return __CLASS__;
	}
}
?>