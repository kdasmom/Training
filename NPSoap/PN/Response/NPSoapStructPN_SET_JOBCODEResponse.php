<?php
/**
 * File for class NPSoapStructPN_SET_JOBCODEResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_JOBCODEResponse originally named PN_SET_JOBCODEResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_JOBCODEResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_JOBCODEResult
	 * @var NPSoapStructPN_SET_JOBCODEResult
	 */
	public $PN_SET_JOBCODEResult;
	/**
	 * Constructor method for PN_SET_JOBCODEResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_JOBCODEResult $_pN_SET_JOBCODEResult
	 * @return NPSoapStructPN_SET_JOBCODEResponse
	 */
	public function __construct($_pN_SET_JOBCODEResult = NULL)
	{
		parent::__construct(array('PN_SET_JOBCODEResult'=>$_pN_SET_JOBCODEResult));
	}
	/**
	 * Get PN_SET_JOBCODEResult value
	 * @return NPSoapStructPN_SET_JOBCODEResult|null
	 */
	public function getPN_SET_JOBCODEResult()
	{
		return $this->PN_SET_JOBCODEResult;
	}
	/**
	 * Set PN_SET_JOBCODEResult value
	 * @param NPSoapStructPN_SET_JOBCODEResult $_pN_SET_JOBCODEResult the PN_SET_JOBCODEResult
	 * @return NPSoapStructPN_SET_JOBCODEResult
	 */
	public function setPN_SET_JOBCODEResult($_pN_SET_JOBCODEResult)
	{
		return ($this->PN_SET_JOBCODEResult = $_pN_SET_JOBCODEResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_JOBCODEResponse
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