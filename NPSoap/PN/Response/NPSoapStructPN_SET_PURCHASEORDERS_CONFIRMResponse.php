<?php
/**
 * File for class NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResponse originally named PN_SET_PURCHASEORDERS_CONFIRMResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_PURCHASEORDERS_CONFIRMResult
	 * @var NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResult
	 */
	public $PN_SET_PURCHASEORDERS_CONFIRMResult;
	/**
	 * Constructor method for PN_SET_PURCHASEORDERS_CONFIRMResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResult $_pN_SET_PURCHASEORDERS_CONFIRMResult
	 * @return NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResponse
	 */
	public function __construct($_pN_SET_PURCHASEORDERS_CONFIRMResult = NULL)
	{
		parent::__construct(array('PN_SET_PURCHASEORDERS_CONFIRMResult'=>$_pN_SET_PURCHASEORDERS_CONFIRMResult));
	}
	/**
	 * Get PN_SET_PURCHASEORDERS_CONFIRMResult value
	 * @return NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResult|null
	 */
	public function getPN_SET_PURCHASEORDERS_CONFIRMResult()
	{
		return $this->PN_SET_PURCHASEORDERS_CONFIRMResult;
	}
	/**
	 * Set PN_SET_PURCHASEORDERS_CONFIRMResult value
	 * @param NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResult $_pN_SET_PURCHASEORDERS_CONFIRMResult the PN_SET_PURCHASEORDERS_CONFIRMResult
	 * @return NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResult
	 */
	public function setPN_SET_PURCHASEORDERS_CONFIRMResult($_pN_SET_PURCHASEORDERS_CONFIRMResult)
	{
		return ($this->PN_SET_PURCHASEORDERS_CONFIRMResult = $_pN_SET_PURCHASEORDERS_CONFIRMResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResponse
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