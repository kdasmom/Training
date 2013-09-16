<?php
/**
 * File for class NPSoapStructPN_SET_CONTRACT
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_CONTRACT originally named PN_SET_CONTRACT
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_CONTRACT extends NPSoapWsdlClass
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
	 * The contracts
	 * @var NPSoapStructContracts
	 */
	public $contracts;
	/**
	 * Constructor method for PN_SET_CONTRACT
	 * @see parent::__construct()
	 * @param int $_integration_id
	 * @param NPSoapStructContracts $_contracts
	 * @return NPSoapStructPN_SET_CONTRACT
	 */
	public function __construct($_integration_id,$_contracts = NULL)
	{
		parent::__construct(array('integration_id'=>$_integration_id,'contracts'=>$_contracts));
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
	 * Get contracts value
	 * @return NPSoapStructContracts|null
	 */
	public function getContracts()
	{
		return $this->contracts;
	}
	/**
	 * Set contracts value
	 * @param NPSoapStructContracts $_contracts the contracts
	 * @return NPSoapStructContracts
	 */
	public function setContracts($_contracts)
	{
		return ($this->contracts = $_contracts);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_CONTRACT
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