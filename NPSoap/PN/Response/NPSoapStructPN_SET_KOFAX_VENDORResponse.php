<?php
/**
 * File for class NPSoapStructPN_SET_KOFAX_VENDORResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_KOFAX_VENDORResponse originally named PN_SET_KOFAX_VENDORResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_KOFAX_VENDORResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_KOFAX_VENDORResult
	 * @var NPSoapStructPN_SET_KOFAX_VENDORResult
	 */
	public $PN_SET_KOFAX_VENDORResult;
	/**
	 * Constructor method for PN_SET_KOFAX_VENDORResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_KOFAX_VENDORResult $_pN_SET_KOFAX_VENDORResult
	 * @return NPSoapStructPN_SET_KOFAX_VENDORResponse
	 */
	public function __construct($_pN_SET_KOFAX_VENDORResult = NULL)
	{
		parent::__construct(array('PN_SET_KOFAX_VENDORResult'=>$_pN_SET_KOFAX_VENDORResult));
	}
	/**
	 * Get PN_SET_KOFAX_VENDORResult value
	 * @return NPSoapStructPN_SET_KOFAX_VENDORResult|null
	 */
	public function getPN_SET_KOFAX_VENDORResult()
	{
		return $this->PN_SET_KOFAX_VENDORResult;
	}
	/**
	 * Set PN_SET_KOFAX_VENDORResult value
	 * @param NPSoapStructPN_SET_KOFAX_VENDORResult $_pN_SET_KOFAX_VENDORResult the PN_SET_KOFAX_VENDORResult
	 * @return NPSoapStructPN_SET_KOFAX_VENDORResult
	 */
	public function setPN_SET_KOFAX_VENDORResult($_pN_SET_KOFAX_VENDORResult)
	{
		return ($this->PN_SET_KOFAX_VENDORResult = $_pN_SET_KOFAX_VENDORResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_KOFAX_VENDORResponse
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