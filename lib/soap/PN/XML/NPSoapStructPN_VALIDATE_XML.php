<?php
/**
 * File for class NPSoapStructPN_VALIDATE_XML
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_VALIDATE_XML originally named PN_VALIDATE_XML
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_VALIDATE_XML extends NPSoapWsdlClass
{
	/**
	 * The xml
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $xml;
	/**
	 * The methodname
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $methodname;
	/**
	 * Constructor method for PN_VALIDATE_XML
	 * @see parent::__construct()
	 * @param string $_xml
	 * @param string $_methodname
	 * @return NPSoapStructPN_VALIDATE_XML
	 */
	public function __construct($_xml = NULL,$_methodname = NULL)
	{
		parent::__construct(array('xml'=>$_xml,'methodname'=>$_methodname));
	}
	/**
	 * Get xml value
	 * @return string|null
	 */
	public function getXml()
	{
		return $this->xml;
	}
	/**
	 * Set xml value
	 * @param string $_xml the xml
	 * @return string
	 */
	public function setXml($_xml)
	{
		return ($this->xml = $_xml);
	}
	/**
	 * Get methodname value
	 * @return string|null
	 */
	public function getMethodname()
	{
		return $this->methodname;
	}
	/**
	 * Set methodname value
	 * @param string $_methodname the methodname
	 * @return string
	 */
	public function setMethodname($_methodname)
	{
		return ($this->methodname = $_methodname);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_VALIDATE_XML
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