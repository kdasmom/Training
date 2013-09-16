<?php
/**
 * File for class NPSoapStructPN_VALIDATE_XMLResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_VALIDATE_XMLResponse originally named PN_VALIDATE_XMLResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_VALIDATE_XMLResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_VALIDATE_XMLResult
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $PN_VALIDATE_XMLResult;
	/**
	 * Constructor method for PN_VALIDATE_XMLResponse
	 * @see parent::__construct()
	 * @param string $_pN_VALIDATE_XMLResult
	 * @return NPSoapStructPN_VALIDATE_XMLResponse
	 */
	public function __construct($_pN_VALIDATE_XMLResult = NULL)
	{
		parent::__construct(array('PN_VALIDATE_XMLResult'=>$_pN_VALIDATE_XMLResult));
	}
	/**
	 * Get PN_VALIDATE_XMLResult value
	 * @return string|null
	 */
	public function getPN_VALIDATE_XMLResult()
	{
		return $this->PN_VALIDATE_XMLResult;
	}
	/**
	 * Set PN_VALIDATE_XMLResult value
	 * @param string $_pN_VALIDATE_XMLResult the PN_VALIDATE_XMLResult
	 * @return string
	 */
	public function setPN_VALIDATE_XMLResult($_pN_VALIDATE_XMLResult)
	{
		return ($this->PN_VALIDATE_XMLResult = $_pN_VALIDATE_XMLResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_VALIDATE_XMLResponse
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