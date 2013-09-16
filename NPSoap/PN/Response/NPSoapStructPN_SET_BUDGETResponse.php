<?php
/**
 * File for class NPSoapStructPN_SET_BUDGETResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_BUDGETResponse originally named PN_SET_BUDGETResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_BUDGETResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_BUDGETResult
	 * @var NPSoapStructPN_SET_BUDGETResult
	 */
	public $PN_SET_BUDGETResult;
	/**
	 * Constructor method for PN_SET_BUDGETResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_BUDGETResult $_pN_SET_BUDGETResult
	 * @return NPSoapStructPN_SET_BUDGETResponse
	 */
	public function __construct($_pN_SET_BUDGETResult = NULL)
	{
		parent::__construct(array('PN_SET_BUDGETResult'=>$_pN_SET_BUDGETResult));
	}
	/**
	 * Get PN_SET_BUDGETResult value
	 * @return NPSoapStructPN_SET_BUDGETResult|null
	 */
	public function getPN_SET_BUDGETResult()
	{
		return $this->PN_SET_BUDGETResult;
	}
	/**
	 * Set PN_SET_BUDGETResult value
	 * @param NPSoapStructPN_SET_BUDGETResult $_pN_SET_BUDGETResult the PN_SET_BUDGETResult
	 * @return NPSoapStructPN_SET_BUDGETResult
	 */
	public function setPN_SET_BUDGETResult($_pN_SET_BUDGETResult)
	{
		return ($this->PN_SET_BUDGETResult = $_pN_SET_BUDGETResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_BUDGETResponse
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