<?php
/**
 * File for class NPSoapStructPN_SET_CONTRACTResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_CONTRACTResponse originally named PN_SET_CONTRACTResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_CONTRACTResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_CONTRACTResult
	 * @var NPSoapStructPN_SET_CONTRACTResult
	 */
	public $PN_SET_CONTRACTResult;
	/**
	 * Constructor method for PN_SET_CONTRACTResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_CONTRACTResult $_pN_SET_CONTRACTResult
	 * @return NPSoapStructPN_SET_CONTRACTResponse
	 */
	public function __construct($_pN_SET_CONTRACTResult = NULL)
	{
		parent::__construct(array('PN_SET_CONTRACTResult'=>$_pN_SET_CONTRACTResult));
	}
	/**
	 * Get PN_SET_CONTRACTResult value
	 * @return NPSoapStructPN_SET_CONTRACTResult|null
	 */
	public function getPN_SET_CONTRACTResult()
	{
		return $this->PN_SET_CONTRACTResult;
	}
	/**
	 * Set PN_SET_CONTRACTResult value
	 * @param NPSoapStructPN_SET_CONTRACTResult $_pN_SET_CONTRACTResult the PN_SET_CONTRACTResult
	 * @return NPSoapStructPN_SET_CONTRACTResult
	 */
	public function setPN_SET_CONTRACTResult($_pN_SET_CONTRACTResult)
	{
		return ($this->PN_SET_CONTRACTResult = $_pN_SET_CONTRACTResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_CONTRACTResponse
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