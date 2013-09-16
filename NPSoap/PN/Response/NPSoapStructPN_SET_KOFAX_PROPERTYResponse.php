<?php
/**
 * File for class NPSoapStructPN_SET_KOFAX_PROPERTYResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_KOFAX_PROPERTYResponse originally named PN_SET_KOFAX_PROPERTYResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_KOFAX_PROPERTYResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_KOFAX_PROPERTYResult
	 * @var NPSoapStructPN_SET_KOFAX_PROPERTYResult
	 */
	public $PN_SET_KOFAX_PROPERTYResult;
	/**
	 * Constructor method for PN_SET_KOFAX_PROPERTYResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_KOFAX_PROPERTYResult $_pN_SET_KOFAX_PROPERTYResult
	 * @return NPSoapStructPN_SET_KOFAX_PROPERTYResponse
	 */
	public function __construct($_pN_SET_KOFAX_PROPERTYResult = NULL)
	{
		parent::__construct(array('PN_SET_KOFAX_PROPERTYResult'=>$_pN_SET_KOFAX_PROPERTYResult));
	}
	/**
	 * Get PN_SET_KOFAX_PROPERTYResult value
	 * @return NPSoapStructPN_SET_KOFAX_PROPERTYResult|null
	 */
	public function getPN_SET_KOFAX_PROPERTYResult()
	{
		return $this->PN_SET_KOFAX_PROPERTYResult;
	}
	/**
	 * Set PN_SET_KOFAX_PROPERTYResult value
	 * @param NPSoapStructPN_SET_KOFAX_PROPERTYResult $_pN_SET_KOFAX_PROPERTYResult the PN_SET_KOFAX_PROPERTYResult
	 * @return NPSoapStructPN_SET_KOFAX_PROPERTYResult
	 */
	public function setPN_SET_KOFAX_PROPERTYResult($_pN_SET_KOFAX_PROPERTYResult)
	{
		return ($this->PN_SET_KOFAX_PROPERTYResult = $_pN_SET_KOFAX_PROPERTYResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_KOFAX_PROPERTYResponse
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