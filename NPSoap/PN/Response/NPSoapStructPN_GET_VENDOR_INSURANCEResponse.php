<?php
/**
 * File for class NPSoapStructPN_GET_VENDOR_INSURANCEResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_VENDOR_INSURANCEResponse originally named PN_GET_VENDOR_INSURANCEResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_VENDOR_INSURANCEResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_GET_VENDOR_INSURANCEResult
	 * @var NPSoapStructPN_GET_VENDOR_INSURANCEResult
	 */
	public $PN_GET_VENDOR_INSURANCEResult;
	/**
	 * Constructor method for PN_GET_VENDOR_INSURANCEResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_GET_VENDOR_INSURANCEResult $_pN_GET_VENDOR_INSURANCEResult
	 * @return NPSoapStructPN_GET_VENDOR_INSURANCEResponse
	 */
	public function __construct($_pN_GET_VENDOR_INSURANCEResult = NULL)
	{
		parent::__construct(array('PN_GET_VENDOR_INSURANCEResult'=>$_pN_GET_VENDOR_INSURANCEResult));
	}
	/**
	 * Get PN_GET_VENDOR_INSURANCEResult value
	 * @return NPSoapStructPN_GET_VENDOR_INSURANCEResult|null
	 */
	public function getPN_GET_VENDOR_INSURANCEResult()
	{
		return $this->PN_GET_VENDOR_INSURANCEResult;
	}
	/**
	 * Set PN_GET_VENDOR_INSURANCEResult value
	 * @param NPSoapStructPN_GET_VENDOR_INSURANCEResult $_pN_GET_VENDOR_INSURANCEResult the PN_GET_VENDOR_INSURANCEResult
	 * @return NPSoapStructPN_GET_VENDOR_INSURANCEResult
	 */
	public function setPN_GET_VENDOR_INSURANCEResult($_pN_GET_VENDOR_INSURANCEResult)
	{
		return ($this->PN_GET_VENDOR_INSURANCEResult = $_pN_GET_VENDOR_INSURANCEResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_VENDOR_INSURANCEResponse
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