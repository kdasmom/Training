<?php
/**
 * File for class NPSoapStructPN_SET_INVOICEITEMSResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_INVOICEITEMSResponse originally named PN_SET_INVOICEITEMSResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_INVOICEITEMSResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_INVOICEITEMSResult
	 * @var NPSoapStructPN_SET_INVOICEITEMSResult
	 */
	public $PN_SET_INVOICEITEMSResult;
	/**
	 * Constructor method for PN_SET_INVOICEITEMSResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_INVOICEITEMSResult $_pN_SET_INVOICEITEMSResult
	 * @return NPSoapStructPN_SET_INVOICEITEMSResponse
	 */
	public function __construct($_pN_SET_INVOICEITEMSResult = NULL)
	{
		parent::__construct(array('PN_SET_INVOICEITEMSResult'=>$_pN_SET_INVOICEITEMSResult));
	}
	/**
	 * Get PN_SET_INVOICEITEMSResult value
	 * @return NPSoapStructPN_SET_INVOICEITEMSResult|null
	 */
	public function getPN_SET_INVOICEITEMSResult()
	{
		return $this->PN_SET_INVOICEITEMSResult;
	}
	/**
	 * Set PN_SET_INVOICEITEMSResult value
	 * @param NPSoapStructPN_SET_INVOICEITEMSResult $_pN_SET_INVOICEITEMSResult the PN_SET_INVOICEITEMSResult
	 * @return NPSoapStructPN_SET_INVOICEITEMSResult
	 */
	public function setPN_SET_INVOICEITEMSResult($_pN_SET_INVOICEITEMSResult)
	{
		return ($this->PN_SET_INVOICEITEMSResult = $_pN_SET_INVOICEITEMSResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_INVOICEITEMSResponse
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