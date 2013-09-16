<?php
/**
 * File for class NPSoapStructPN_GET_POITEMSResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_POITEMSResponse originally named PN_GET_POITEMSResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_POITEMSResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_GET_POITEMSResult
	 * @var NPSoapStructPN_GET_POITEMSResult
	 */
	public $PN_GET_POITEMSResult;
	/**
	 * Constructor method for PN_GET_POITEMSResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_GET_POITEMSResult $_pN_GET_POITEMSResult
	 * @return NPSoapStructPN_GET_POITEMSResponse
	 */
	public function __construct($_pN_GET_POITEMSResult = NULL)
	{
		parent::__construct(array('PN_GET_POITEMSResult'=>$_pN_GET_POITEMSResult));
	}
	/**
	 * Get PN_GET_POITEMSResult value
	 * @return NPSoapStructPN_GET_POITEMSResult|null
	 */
	public function getPN_GET_POITEMSResult()
	{
		return $this->PN_GET_POITEMSResult;
	}
	/**
	 * Set PN_GET_POITEMSResult value
	 * @param NPSoapStructPN_GET_POITEMSResult $_pN_GET_POITEMSResult the PN_GET_POITEMSResult
	 * @return NPSoapStructPN_GET_POITEMSResult
	 */
	public function setPN_GET_POITEMSResult($_pN_GET_POITEMSResult)
	{
		return ($this->PN_GET_POITEMSResult = $_pN_GET_POITEMSResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_POITEMSResponse
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