<?php
/**
 * File for class NPSoapStructPN_SET_ERRORCODESResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_ERRORCODESResponse originally named PN_SET_ERRORCODESResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_ERRORCODESResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_ERRORCODESResult
	 * @var NPSoapStructPN_SET_ERRORCODESResult
	 */
	public $PN_SET_ERRORCODESResult;
	/**
	 * Constructor method for PN_SET_ERRORCODESResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_ERRORCODESResult $_pN_SET_ERRORCODESResult
	 * @return NPSoapStructPN_SET_ERRORCODESResponse
	 */
	public function __construct($_pN_SET_ERRORCODESResult = NULL)
	{
		parent::__construct(array('PN_SET_ERRORCODESResult'=>$_pN_SET_ERRORCODESResult));
	}
	/**
	 * Get PN_SET_ERRORCODESResult value
	 * @return NPSoapStructPN_SET_ERRORCODESResult|null
	 */
	public function getPN_SET_ERRORCODESResult()
	{
		return $this->PN_SET_ERRORCODESResult;
	}
	/**
	 * Set PN_SET_ERRORCODESResult value
	 * @param NPSoapStructPN_SET_ERRORCODESResult $_pN_SET_ERRORCODESResult the PN_SET_ERRORCODESResult
	 * @return NPSoapStructPN_SET_ERRORCODESResult
	 */
	public function setPN_SET_ERRORCODESResult($_pN_SET_ERRORCODESResult)
	{
		return ($this->PN_SET_ERRORCODESResult = $_pN_SET_ERRORCODESResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_ERRORCODESResponse
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