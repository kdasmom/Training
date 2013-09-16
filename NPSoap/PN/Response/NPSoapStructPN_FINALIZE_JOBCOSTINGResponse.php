<?php
/**
 * File for class NPSoapStructPN_FINALIZE_JOBCOSTINGResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_FINALIZE_JOBCOSTINGResponse originally named PN_FINALIZE_JOBCOSTINGResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_FINALIZE_JOBCOSTINGResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_FINALIZE_JOBCOSTINGResult
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $PN_FINALIZE_JOBCOSTINGResult;
	/**
	 * Constructor method for PN_FINALIZE_JOBCOSTINGResponse
	 * @see parent::__construct()
	 * @param string $_pN_FINALIZE_JOBCOSTINGResult
	 * @return NPSoapStructPN_FINALIZE_JOBCOSTINGResponse
	 */
	public function __construct($_pN_FINALIZE_JOBCOSTINGResult = NULL)
	{
		parent::__construct(array('PN_FINALIZE_JOBCOSTINGResult'=>$_pN_FINALIZE_JOBCOSTINGResult));
	}
	/**
	 * Get PN_FINALIZE_JOBCOSTINGResult value
	 * @return string|null
	 */
	public function getPN_FINALIZE_JOBCOSTINGResult()
	{
		return $this->PN_FINALIZE_JOBCOSTINGResult;
	}
	/**
	 * Set PN_FINALIZE_JOBCOSTINGResult value
	 * @param string $_pN_FINALIZE_JOBCOSTINGResult the PN_FINALIZE_JOBCOSTINGResult
	 * @return string
	 */
	public function setPN_FINALIZE_JOBCOSTINGResult($_pN_FINALIZE_JOBCOSTINGResult)
	{
		return ($this->PN_FINALIZE_JOBCOSTINGResult = $_pN_FINALIZE_JOBCOSTINGResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_FINALIZE_JOBCOSTINGResponse
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