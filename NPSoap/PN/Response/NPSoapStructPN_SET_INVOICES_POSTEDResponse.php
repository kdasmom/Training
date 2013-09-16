<?php
/**
 * File for class NPSoapStructPN_SET_INVOICES_POSTEDResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_INVOICES_POSTEDResponse originally named PN_SET_INVOICES_POSTEDResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_INVOICES_POSTEDResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_INVOICES_POSTEDResult
	 * @var NPSoapStructPN_SET_INVOICES_POSTEDResult
	 */
	public $PN_SET_INVOICES_POSTEDResult;
	/**
	 * Constructor method for PN_SET_INVOICES_POSTEDResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_INVOICES_POSTEDResult $_pN_SET_INVOICES_POSTEDResult
	 * @return NPSoapStructPN_SET_INVOICES_POSTEDResponse
	 */
	public function __construct($_pN_SET_INVOICES_POSTEDResult = NULL)
	{
		parent::__construct(array('PN_SET_INVOICES_POSTEDResult'=>$_pN_SET_INVOICES_POSTEDResult));
	}
	/**
	 * Get PN_SET_INVOICES_POSTEDResult value
	 * @return NPSoapStructPN_SET_INVOICES_POSTEDResult|null
	 */
	public function getPN_SET_INVOICES_POSTEDResult()
	{
		return $this->PN_SET_INVOICES_POSTEDResult;
	}
	/**
	 * Set PN_SET_INVOICES_POSTEDResult value
	 * @param NPSoapStructPN_SET_INVOICES_POSTEDResult $_pN_SET_INVOICES_POSTEDResult the PN_SET_INVOICES_POSTEDResult
	 * @return NPSoapStructPN_SET_INVOICES_POSTEDResult
	 */
	public function setPN_SET_INVOICES_POSTEDResult($_pN_SET_INVOICES_POSTEDResult)
	{
		return ($this->PN_SET_INVOICES_POSTEDResult = $_pN_SET_INVOICES_POSTEDResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_INVOICES_POSTEDResponse
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