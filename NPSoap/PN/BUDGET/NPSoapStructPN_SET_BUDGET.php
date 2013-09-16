<?php

class NPSoapStructPN_SET_BUDGET extends NPSoapWsdlClass
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
	 * The budgets
	 * @var NPSoapStructBudgets
	 */
	public $budgets;
	/**
	 * Constructor method for PN_SET_BUDGET
	 * @see parent::__construct()
	 * @param int $_integration_id
	 * @param NPSoapStructBudgets $_budgets
	 * @return NPSoapStructPN_SET_BUDGET
	 */
	public function __construct($_integration_id,$_budgets = NULL)
	{
		parent::__construct(array('integration_id'=>$_integration_id,'budgets'=>$_budgets));
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
	 * Get budgets value
	 * @return NPSoapStructBudgets|null
	 */
	public function getBudgets()
	{
		return $this->budgets;
	}
	/**
	 * Set budgets value
	 * @param NPSoapStructBudgets $_budgets the budgets
	 * @return NPSoapStructBudgets
	 */
	public function setBudgets($_budgets)
	{
		return ($this->budgets = $_budgets);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_BUDGET
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