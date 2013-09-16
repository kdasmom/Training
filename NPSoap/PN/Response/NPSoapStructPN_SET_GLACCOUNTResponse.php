<?php
/**
 * File for class NPSoapStructPN_SET_GLACCOUNTResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_GLACCOUNTResponse originally named PN_SET_GLACCOUNTResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_GLACCOUNTResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_GLACCOUNTResult
	 * @var NPSoapStructPN_SET_GLACCOUNTResult
	 */
	public $PN_SET_GLACCOUNTResult;
	/**
	 * Constructor method for PN_SET_GLACCOUNTResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_GLACCOUNTResult $_pN_SET_GLACCOUNTResult
	 * @return NPSoapStructPN_SET_GLACCOUNTResponse
	 */
	public function __construct($_pN_SET_GLACCOUNTResult = NULL)
	{
		parent::__construct(array('PN_SET_GLACCOUNTResult'=>$_pN_SET_GLACCOUNTResult));
	}
	/**
	 * Get PN_SET_GLACCOUNTResult value
	 * @return NPSoapStructPN_SET_GLACCOUNTResult|null
	 */
	public function getPN_SET_GLACCOUNTResult()
	{
		return $this->PN_SET_GLACCOUNTResult;
	}
	/**
	 * Set PN_SET_GLACCOUNTResult value
	 * @param NPSoapStructPN_SET_GLACCOUNTResult $_pN_SET_GLACCOUNTResult the PN_SET_GLACCOUNTResult
	 * @return NPSoapStructPN_SET_GLACCOUNTResult
	 */
	public function setPN_SET_GLACCOUNTResult($_pN_SET_GLACCOUNTResult)
	{
		return ($this->PN_SET_GLACCOUNTResult = $_pN_SET_GLACCOUNTResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_GLACCOUNTResponse
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