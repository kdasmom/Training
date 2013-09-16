<?php
/**
 * File for class NPSoapStructPN_SAVE_QUERY_RESULT
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SAVE_QUERY_RESULT originally named PN_SAVE_QUERY_RESULT
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SAVE_QUERY_RESULT extends NPSoapWsdlClass
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
	 * The xQuery
	 * @var NPSoapStructXQuery
	 */
	public $xQuery;
	/**
	 * Constructor method for PN_SAVE_QUERY_RESULT
	 * @see parent::__construct()
	 * @param int $_integration_id
	 * @param NPSoapStructXQuery $_xQuery
	 * @return NPSoapStructPN_SAVE_QUERY_RESULT
	 */
	public function __construct($_integration_id,$_xQuery = NULL)
	{
		parent::__construct(array('integration_id'=>$_integration_id,'xQuery'=>$_xQuery));
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
	 * Get xQuery value
	 * @return NPSoapStructXQuery|null
	 */
	public function getXQuery()
	{
		return $this->xQuery;
	}
	/**
	 * Set xQuery value
	 * @param NPSoapStructXQuery $_xQuery the xQuery
	 * @return NPSoapStructXQuery
	 */
	public function setXQuery($_xQuery)
	{
		return ($this->xQuery = $_xQuery);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SAVE_QUERY_RESULT
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