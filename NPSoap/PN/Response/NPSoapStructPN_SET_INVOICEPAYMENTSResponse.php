<?php
/**
 * File for class NPSoapStructPN_SET_INVOICEPAYMENTSResponse
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapStructPN_SET_INVOICEPAYMENTSResponse originally named PN_SET_INVOICEPAYMENTSResponse
 * Meta informations extracted from the WSDL
 * - from schema : {@link http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl}
 * @package NPSoap
 * @subpackage Structs
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapStructPN_SET_INVOICEPAYMENTSResponse extends NPSoapWsdlClass
{
	/**
	 * The PN_SET_INVOICEPAYMENTSResult
	 * @var NPSoapStructPN_SET_INVOICEPAYMENTSResult
	 */
	public $PN_SET_INVOICEPAYMENTSResult;
	/**
	 * Constructor method for PN_SET_INVOICEPAYMENTSResponse
	 * @see parent::__construct()
	 * @param NPSoapStructPN_SET_INVOICEPAYMENTSResult $_pN_SET_INVOICEPAYMENTSResult
	 * @return NPSoapStructPN_SET_INVOICEPAYMENTSResponse
	 */
	public function __construct($_pN_SET_INVOICEPAYMENTSResult = NULL)
	{
		parent::__construct(array('PN_SET_INVOICEPAYMENTSResult'=>$_pN_SET_INVOICEPAYMENTSResult));
	}
	/**
	 * Get PN_SET_INVOICEPAYMENTSResult value
	 * @return NPSoapStructPN_SET_INVOICEPAYMENTSResult|null
	 */
	public function getPN_SET_INVOICEPAYMENTSResult()
	{
		return $this->PN_SET_INVOICEPAYMENTSResult;
	}
	/**
	 * Set PN_SET_INVOICEPAYMENTSResult value
	 * @param NPSoapStructPN_SET_INVOICEPAYMENTSResult $_pN_SET_INVOICEPAYMENTSResult the PN_SET_INVOICEPAYMENTSResult
	 * @return NPSoapStructPN_SET_INVOICEPAYMENTSResult
	 */
	public function setPN_SET_INVOICEPAYMENTSResult($_pN_SET_INVOICEPAYMENTSResult)
	{
		return ($this->PN_SET_INVOICEPAYMENTSResult = $_pN_SET_INVOICEPAYMENTSResult);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructPN_SET_INVOICEPAYMENTSResponse
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