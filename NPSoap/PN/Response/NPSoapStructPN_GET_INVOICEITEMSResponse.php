<?php
/**
 * File for class NPSoapStructPN_GET_INVOICEITEMSResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_GET_INVOICEITEMSResponse originally named PN_GET_INVOICEITEMSResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_GET_INVOICEITEMSResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_GET_INVOICEITEMSResult
	 * @var NPSoapStructPN_GET_INVOICEITEMSResult
	 */
	public $PN_GET_INVOICEITEMSResult;
	/**
	 * Constructor method for PN_GET_INVOICEITEMSResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_GET_INVOICEITEMSResult $_pN_GET_INVOICEITEMSResult
	 * @return NPSoapStructPN_GET_INVOICEITEMSResponse
	 */
	public function __construct($_pN_GET_INVOICEITEMSResult = NULL)
	{
		parent::__construct(array('PN_GET_INVOICEITEMSResult'=>$_pN_GET_INVOICEITEMSResult));
	}
	/**
	 * Get PN_GET_INVOICEITEMSResult value
	 * @return NPSoapStructPN_GET_INVOICEITEMSResult|null
	 */
	public function getPN_GET_INVOICEITEMSResult()
	{
		return $this->PN_GET_INVOICEITEMSResult;
	}
	/**
	 * Set PN_GET_INVOICEITEMSResult value
	 * @param NPSoapStructPN_GET_INVOICEITEMSResult $_pN_GET_INVOICEITEMSResult the PN_GET_INVOICEITEMSResult
	 * @return NPSoapStructPN_GET_INVOICEITEMSResult
	 */
	public function setPN_GET_INVOICEITEMSResult($_pN_GET_INVOICEITEMSResult)
	{
		return ($this->PN_GET_INVOICEITEMSResult = $_pN_GET_INVOICEITEMSResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_GET_INVOICEITEMSResponse
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