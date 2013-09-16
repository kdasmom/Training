<?php
/**
 * File for class NPSoapStructPN_SET_CHANGEORDERResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_CHANGEORDERResponse originally named PN_SET_CHANGEORDERResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_CHANGEORDERResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_CHANGEORDERResult
	 * @var NPSoapStructPN_SET_CHANGEORDERResult
	 */
	public $PN_SET_CHANGEORDERResult;
	/**
	 * Constructor method for PN_SET_CHANGEORDERResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_CHANGEORDERResult $_pN_SET_CHANGEORDERResult
	 * @return NPSoapStructPN_SET_CHANGEORDERResponse
	 */
	public function __construct($_pN_SET_CHANGEORDERResult = NULL)
	{
		parent::__construct(array('PN_SET_CHANGEORDERResult'=>$_pN_SET_CHANGEORDERResult));
	}
	/**
	 * Get PN_SET_CHANGEORDERResult value
	 * @return NPSoapStructPN_SET_CHANGEORDERResult|null
	 */
	public function getPN_SET_CHANGEORDERResult()
	{
		return $this->PN_SET_CHANGEORDERResult;
	}
	/**
	 * Set PN_SET_CHANGEORDERResult value
	 * @param NPSoapStructPN_SET_CHANGEORDERResult $_pN_SET_CHANGEORDERResult the PN_SET_CHANGEORDERResult
	 * @return NPSoapStructPN_SET_CHANGEORDERResult
	 */
	public function setPN_SET_CHANGEORDERResult($_pN_SET_CHANGEORDERResult)
	{
		return ($this->PN_SET_CHANGEORDERResult = $_pN_SET_CHANGEORDERResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_CHANGEORDERResponse
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