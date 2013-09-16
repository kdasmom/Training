<?php
/**
 * File for class NPSoapStructPN_GET_SCHEDULER_CUSTOMResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_SCHEDULER_CUSTOMResponse originally named PN_GET_SCHEDULER_CUSTOMResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_SCHEDULER_CUSTOMResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_GET_SCHEDULER_CUSTOMResult
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $PN_GET_SCHEDULER_CUSTOMResult;
	/**
	 * Constructor method for PN_GET_SCHEDULER_CUSTOMResponse
	 * @see parent::__construct()
	 * @param string $_pN_GET_SCHEDULER_CUSTOMResult
	 * @return NPSoapStructPN_GET_SCHEDULER_CUSTOMResponse
	 */
	public function __construct($_pN_GET_SCHEDULER_CUSTOMResult = NULL)
	{
		parent::__construct(array('PN_GET_SCHEDULER_CUSTOMResult'=>$_pN_GET_SCHEDULER_CUSTOMResult));
	}
	/**
	 * Get PN_GET_SCHEDULER_CUSTOMResult value
	 * @return string|null
	 */
	public function getPN_GET_SCHEDULER_CUSTOMResult()
	{
		return $this->PN_GET_SCHEDULER_CUSTOMResult;
	}
	/**
	 * Set PN_GET_SCHEDULER_CUSTOMResult value
	 * @param string $_pN_GET_SCHEDULER_CUSTOMResult the PN_GET_SCHEDULER_CUSTOMResult
	 * @return string
	 */
	public function setPN_GET_SCHEDULER_CUSTOMResult($_pN_GET_SCHEDULER_CUSTOMResult)
	{
		return ($this->PN_GET_SCHEDULER_CUSTOMResult = $_pN_GET_SCHEDULER_CUSTOMResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_SCHEDULER_CUSTOMResponse
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