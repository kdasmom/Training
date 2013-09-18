<?php

class NPSoapServiceLogin extends NPSoapWsdlClass
{
	/**
	 * Method to call the operation originally named Login
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructLogin::getUsername()
	 * @uses NPSoapStructLogin::getPassword()
	 * @uses NPSoapStructLogin::getClient_name()
	 * @uses NPSoapStructLogin::getClient_ip()
	 * @param NPSoapStructLogin $_nPSoapStructLogin
	 * @return NPSoapStructLoginResponse
	 */
	public function Login(NPSoapStructLogin $_nPSoapStructLogin)
	{
		try
		{
			$this->setResult(new NPSoapStructLoginResponse(self::getSoapClient()->Login(array('username'=>$_nPSoapStructLogin->getUsername(),'password'=>$_nPSoapStructLogin->getPassword(),'client_name'=>$_nPSoapStructLogin->getClient_name(),'client_ip'=>$_nPSoapStructLogin->getClient_ip()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Returns the result
	 * @see NPSoapWsdlClass::getResult()
	 * @return NPSoapStructLoginResponse
	 */
	public function getResult()
	{
		return parent::getResult();
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