<?php
/**
 * File for class NPSoapStructPN_SAVE_QUERY_RESULTResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SAVE_QUERY_RESULTResponse originally named PN_SAVE_QUERY_RESULTResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SAVE_QUERY_RESULTResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SAVE_QUERY_RESULTResult
	 * @var NPSoapStructPN_SAVE_QUERY_RESULTResult
	 */
	public $PN_SAVE_QUERY_RESULTResult;
	/**
	 * Constructor method for PN_SAVE_QUERY_RESULTResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SAVE_QUERY_RESULTResult $_pN_SAVE_QUERY_RESULTResult
	 * @return NPSoapStructPN_SAVE_QUERY_RESULTResponse
	 */
	public function __construct($_pN_SAVE_QUERY_RESULTResult = NULL)
	{
		parent::__construct(array('PN_SAVE_QUERY_RESULTResult'=>$_pN_SAVE_QUERY_RESULTResult));
	}
	/**
	 * Get PN_SAVE_QUERY_RESULTResult value
	 * @return NPSoapStructPN_SAVE_QUERY_RESULTResult|null
	 */
	public function getPN_SAVE_QUERY_RESULTResult()
	{
		return $this->PN_SAVE_QUERY_RESULTResult;
	}
	/**
	 * Set PN_SAVE_QUERY_RESULTResult value
	 * @param NPSoapStructPN_SAVE_QUERY_RESULTResult $_pN_SAVE_QUERY_RESULTResult the PN_SAVE_QUERY_RESULTResult
	 * @return NPSoapStructPN_SAVE_QUERY_RESULTResult
	 */
	public function setPN_SAVE_QUERY_RESULTResult($_pN_SAVE_QUERY_RESULTResult)
	{
		return ($this->PN_SAVE_QUERY_RESULTResult = $_pN_SAVE_QUERY_RESULTResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SAVE_QUERY_RESULTResponse
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