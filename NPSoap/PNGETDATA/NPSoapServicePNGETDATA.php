<?php
/**
 * File for class NPSoapServicePNGETDATA
 * @package NPSoap
 * @subpackage Services
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
/**
 * This class stands for NPSoapServicePNGETDATA originally named PNGETDATA
 * @package NPSoap
 * @subpackage Services
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
class NPSoapServicePNGETDATA extends NPSoapWsdlClass
{
	/**
	 * Sets the SecurityHeader SoapHeader param
	 * @uses NPSoapWsdlClass::setSoapHeader()
	 * @param NPSoapStructSecurityHeader $_nPSoapStructSecurityHeader
	 * @param string $_nameSpace http://tempuri.org/
	 * @param bool $_mustUnderstand
	 * @param string $_actor
	 * @return bool true|false
	 */
	public function setSoapHeaderSecurityHeader(NPSoapStructSecurityHeader $_nPSoapStructSecurityHeader,$_nameSpace = 'http://tempuri.org/',$_mustUnderstand = false,$_actor = null)
	{
		return $this->setSoapHeader($_nameSpace,'SecurityHeader',$_nPSoapStructSecurityHeader,$_mustUnderstand,$_actor);
	}
	/**
	 * Method to call the operation originally named PNGETDATA
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPNGETDATA::getIntegrationPackageId()
	 * @uses NPSoapStructPNGETDATA::getDatatype()
	 * @uses NPSoapStructPNGETDATA::getParameters()
	 * @param NPSoapStructPNGETDATA $_nPSoapStructPNGETDATA
	 * @return NPSoapStructPNGETDATAResponse
	 */
	public function PNGETDATA(NPSoapStructPNGETDATA $_nPSoapStructPNGETDATA)
	{
		try
		{
			$this->setResult(new NPSoapStructPNGETDATAResponse(self::getSoapClient()->PNGETDATA(array('IntegrationPackageId'=>$_nPSoapStructPNGETDATA->getIntegrationPackageId(),'datatype'=>$_nPSoapStructPNGETDATA->getDatatype(),'parameters'=>$_nPSoapStructPNGETDATA->getParameters()))));
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
	 * @return NPSoapStructPNGETDATAResponse
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