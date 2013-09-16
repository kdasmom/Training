<?php
/**
 * File for class NPSoapStructPN_GET_PURCHASEORDERSResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_PURCHASEORDERSResponse originally named PN_GET_PURCHASEORDERSResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_PURCHASEORDERSResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_GET_PURCHASEORDERSResult
	 * @var NPSoapStructPN_GET_PURCHASEORDERSResult
	 */
	public $PN_GET_PURCHASEORDERSResult;
	/**
	 * Constructor method for PN_GET_PURCHASEORDERSResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_GET_PURCHASEORDERSResult $_pN_GET_PURCHASEORDERSResult
	 * @return NPSoapStructPN_GET_PURCHASEORDERSResponse
	 */
	public function __construct($_pN_GET_PURCHASEORDERSResult = NULL)
	{
		parent::__construct(array('PN_GET_PURCHASEORDERSResult'=>$_pN_GET_PURCHASEORDERSResult));
	}
	/**
	 * Get PN_GET_PURCHASEORDERSResult value
	 * @return NPSoapStructPN_GET_PURCHASEORDERSResult|null
	 */
	public function getPN_GET_PURCHASEORDERSResult()
	{
		return $this->PN_GET_PURCHASEORDERSResult;
	}
	/**
	 * Set PN_GET_PURCHASEORDERSResult value
	 * @param NPSoapStructPN_GET_PURCHASEORDERSResult $_pN_GET_PURCHASEORDERSResult the PN_GET_PURCHASEORDERSResult
	 * @return NPSoapStructPN_GET_PURCHASEORDERSResult
	 */
	public function setPN_GET_PURCHASEORDERSResult($_pN_GET_PURCHASEORDERSResult)
	{
		return ($this->PN_GET_PURCHASEORDERSResult = $_pN_GET_PURCHASEORDERSResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_PURCHASEORDERSResponse
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