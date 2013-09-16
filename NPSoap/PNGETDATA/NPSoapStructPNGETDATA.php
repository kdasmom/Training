<?php
/**
 * File for class NPSoapStructPNGETDATA
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPNGETDATA originally named PNGETDATA
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPNGETDATA extends NPSoapWsdlClass
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
	 * The datatype
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $datatype;
	/**
	 * The parameters
	 * @var NPSoapStructParameters
	 */
	public $parameters;
	/**
	 * Constructor method for PNGETDATA
	 * @see parent::__construct()
	 * @param int $_integrationPackageId
	 * @param string $_datatype
	 * @param NPSoapStructParameters $_parameters
	 * @return NPSoapStructPNGETDATA
	 */
	public function __construct($_integrationPackageId,$_datatype = NULL,$_parameters = NULL)
	{
		parent::__construct(array('IntegrationPackageId'=>$_integrationPackageId,'datatype'=>$_datatype,'parameters'=>$_parameters));
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
	 * Get datatype value
	 * @return string|null
	 */
	public function getDatatype()
	{
		return $this->datatype;
	}
	/**
	 * Set datatype value
	 * @param string $_datatype the datatype
	 * @return string
	 */
	public function setDatatype($_datatype)
	{
		return ($this->datatype = $_datatype);
	}
	/**
	 * Get parameters value
	 * @return NPSoapStructParameters|null
	 */
	public function getParameters()
	{
		return $this->parameters;
	}
	/**
	 * Set parameters value
	 * @param NPSoapStructParameters $_parameters the parameters
	 * @return NPSoapStructParameters
	 */
	public function setParameters($_parameters)
	{
		return ($this->parameters = $_parameters);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPNGETDATA
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