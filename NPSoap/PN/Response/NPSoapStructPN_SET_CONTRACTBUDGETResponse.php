<?php
/**
 * File for class NPSoapStructPN_SET_CONTRACTBUDGETResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_CONTRACTBUDGETResponse originally named PN_SET_CONTRACTBUDGETResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_CONTRACTBUDGETResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_CONTRACTBUDGETResult
	 * @var NPSoapStructPN_SET_CONTRACTBUDGETResult
	 */
	public $PN_SET_CONTRACTBUDGETResult;
	/**
	 * Constructor method for PN_SET_CONTRACTBUDGETResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_CONTRACTBUDGETResult $_pN_SET_CONTRACTBUDGETResult
	 * @return NPSoapStructPN_SET_CONTRACTBUDGETResponse
	 */
	public function __construct($_pN_SET_CONTRACTBUDGETResult = NULL)
	{
		parent::__construct(array('PN_SET_CONTRACTBUDGETResult'=>$_pN_SET_CONTRACTBUDGETResult));
	}
	/**
	 * Get PN_SET_CONTRACTBUDGETResult value
	 * @return NPSoapStructPN_SET_CONTRACTBUDGETResult|null
	 */
	public function getPN_SET_CONTRACTBUDGETResult()
	{
		return $this->PN_SET_CONTRACTBUDGETResult;
	}
	/**
	 * Set PN_SET_CONTRACTBUDGETResult value
	 * @param NPSoapStructPN_SET_CONTRACTBUDGETResult $_pN_SET_CONTRACTBUDGETResult the PN_SET_CONTRACTBUDGETResult
	 * @return NPSoapStructPN_SET_CONTRACTBUDGETResult
	 */
	public function setPN_SET_CONTRACTBUDGETResult($_pN_SET_CONTRACTBUDGETResult)
	{
		return ($this->PN_SET_CONTRACTBUDGETResult = $_pN_SET_CONTRACTBUDGETResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_CONTRACTBUDGETResponse
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