<?php
/**
 * File for class NPSoapStructLoginResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructLoginResponse originally named LoginResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructLoginResponse extends NPSoapWsdlClass
{
	/**
	 * The LoginResult
	 * @var NPSoapStructLoginResult
	 */
	public $LoginResult;
	/**
	 * Constructor method for LoginResponse
	 * @see parent::__construct()
	 * @param NPSoapStructLoginResult $_loginResult
	 * @return NPSoapStructLoginResponse
	 */
	public function __construct($_loginResult = NULL)
	{
		parent::__construct(array('LoginResult'=>$_loginResult));
	}
	/**
	 * Get LoginResult value
	 * @return NPSoapStructLoginResult|null
	 */
	public function getLoginResult()
	{
		return $this->LoginResult;
	}
	/**
	 * Set LoginResult value
	 * @param NPSoapStructLoginResult $_loginResult the LoginResult
	 * @return NPSoapStructLoginResult
	 */
	public function setLoginResult($_loginResult)
	{
		return ($this->LoginResult = $_loginResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructLoginResponse
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