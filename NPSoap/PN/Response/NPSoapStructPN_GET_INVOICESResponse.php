<?php
/**
 * File for class NPSoapStructPN_GET_INVOICESResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_INVOICESResponse originally named PN_GET_INVOICESResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_INVOICESResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_GET_INVOICESResult
	 * @var NPSoapStructPN_GET_INVOICESResult
	 */
	public $PN_GET_INVOICESResult;
	/**
	 * Constructor method for PN_GET_INVOICESResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_GET_INVOICESResult $_pN_GET_INVOICESResult
	 * @return NPSoapStructPN_GET_INVOICESResponse
	 */
	public function __construct($_pN_GET_INVOICESResult = NULL)
	{
		parent::__construct(array('PN_GET_INVOICESResult'=>$_pN_GET_INVOICESResult));
	}
	/**
	 * Get PN_GET_INVOICESResult value
	 * @return NPSoapStructPN_GET_INVOICESResult|null
	 */
	public function getPN_GET_INVOICESResult()
	{
		return $this->PN_GET_INVOICESResult;
	}
	/**
	 * Set PN_GET_INVOICESResult value
	 * @param NPSoapStructPN_GET_INVOICESResult $_pN_GET_INVOICESResult the PN_GET_INVOICESResult
	 * @return NPSoapStructPN_GET_INVOICESResult
	 */
	public function setPN_GET_INVOICESResult($_pN_GET_INVOICESResult)
	{
		return ($this->PN_GET_INVOICESResult = $_pN_GET_INVOICESResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_INVOICESResponse
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