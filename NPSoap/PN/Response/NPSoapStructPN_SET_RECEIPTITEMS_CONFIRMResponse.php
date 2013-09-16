<?php
/**
 * File for class NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResponse originally named PN_SET_RECEIPTITEMS_CONFIRMResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_RECEIPTITEMS_CONFIRMResult
	 * @var NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResult
	 */
	public $PN_SET_RECEIPTITEMS_CONFIRMResult;
	/**
	 * Constructor method for PN_SET_RECEIPTITEMS_CONFIRMResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResult $_pN_SET_RECEIPTITEMS_CONFIRMResult
	 * @return NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResponse
	 */
	public function __construct($_pN_SET_RECEIPTITEMS_CONFIRMResult = NULL)
	{
		parent::__construct(array('PN_SET_RECEIPTITEMS_CONFIRMResult'=>$_pN_SET_RECEIPTITEMS_CONFIRMResult));
	}
	/**
	 * Get PN_SET_RECEIPTITEMS_CONFIRMResult value
	 * @return NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResult|null
	 */
	public function getPN_SET_RECEIPTITEMS_CONFIRMResult()
	{
		return $this->PN_SET_RECEIPTITEMS_CONFIRMResult;
	}
	/**
	 * Set PN_SET_RECEIPTITEMS_CONFIRMResult value
	 * @param NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResult $_pN_SET_RECEIPTITEMS_CONFIRMResult the PN_SET_RECEIPTITEMS_CONFIRMResult
	 * @return NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResult
	 */
	public function setPN_SET_RECEIPTITEMS_CONFIRMResult($_pN_SET_RECEIPTITEMS_CONFIRMResult)
	{
		return ($this->PN_SET_RECEIPTITEMS_CONFIRMResult = $_pN_SET_RECEIPTITEMS_CONFIRMResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResponse
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