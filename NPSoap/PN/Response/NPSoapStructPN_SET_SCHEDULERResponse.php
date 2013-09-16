<?php
/**
 * File for class NPSoapStructPN_SET_SCHEDULERResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_SCHEDULERResponse originally named PN_SET_SCHEDULERResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_SCHEDULERResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_SCHEDULERResult
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $PN_SET_SCHEDULERResult;
	/**
	 * Constructor method for PN_SET_SCHEDULERResponse
	 * @see parent::__construct()
	 * @param string $_pN_SET_SCHEDULERResult
	 * @return NPSoapStructPN_SET_SCHEDULERResponse
	 */
	public function __construct($_pN_SET_SCHEDULERResult = NULL)
	{
		parent::__construct(array('PN_SET_SCHEDULERResult'=>$_pN_SET_SCHEDULERResult));
	}
	/**
	 * Get PN_SET_SCHEDULERResult value
	 * @return string|null
	 */
	public function getPN_SET_SCHEDULERResult()
	{
		return $this->PN_SET_SCHEDULERResult;
	}
	/**
	 * Set PN_SET_SCHEDULERResult value
	 * @param string $_pN_SET_SCHEDULERResult the PN_SET_SCHEDULERResult
	 * @return string
	 */
	public function setPN_SET_SCHEDULERResult($_pN_SET_SCHEDULERResult)
	{
		return ($this->PN_SET_SCHEDULERResult = $_pN_SET_SCHEDULERResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_SCHEDULERResponse
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