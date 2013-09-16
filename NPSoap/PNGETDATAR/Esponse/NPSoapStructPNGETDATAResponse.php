<?php
/**
 * File for class NPSoapStructPNGETDATAResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPNGETDATAResponse originally named PNGETDATAResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPNGETDATAResponse extends NPSoapWsdlClass
{
	/**
	 * The PNGETDATAResult
	 * @var NPSoapStructPNGETDATAResult
	 */
	public $PNGETDATAResult;
	/**
	 * Constructor method for PNGETDATAResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPNGETDATAResult $_pNGETDATAResult
	 * @return NPSoapStructPNGETDATAResponse
	 */
	public function __construct($_pNGETDATAResult = NULL)
	{
		parent::__construct(array('PNGETDATAResult'=>$_pNGETDATAResult));
	}
	/**
	 * Get PNGETDATAResult value
	 * @return NPSoapStructPNGETDATAResult|null
	 */
	public function getPNGETDATAResult()
	{
		return $this->PNGETDATAResult;
	}
	/**
	 * Set PNGETDATAResult value
	 * @param NPSoapStructPNGETDATAResult $_pNGETDATAResult the PNGETDATAResult
	 * @return NPSoapStructPNGETDATAResult
	 */
	public function setPNGETDATAResult($_pNGETDATAResult)
	{
		return ($this->PNGETDATAResult = $_pNGETDATAResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPNGETDATAResponse
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