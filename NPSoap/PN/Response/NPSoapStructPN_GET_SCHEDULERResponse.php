<?php
/**
 * File for class NPSoapStructPN_GET_SCHEDULERResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_SCHEDULERResponse originally named PN_GET_SCHEDULERResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_SCHEDULERResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_GET_SCHEDULERResult
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $PN_GET_SCHEDULERResult;
	/**
	 * Constructor method for PN_GET_SCHEDULERResponse
	 * @see parent::__construct()
	 * @param string $_pN_GET_SCHEDULERResult
	 * @return NPSoapStructPN_GET_SCHEDULERResponse
	 */
	public function __construct($_pN_GET_SCHEDULERResult = NULL)
	{
		parent::__construct(array('PN_GET_SCHEDULERResult'=>$_pN_GET_SCHEDULERResult));
	}
	/**
	 * Get PN_GET_SCHEDULERResult value
	 * @return string|null
	 */
	public function getPN_GET_SCHEDULERResult()
	{
		return $this->PN_GET_SCHEDULERResult;
	}
	/**
	 * Set PN_GET_SCHEDULERResult value
	 * @param string $_pN_GET_SCHEDULERResult the PN_GET_SCHEDULERResult
	 * @return string
	 */
	public function setPN_GET_SCHEDULERResult($_pN_GET_SCHEDULERResult)
	{
		return ($this->PN_GET_SCHEDULERResult = $_pN_GET_SCHEDULERResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_SCHEDULERResponse
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