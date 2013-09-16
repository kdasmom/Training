<?php
/**
 * File for class NPSoapStructPN_GET_INVOICES_CONFIRM
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_INVOICES_CONFIRM originally named PN_GET_INVOICES_CONFIRM
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_INVOICES_CONFIRM extends NPSoapWsdlClass
{
	/**
	 * The integration_id
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 1
	 * @var int
	 */
	public $integration_id;
	/**
	 * The invoiceconfirmlist
	 * @var NPSoapStructInvoiceconfirmlist
	 */
	public $invoiceconfirmlist;
	/**
	 * Constructor method for PN_GET_INVOICES_CONFIRM
	 * @see parent::__construct()
	 * @param int $_integration_id
	 * @param NPSoapStructInvoiceconfirmlist $_invoiceconfirmlist
	 * @return NPSoapStructPN_GET_INVOICES_CONFIRM
	 */
	public function __construct($_integration_id,$_invoiceconfirmlist = NULL)
	{
		parent::__construct(array('integration_id'=>$_integration_id,'invoiceconfirmlist'=>$_invoiceconfirmlist));
	}
	/**
	 * Get integration_id value
	 * @return int
	 */
	public function getIntegration_id()
	{
		return $this->integration_id;
	}
	/**
	 * Set integration_id value
	 * @param int $_integration_id the integration_id
	 * @return int
	 */
	public function setIntegration_id($_integration_id)
	{
		return ($this->integration_id = $_integration_id);
	}
	/**
	 * Get invoiceconfirmlist value
	 * @return NPSoapStructInvoiceconfirmlist|null
	 */
	public function getInvoiceconfirmlist()
	{
		return $this->invoiceconfirmlist;
	}
	/**
	 * Set invoiceconfirmlist value
	 * @param NPSoapStructInvoiceconfirmlist $_invoiceconfirmlist the invoiceconfirmlist
	 * @return NPSoapStructInvoiceconfirmlist
	 */
	public function setInvoiceconfirmlist($_invoiceconfirmlist)
	{
		return ($this->invoiceconfirmlist = $_invoiceconfirmlist);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_INVOICES_CONFIRM
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