<?php
/**
 * File for class NPSoapStructPN_GET_RCTITEMSResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_RCTITEMSResponse originally named PN_GET_RCTITEMSResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_RCTITEMSResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_GET_RCTITEMSResult
	 * @var NPSoapStructPN_GET_RCTITEMSResult
	 */
	public $PN_GET_RCTITEMSResult;
	/**
	 * Constructor method for PN_GET_RCTITEMSResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_GET_RCTITEMSResult $_pN_GET_RCTITEMSResult
	 * @return NPSoapStructPN_GET_RCTITEMSResponse
	 */
	public function __construct($_pN_GET_RCTITEMSResult = NULL)
	{
		parent::__construct(array('PN_GET_RCTITEMSResult'=>$_pN_GET_RCTITEMSResult));
	}
	/**
	 * Get PN_GET_RCTITEMSResult value
	 * @return NPSoapStructPN_GET_RCTITEMSResult|null
	 */
	public function getPN_GET_RCTITEMSResult()
	{
		return $this->PN_GET_RCTITEMSResult;
	}
	/**
	 * Set PN_GET_RCTITEMSResult value
	 * @param NPSoapStructPN_GET_RCTITEMSResult $_pN_GET_RCTITEMSResult the PN_GET_RCTITEMSResult
	 * @return NPSoapStructPN_GET_RCTITEMSResult
	 */
	public function setPN_GET_RCTITEMSResult($_pN_GET_RCTITEMSResult)
	{
		return ($this->PN_GET_RCTITEMSResult = $_pN_GET_RCTITEMSResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_RCTITEMSResponse
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