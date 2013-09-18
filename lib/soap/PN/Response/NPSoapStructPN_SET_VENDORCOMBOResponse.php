<?php
/**
 * File for class NPSoapStructPN_SET_VENDORCOMBOResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_VENDORCOMBOResponse originally named PN_SET_VENDORCOMBOResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_VENDORCOMBOResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_VENDORCOMBOResult
	 * @var NPSoapStructPN_SET_VENDORCOMBOResult
	 */
	public $PN_SET_VENDORCOMBOResult;
	/**
	 * Constructor method for PN_SET_VENDORCOMBOResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_VENDORCOMBOResult $_pN_SET_VENDORCOMBOResult
	 * @return NPSoapStructPN_SET_VENDORCOMBOResponse
	 */
	public function __construct($_pN_SET_VENDORCOMBOResult = NULL)
	{
		parent::__construct(array('PN_SET_VENDORCOMBOResult'=>$_pN_SET_VENDORCOMBOResult));
	}
	/**
	 * Get PN_SET_VENDORCOMBOResult value
	 * @return NPSoapStructPN_SET_VENDORCOMBOResult|null
	 */
	public function getPN_SET_VENDORCOMBOResult()
	{
		return $this->PN_SET_VENDORCOMBOResult;
	}
	/**
	 * Set PN_SET_VENDORCOMBOResult value
	 * @param NPSoapStructPN_SET_VENDORCOMBOResult $_pN_SET_VENDORCOMBOResult the PN_SET_VENDORCOMBOResult
	 * @return NPSoapStructPN_SET_VENDORCOMBOResult
	 */
	public function setPN_SET_VENDORCOMBOResult($_pN_SET_VENDORCOMBOResult)
	{
		return ($this->PN_SET_VENDORCOMBOResult = $_pN_SET_VENDORCOMBOResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_VENDORCOMBOResponse
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