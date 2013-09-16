<?php
/**
 * File for class NPSoapStructPN_SET_PHASECODEResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_PHASECODEResponse originally named PN_SET_PHASECODEResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_PHASECODEResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_PHASECODEResult
	 * @var NPSoapStructPN_SET_PHASECODEResult
	 */
	public $PN_SET_PHASECODEResult;
	/**
	 * Constructor method for PN_SET_PHASECODEResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_PHASECODEResult $_pN_SET_PHASECODEResult
	 * @return NPSoapStructPN_SET_PHASECODEResponse
	 */
	public function __construct($_pN_SET_PHASECODEResult = NULL)
	{
		parent::__construct(array('PN_SET_PHASECODEResult'=>$_pN_SET_PHASECODEResult));
	}
	/**
	 * Get PN_SET_PHASECODEResult value
	 * @return NPSoapStructPN_SET_PHASECODEResult|null
	 */
	public function getPN_SET_PHASECODEResult()
	{
		return $this->PN_SET_PHASECODEResult;
	}
	/**
	 * Set PN_SET_PHASECODEResult value
	 * @param NPSoapStructPN_SET_PHASECODEResult $_pN_SET_PHASECODEResult the PN_SET_PHASECODEResult
	 * @return NPSoapStructPN_SET_PHASECODEResult
	 */
	public function setPN_SET_PHASECODEResult($_pN_SET_PHASECODEResult)
	{
		return ($this->PN_SET_PHASECODEResult = $_pN_SET_PHASECODEResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_PHASECODEResponse
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