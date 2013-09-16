<?php
/**
 * File for class NPSoapStructPN_GET_SCHEDULER_CUSTOM
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_SCHEDULER_CUSTOM originally named PN_GET_SCHEDULER_CUSTOM
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_SCHEDULER_CUSTOM extends NPSoapWsdlClass
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
	 * The tablename
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $tablename;
	/**
	 * Constructor method for PN_GET_SCHEDULER_CUSTOM
	 * @see parent::__construct()
	 * @param int $_integrationPackageId
	 * @param string $_tablename
	 * @return NPSoapStructPN_GET_SCHEDULER_CUSTOM
	 */
	public function __construct($_integrationPackageId,$_tablename = NULL)
	{
		parent::__construct(array('IntegrationPackageId'=>$_integrationPackageId,'tablename'=>$_tablename));
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
	 * Get tablename value
	 * @return string|null
	 */
	public function getTablename()
	{
		return $this->tablename;
	}
	/**
	 * Set tablename value
	 * @param string $_tablename the tablename
	 * @return string
	 */
	public function setTablename($_tablename)
	{
		return ($this->tablename = $_tablename);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_SCHEDULER_CUSTOM
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