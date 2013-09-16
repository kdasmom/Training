<?php
/**
 * File for class NPSoapStructPN_SET_INVOICESResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_INVOICESResponse originally named PN_SET_INVOICESResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_INVOICESResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_INVOICESResult
	 * @var NPSoapStructPN_SET_INVOICESResult
	 */
	public $PN_SET_INVOICESResult;
	/**
	 * Constructor method for PN_SET_INVOICESResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_INVOICESResult $_pN_SET_INVOICESResult
	 * @return NPSoapStructPN_SET_INVOICESResponse
	 */
	public function __construct($_pN_SET_INVOICESResult = NULL)
	{
		parent::__construct(array('PN_SET_INVOICESResult'=>$_pN_SET_INVOICESResult));
	}
	/**
	 * Get PN_SET_INVOICESResult value
	 * @return NPSoapStructPN_SET_INVOICESResult|null
	 */
	public function getPN_SET_INVOICESResult()
	{
		return $this->PN_SET_INVOICESResult;
	}
	/**
	 * Set PN_SET_INVOICESResult value
	 * @param NPSoapStructPN_SET_INVOICESResult $_pN_SET_INVOICESResult the PN_SET_INVOICESResult
	 * @return NPSoapStructPN_SET_INVOICESResult
	 */
	public function setPN_SET_INVOICESResult($_pN_SET_INVOICESResult)
	{
		return ($this->PN_SET_INVOICESResult = $_pN_SET_INVOICESResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_INVOICESResponse
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