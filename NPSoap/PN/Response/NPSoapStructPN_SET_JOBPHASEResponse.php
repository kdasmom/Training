<?php
/**
 * File for class NPSoapStructPN_SET_JOBPHASEResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_JOBPHASEResponse originally named PN_SET_JOBPHASEResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_JOBPHASEResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_JOBPHASEResult
	 * @var NPSoapStructPN_SET_JOBPHASEResult
	 */
	public $PN_SET_JOBPHASEResult;
	/**
	 * Constructor method for PN_SET_JOBPHASEResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_JOBPHASEResult $_pN_SET_JOBPHASEResult
	 * @return NPSoapStructPN_SET_JOBPHASEResponse
	 */
	public function __construct($_pN_SET_JOBPHASEResult = NULL)
	{
		parent::__construct(array('PN_SET_JOBPHASEResult'=>$_pN_SET_JOBPHASEResult));
	}
	/**
	 * Get PN_SET_JOBPHASEResult value
	 * @return NPSoapStructPN_SET_JOBPHASEResult|null
	 */
	public function getPN_SET_JOBPHASEResult()
	{
		return $this->PN_SET_JOBPHASEResult;
	}
	/**
	 * Set PN_SET_JOBPHASEResult value
	 * @param NPSoapStructPN_SET_JOBPHASEResult $_pN_SET_JOBPHASEResult the PN_SET_JOBPHASEResult
	 * @return NPSoapStructPN_SET_JOBPHASEResult
	 */
	public function setPN_SET_JOBPHASEResult($_pN_SET_JOBPHASEResult)
	{
		return ($this->PN_SET_JOBPHASEResult = $_pN_SET_JOBPHASEResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_JOBPHASEResponse
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