<?php
/**
 * File for class NPSoapStructPN_SET_CHANGEORDER
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_CHANGEORDER originally named PN_SET_CHANGEORDER
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_CHANGEORDER extends NPSoapWsdlClass
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
	 * The changeorders
	 * @var NPSoapStructChangeorders
	 */
	public $changeorders;
	/**
	 * Constructor method for PN_SET_CHANGEORDER
	 * @see parent::__construct()
	 * @param int $_integration_id
	 * @param NPSoapStructChangeorders $_changeorders
	 * @return NPSoapStructPN_SET_CHANGEORDER
	 */
	public function __construct($_integration_id,$_changeorders = NULL)
	{
		parent::__construct(array('integration_id'=>$_integration_id,'changeorders'=>$_changeorders));
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
	 * Get changeorders value
	 * @return NPSoapStructChangeorders|null
	 */
	public function getChangeorders()
	{
		return $this->changeorders;
	}
	/**
	 * Set changeorders value
	 * @param NPSoapStructChangeorders $_changeorders the changeorders
	 * @return NPSoapStructChangeorders
	 */
	public function setChangeorders($_changeorders)
	{
		return ($this->changeorders = $_changeorders);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_CHANGEORDER
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