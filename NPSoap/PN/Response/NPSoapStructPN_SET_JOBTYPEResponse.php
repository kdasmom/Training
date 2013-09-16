<?php
/**
 * File for class NPSoapStructPN_SET_JOBTYPEResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_JOBTYPEResponse originally named PN_SET_JOBTYPEResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_JOBTYPEResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_JOBTYPEResult
	 * @var NPSoapStructPN_SET_JOBTYPEResult
	 */
	public $PN_SET_JOBTYPEResult;
	/**
	 * Constructor method for PN_SET_JOBTYPEResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_JOBTYPEResult $_pN_SET_JOBTYPEResult
	 * @return NPSoapStructPN_SET_JOBTYPEResponse
	 */
	public function __construct($_pN_SET_JOBTYPEResult = NULL)
	{
		parent::__construct(array('PN_SET_JOBTYPEResult'=>$_pN_SET_JOBTYPEResult));
	}
	/**
	 * Get PN_SET_JOBTYPEResult value
	 * @return NPSoapStructPN_SET_JOBTYPEResult|null
	 */
	public function getPN_SET_JOBTYPEResult()
	{
		return $this->PN_SET_JOBTYPEResult;
	}
	/**
	 * Set PN_SET_JOBTYPEResult value
	 * @param NPSoapStructPN_SET_JOBTYPEResult $_pN_SET_JOBTYPEResult the PN_SET_JOBTYPEResult
	 * @return NPSoapStructPN_SET_JOBTYPEResult
	 */
	public function setPN_SET_JOBTYPEResult($_pN_SET_JOBTYPEResult)
	{
		return ($this->PN_SET_JOBTYPEResult = $_pN_SET_JOBTYPEResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_JOBTYPEResponse
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