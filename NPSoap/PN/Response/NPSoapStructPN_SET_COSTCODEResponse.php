<?php
/**
 * File for class NPSoapStructPN_SET_COSTCODEResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_COSTCODEResponse originally named PN_SET_COSTCODEResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_COSTCODEResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_COSTCODEResult
	 * @var NPSoapStructPN_SET_COSTCODEResult
	 */
	public $PN_SET_COSTCODEResult;
	/**
	 * Constructor method for PN_SET_COSTCODEResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_COSTCODEResult $_pN_SET_COSTCODEResult
	 * @return NPSoapStructPN_SET_COSTCODEResponse
	 */
	public function __construct($_pN_SET_COSTCODEResult = NULL)
	{
		parent::__construct(array('PN_SET_COSTCODEResult'=>$_pN_SET_COSTCODEResult));
	}
	/**
	 * Get PN_SET_COSTCODEResult value
	 * @return NPSoapStructPN_SET_COSTCODEResult|null
	 */
	public function getPN_SET_COSTCODEResult()
	{
		return $this->PN_SET_COSTCODEResult;
	}
	/**
	 * Set PN_SET_COSTCODEResult value
	 * @param NPSoapStructPN_SET_COSTCODEResult $_pN_SET_COSTCODEResult the PN_SET_COSTCODEResult
	 * @return NPSoapStructPN_SET_COSTCODEResult
	 */
	public function setPN_SET_COSTCODEResult($_pN_SET_COSTCODEResult)
	{
		return ($this->PN_SET_COSTCODEResult = $_pN_SET_COSTCODEResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_COSTCODEResponse
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