<?php
/**
 * File for class NPSoapStructPN_SET_INVOICES
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_INVOICES originally named PN_SET_INVOICES
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_INVOICES extends NPSoapWsdlClass
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
	 * The invoices
	 * @var NPSoapStructInvoices
	 */
	public $invoices;
	/**
	 * Constructor method for PN_SET_INVOICES
	 * @see parent::__construct()
	 * @param int $_integration_id
	 * @param NPSoapStructInvoices $_invoices
	 * @return NPSoapStructPN_SET_INVOICES
	 */
	public function __construct($_integration_id,$_invoices = NULL)
	{
		parent::__construct(array('integration_id'=>$_integration_id,'invoices'=>$_invoices));
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
	 * Get invoices value
	 * @return NPSoapStructInvoices|null
	 */
	public function getInvoices()
	{
		return $this->invoices;
	}
	/**
	 * Set invoices value
	 * @param NPSoapStructInvoices $_invoices the invoices
	 * @return NPSoapStructInvoices
	 */
	public function setInvoices($_invoices)
	{
		return ($this->invoices = $_invoices);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_INVOICES
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