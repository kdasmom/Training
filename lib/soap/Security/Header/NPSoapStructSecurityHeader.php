<?php

class NPSoapStructSecurityHeader extends NPSoapWsdlClass
{
	/**
	 * The SessionKey
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $SessionKey;
	/**
	 * The ClientName
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $ClientName;
	/**
	 * The UserName
	 * Meta informations extracted from the WSDL
	 * - maxOccurs : 1
	 * - minOccurs : 0
	 * @var string
	 */
	public $UserName;
	/**
	 * Constructor method for SecurityHeader
	 * @see parent::__construct()
	 * @param string $_sessionKey
	 * @param string $_clientName
	 * @param string $_userName
	 * @return NPSoapStructSecurityHeader
	 */
	public function __construct($_sessionKey = NULL,$_clientName = NULL,$_userName = NULL)
	{
		parent::__construct(array('SessionKey'=>$_sessionKey,'ClientName'=>$_clientName,'UserName'=>$_userName));
	}
	/**
	 * Get SessionKey value
	 * @return string|null
	 */
	public function getSessionKey()
	{
		return $this->SessionKey;
	}
	/**
	 * Set SessionKey value
	 * @param string $_sessionKey the SessionKey
	 * @return string
	 */
	public function setSessionKey($_sessionKey)
	{
		return ($this->SessionKey = $_sessionKey);
	}
	/**
	 * Get ClientName value
	 * @return string|null
	 */
	public function getClientName()
	{
		return $this->ClientName;
	}
	/**
	 * Set ClientName value
	 * @param string $_clientName the ClientName
	 * @return string
	 */
	public function setClientName($_clientName)
	{
		return ($this->ClientName = $_clientName);
	}
	/**
	 * Get UserName value
	 * @return string|null
	 */
	public function getUserName()
	{
		return $this->UserName;
	}
	/**
	 * Set UserName value
	 * @param string $_userName the UserName
	 * @return string
	 */
	public function setUserName($_userName)
	{
		return ($this->UserName = $_userName);
	}
	/**
	 * Method called when an object has been exported with var_export() functions
	 * It allows to return an object instantiated with the values
	 * @see NPSoapWsdlClass::__set_state()
	 * @uses NPSoapWsdlClass::__set_state()
	 * @param array $_array the exported values
	 * @return NPSoapStructSecurityHeader
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