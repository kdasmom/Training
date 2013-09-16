<?php
/**
 * File for class NPSoapStructPN_GET_RECEIPTSResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_RECEIPTSResponse originally named PN_GET_RECEIPTSResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_RECEIPTSResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_GET_RECEIPTSResult
	 * @var NPSoapStructPN_GET_RECEIPTSResult
	 */
	public $PN_GET_RECEIPTSResult;
	/**
	 * Constructor method for PN_GET_RECEIPTSResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_GET_RECEIPTSResult $_pN_GET_RECEIPTSResult
	 * @return NPSoapStructPN_GET_RECEIPTSResponse
	 */
	public function __construct($_pN_GET_RECEIPTSResult = NULL)
	{
		parent::__construct(array('PN_GET_RECEIPTSResult'=>$_pN_GET_RECEIPTSResult));
	}
	/**
	 * Get PN_GET_RECEIPTSResult value
	 * @return NPSoapStructPN_GET_RECEIPTSResult|null
	 */
	public function getPN_GET_RECEIPTSResult()
	{
		return $this->PN_GET_RECEIPTSResult;
	}
	/**
	 * Set PN_GET_RECEIPTSResult value
	 * @param NPSoapStructPN_GET_RECEIPTSResult $_pN_GET_RECEIPTSResult the PN_GET_RECEIPTSResult
	 * @return NPSoapStructPN_GET_RECEIPTSResult
	 */
	public function setPN_GET_RECEIPTSResult($_pN_GET_RECEIPTSResult)
	{
		return ($this->PN_GET_RECEIPTSResult = $_pN_GET_RECEIPTSResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_RECEIPTSResponse
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