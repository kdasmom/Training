<?php
/**
 * File for class NPSoapStructPN_SET_ERRORCODES
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_ERRORCODES originally named PN_SET_ERRORCODES
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_ERRORCODES extends NPSoapWsdlClass
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
	 * The ErrCodes
	 * @var NPSoapStructErrCodes
	 */
	public $ErrCodes;
	/**
	 * Constructor method for PN_SET_ERRORCODES
	 * @see parent::__construct()
	 * @param int $_integration_id
	 * @param NPSoapStructErrCodes $_errCodes
	 * @return NPSoapStructPN_SET_ERRORCODES
	 */
	public function __construct($_integration_id,$_errCodes = NULL)
	{
		parent::__construct(array('integration_id'=>$_integration_id,'ErrCodes'=>$_errCodes));
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
	 * Get ErrCodes value
	 * @return NPSoapStructErrCodes|null
	 */
	public function getErrCodes()
	{
		return $this->ErrCodes;
	}
	/**
	 * Set ErrCodes value
	 * @param NPSoapStructErrCodes $_errCodes the ErrCodes
	 * @return NPSoapStructErrCodes
	 */
	public function setErrCodes($_errCodes)
	{
		return ($this->ErrCodes = $_errCodes);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_ERRORCODES
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