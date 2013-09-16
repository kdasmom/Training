<?php
/**
 * File for class NPSoapStructPN_GET_VENDORCOMBO_CONFIRM
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_VENDORCOMBO_CONFIRM originally named PN_GET_VENDORCOMBO_CONFIRM
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_VENDORCOMBO_CONFIRM extends NPSoapWsdlClass
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
	 * The vendorconfirmlist
	 * @var NPSoapStructVendorconfirmlist
	 */
	public $vendorconfirmlist;
	/**
	 * Constructor method for PN_GET_VENDORCOMBO_CONFIRM
	 * @see parent::__construct()
	 * @param int $_integration_id
	 * @param NPSoapStructVendorconfirmlist $_vendorconfirmlist
	 * @return NPSoapStructPN_GET_VENDORCOMBO_CONFIRM
	 */
	public function __construct($_integration_id,$_vendorconfirmlist = NULL)
	{
		parent::__construct(array('integration_id'=>$_integration_id,'vendorconfirmlist'=>$_vendorconfirmlist));
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
	 * Get vendorconfirmlist value
	 * @return NPSoapStructVendorconfirmlist|null
	 */
	public function getVendorconfirmlist()
	{
		return $this->vendorconfirmlist;
	}
	/**
	 * Set vendorconfirmlist value
	 * @param NPSoapStructVendorconfirmlist $_vendorconfirmlist the vendorconfirmlist
	 * @return NPSoapStructVendorconfirmlist
	 */
	public function setVendorconfirmlist($_vendorconfirmlist)
	{
		return ($this->vendorconfirmlist = $_vendorconfirmlist);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_VENDORCOMBO_CONFIRM
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