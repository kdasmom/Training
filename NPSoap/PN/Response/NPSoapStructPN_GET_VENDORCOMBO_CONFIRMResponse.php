<?php
/**
 * File for class NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResponse originally named PN_GET_VENDORCOMBO_CONFIRMResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_GET_VENDORCOMBO_CONFIRMResult
	 * @var NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResult
	 */
	public $PN_GET_VENDORCOMBO_CONFIRMResult;
	/**
	 * Constructor method for PN_GET_VENDORCOMBO_CONFIRMResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResult $_pN_GET_VENDORCOMBO_CONFIRMResult
	 * @return NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResponse
	 */
	public function __construct($_pN_GET_VENDORCOMBO_CONFIRMResult = NULL)
	{
		parent::__construct(array('PN_GET_VENDORCOMBO_CONFIRMResult'=>$_pN_GET_VENDORCOMBO_CONFIRMResult));
	}
	/**
	 * Get PN_GET_VENDORCOMBO_CONFIRMResult value
	 * @return NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResult|null
	 */
	public function getPN_GET_VENDORCOMBO_CONFIRMResult()
	{
		return $this->PN_GET_VENDORCOMBO_CONFIRMResult;
	}
	/**
	 * Set PN_GET_VENDORCOMBO_CONFIRMResult value
	 * @param NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResult $_pN_GET_VENDORCOMBO_CONFIRMResult the PN_GET_VENDORCOMBO_CONFIRMResult
	 * @return NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResult
	 */
	public function setPN_GET_VENDORCOMBO_CONFIRMResult($_pN_GET_VENDORCOMBO_CONFIRMResult)
	{
		return ($this->PN_GET_VENDORCOMBO_CONFIRMResult = $_pN_GET_VENDORCOMBO_CONFIRMResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResponse
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