<?php
/**
 * File for class NPSoapStructPN_GET_PURCHASEORDERS
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_PURCHASEORDERS originally named PN_GET_PURCHASEORDERS
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_PURCHASEORDERS extends NPSoapWsdlClass
{
	/**
	 * The IntegrationPackageId
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 1
	 * @var int
	 */
	public $IntegrationPackageId;
	/**
	 * Constructor method for PN_GET_PURCHASEORDERS
	 * @see parent::__construct()
	 * @param int $_integrationPackageId
	 * @return NPSoapStructPN_GET_PURCHASEORDERS
	 */
	public function __construct($_integrationPackageId)
	{
		parent::__construct(array('IntegrationPackageId'=>$_integrationPackageId));
	}
	/**
	 * Get IntegrationPackageId value
	 * @return int
	 */
	public function getIntegrationPackageId()
	{
		return $this->IntegrationPackageId;
	}
	/**
	 * Set IntegrationPackageId value
	 * @param int $_integrationPackageId the IntegrationPackageId
	 * @return int
	 */
	public function setIntegrationPackageId($_integrationPackageId)
	{
		return ($this->IntegrationPackageId = $_integrationPackageId);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_PURCHASEORDERS
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