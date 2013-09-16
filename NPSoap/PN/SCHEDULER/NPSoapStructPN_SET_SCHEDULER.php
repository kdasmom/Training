<?php
/**
 * File for class NPSoapStructPN_SET_SCHEDULER
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_SCHEDULER originally named PN_SET_SCHEDULER
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_SCHEDULER extends NPSoapWsdlClass
{
	/**
	 * The schedule
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $schedule;
	/**
	 * The statuslog
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $statuslog;
	/**
	 * Constructor method for PN_SET_SCHEDULER
	 * @see parent::__construct()
	 * @param string $_schedule
	 * @param string $_statuslog
	 * @return NPSoapStructPN_SET_SCHEDULER
	 */
	public function __construct($_schedule = NULL,$_statuslog = NULL)
	{
		parent::__construct(array('schedule'=>$_schedule,'statuslog'=>$_statuslog));
	}
	/**
	 * Get schedule value
	 * @return string|null
	 */
	public function getSchedule()
	{
		return $this->schedule;
	}
	/**
	 * Set schedule value
	 * @param string $_schedule the schedule
	 * @return string
	 */
	public function setSchedule($_schedule)
	{
		return ($this->schedule = $_schedule);
	}
	/**
	 * Get statuslog value
	 * @return string|null
	 */
	public function getStatuslog()
	{
		return $this->statuslog;
	}
	/**
	 * Set statuslog value
	 * @param string $_statuslog the statuslog
	 * @return string
	 */
	public function setStatuslog($_statuslog)
	{
		return ($this->statuslog = $_statuslog);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_SCHEDULER
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