<?php
/**
 * File for class NPSoapStructPN_SET_KOFAX_VENDOR
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_KOFAX_VENDOR originally named PN_SET_KOFAX_VENDOR
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_KOFAX_VENDOR extends NPSoapWsdlClass
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
	 * The vendors
	 * @var NPSoapStructVendors
	 */
	public $vendors;
	/**
	 * Constructor method for PN_SET_KOFAX_VENDOR
	 * @see parent::__construct()
	 * @param int $_integration_id
	 * @param NPSoapStructVendors $_vendors
	 * @return NPSoapStructPN_SET_KOFAX_VENDOR
	 */
	public function __construct($_integration_id,$_vendors = NULL)
	{
		parent::__construct(array('integration_id'=>$_integration_id,'vendors'=>$_vendors));
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
	 * Get vendors value
	 * @return NPSoapStructVendors|null
	 */
	public function getVendors()
	{
		return $this->vendors;
	}
	/**
	 * Set vendors value
	 * @param NPSoapStructVendors $_vendors the vendors
	 * @return NPSoapStructVendors
	 */
	public function setVendors($_vendors)
	{
		return ($this->vendors = $_vendors);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_KOFAX_VENDOR
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