<?php
/**
 * File for class NPSoapStructPN_SET_ACTUALResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_ACTUALResponse originally named PN_SET_ACTUALResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_ACTUALResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_ACTUALResult
	 * @var NPSoapStructPN_SET_ACTUALResult
	 */
	public $PN_SET_ACTUALResult;
	/**
	 * Constructor method for PN_SET_ACTUALResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_ACTUALResult $_pN_SET_ACTUALResult
	 * @return NPSoapStructPN_SET_ACTUALResponse
	 */
	public function __construct($_pN_SET_ACTUALResult = NULL)
	{
		parent::__construct(array('PN_SET_ACTUALResult'=>$_pN_SET_ACTUALResult));
	}
	/**
	 * Get PN_SET_ACTUALResult value
	 * @return NPSoapStructPN_SET_ACTUALResult|null
	 */
	public function getPN_SET_ACTUALResult()
	{
		return $this->PN_SET_ACTUALResult;
	}
	/**
	 * Set PN_SET_ACTUALResult value
	 * @param NPSoapStructPN_SET_ACTUALResult $_pN_SET_ACTUALResult the PN_SET_ACTUALResult
	 * @return NPSoapStructPN_SET_ACTUALResult
	 */
	public function setPN_SET_ACTUALResult($_pN_SET_ACTUALResult)
	{
		return ($this->PN_SET_ACTUALResult = $_pN_SET_ACTUALResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_ACTUALResponse
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