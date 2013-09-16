<?php
/**
 * File for class NPSoapStructPN_SET_DATAResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_DATAResponse originally named PN_SET_DATAResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_DATAResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_DATAResult
	 * @var NPSoapStructPN_SET_DATAResult
	 */
	public $PN_SET_DATAResult;
	/**
	 * Constructor method for PN_SET_DATAResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_DATAResult $_pN_SET_DATAResult
	 * @return NPSoapStructPN_SET_DATAResponse
	 */
	public function __construct($_pN_SET_DATAResult = NULL)
	{
		parent::__construct(array('PN_SET_DATAResult'=>$_pN_SET_DATAResult));
	}
	/**
	 * Get PN_SET_DATAResult value
	 * @return NPSoapStructPN_SET_DATAResult|null
	 */
	public function getPN_SET_DATAResult()
	{
		return $this->PN_SET_DATAResult;
	}
	/**
	 * Set PN_SET_DATAResult value
	 * @param NPSoapStructPN_SET_DATAResult $_pN_SET_DATAResult the PN_SET_DATAResult
	 * @return NPSoapStructPN_SET_DATAResult
	 */
	public function setPN_SET_DATAResult($_pN_SET_DATAResult)
	{
		return ($this->PN_SET_DATAResult = $_pN_SET_DATAResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_DATAResponse
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