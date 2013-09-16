<?php
/**
 * File for class NPSoapStructPN_SET_DATA
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_DATA originally named PN_SET_DATA
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_DATA extends NPSoapWsdlClass
{
	/**
	 * The integration_id
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 1
	 * @var int
	 */
	public $integration_id;
	/**
	 * The data
	 * @var NPSoapStructData
	 */
	public $data;
	/**
	 * The datatype
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $datatype;
	/**
	 * Constructor method for PN_SET_DATA
	 * @see parent::__construct()
	 * @param int $_integration_id
	 * @param NPSoapStructData $_data
	 * @param string $_datatype
	 * @return NPSoapStructPN_SET_DATA
	 */
	public function __construct($_integration_id,$_data = NULL,$_datatype = NULL)
	{
		parent::__construct(array('integration_id'=>$_integration_id,'data'=>$_data,'datatype'=>$_datatype));
	}
	/**
	 * Get integration_id value
	 * @return int
	 */
	public function getIntegration_id()
	{
		return $this->integration_id;
	}
	/**
	 * Set integration_id value
	 * @param int $_integration_id the integration_id
	 * @return int
	 */
	public function setIntegration_id($_integration_id)
	{
		return ($this->integration_id = $_integration_id);
	}
	/**
	 * Get data value
	 * @return NPSoapStructData|null
	 */
	public function getData()
	{
		return $this->data;
	}
	/**
	 * Set data value
	 * @param NPSoapStructData $_data the data
	 * @return NPSoapStructData
	 */
	public function setData($_data)
	{
		return ($this->data = $_data);
	}
	/**
	 * Get datatype value
	 * @return string|null
	 */
	public function getDatatype()
	{
		return $this->datatype;
	}
	/**
	 * Set datatype value
	 * @param string $_datatype the datatype
	 * @return string
	 */
	public function setDatatype($_datatype)
	{
		return ($this->datatype = $_datatype);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_DATA
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