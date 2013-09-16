<?php

class NPSoapServicePN extends NPSoapWsdlClass
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
	 * Method to call the operation originally named PN_SET_PHASECODE
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_PHASECODE::getIntegration_id()
	 * @uses NPSoapStructPN_SET_PHASECODE::getPhasecodes()
	 * @param NPSoapStructPN_SET_PHASECODE $_nPSoapStructPN_SET_PHASECODE
	 * @return NPSoapStructPN_SET_PHASECODEResponse
	 */
	public function PN_SET_PHASECODE(NPSoapStructPN_SET_PHASECODE $_nPSoapStructPN_SET_PHASECODE)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_PHASECODEResponse(self::getSoapClient()->PN_SET_PHASECODE(array('integration_id'=>$_nPSoapStructPN_SET_PHASECODE->getIntegration_id(),'phasecodes'=>$_nPSoapStructPN_SET_PHASECODE->getPhasecodes()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_CHANGEORDER
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_CHANGEORDER::getIntegration_id()
	 * @uses NPSoapStructPN_SET_CHANGEORDER::getChangeorders()
	 * @param NPSoapStructPN_SET_CHANGEORDER $_nPSoapStructPN_SET_CHANGEORDER
	 * @return NPSoapStructPN_SET_CHANGEORDERResponse
	 */
	public function PN_SET_CHANGEORDER(NPSoapStructPN_SET_CHANGEORDER $_nPSoapStructPN_SET_CHANGEORDER)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_CHANGEORDERResponse(self::getSoapClient()->PN_SET_CHANGEORDER(array('integration_id'=>$_nPSoapStructPN_SET_CHANGEORDER->getIntegration_id(),'changeorders'=>$_nPSoapStructPN_SET_CHANGEORDER->getChangeorders()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_KOFAX_VENDOR
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_KOFAX_VENDOR::getIntegration_id()
	 * @uses NPSoapStructPN_SET_KOFAX_VENDOR::getVendors()
	 * @param NPSoapStructPN_SET_KOFAX_VENDOR $_nPSoapStructPN_SET_KOFAX_VENDOR
	 * @return NPSoapStructPN_SET_KOFAX_VENDORResponse
	 */
	public function PN_SET_KOFAX_VENDOR(NPSoapStructPN_SET_KOFAX_VENDOR $_nPSoapStructPN_SET_KOFAX_VENDOR)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_KOFAX_VENDORResponse(self::getSoapClient()->PN_SET_KOFAX_VENDOR(array('integration_id'=>$_nPSoapStructPN_SET_KOFAX_VENDOR->getIntegration_id(),'vendors'=>$_nPSoapStructPN_SET_KOFAX_VENDOR->getVendors()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_KOFAX_PROPERTY
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_KOFAX_PROPERTY::getIntegration_id()
	 * @uses NPSoapStructPN_SET_KOFAX_PROPERTY::getProperties()
	 * @param NPSoapStructPN_SET_KOFAX_PROPERTY $_nPSoapStructPN_SET_KOFAX_PROPERTY
	 * @return NPSoapStructPN_SET_KOFAX_PROPERTYResponse
	 */
	public function PN_SET_KOFAX_PROPERTY(NPSoapStructPN_SET_KOFAX_PROPERTY $_nPSoapStructPN_SET_KOFAX_PROPERTY)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_KOFAX_PROPERTYResponse(self::getSoapClient()->PN_SET_KOFAX_PROPERTY(array('integration_id'=>$_nPSoapStructPN_SET_KOFAX_PROPERTY->getIntegration_id(),'properties'=>$_nPSoapStructPN_SET_KOFAX_PROPERTY->getProperties()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_JOBCODE
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_JOBCODE::getIntegration_id()
	 * @uses NPSoapStructPN_SET_JOBCODE::getJobcodes()
	 * @param NPSoapStructPN_SET_JOBCODE $_nPSoapStructPN_SET_JOBCODE
	 * @return NPSoapStructPN_SET_JOBCODEResponse
	 */
	public function PN_SET_JOBCODE(NPSoapStructPN_SET_JOBCODE $_nPSoapStructPN_SET_JOBCODE)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_JOBCODEResponse(self::getSoapClient()->PN_SET_JOBCODE(array('integration_id'=>$_nPSoapStructPN_SET_JOBCODE->getIntegration_id(),'jobcodes'=>$_nPSoapStructPN_SET_JOBCODE->getJobcodes()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SAVE_QUERY_RESULT
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SAVE_QUERY_RESULT::getIntegration_id()
	 * @uses NPSoapStructPN_SAVE_QUERY_RESULT::getXQuery()
	 * @param NPSoapStructPN_SAVE_QUERY_RESULT $_nPSoapStructPN_SAVE_QUERY_RESULT
	 * @return NPSoapStructPN_SAVE_QUERY_RESULTResponse
	 */
	public function PN_SAVE_QUERY_RESULT(NPSoapStructPN_SAVE_QUERY_RESULT $_nPSoapStructPN_SAVE_QUERY_RESULT)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SAVE_QUERY_RESULTResponse(self::getSoapClient()->PN_SAVE_QUERY_RESULT(array('integration_id'=>$_nPSoapStructPN_SAVE_QUERY_RESULT->getIntegration_id(),'xQuery'=>$_nPSoapStructPN_SAVE_QUERY_RESULT->getXQuery()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_COSTCODE
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_COSTCODE::getIntegration_id()
	 * @uses NPSoapStructPN_SET_COSTCODE::getCostcodes()
	 * @param NPSoapStructPN_SET_COSTCODE $_nPSoapStructPN_SET_COSTCODE
	 * @return NPSoapStructPN_SET_COSTCODEResponse
	 */
	public function PN_SET_COSTCODE(NPSoapStructPN_SET_COSTCODE $_nPSoapStructPN_SET_COSTCODE)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_COSTCODEResponse(self::getSoapClient()->PN_SET_COSTCODE(array('integration_id'=>$_nPSoapStructPN_SET_COSTCODE->getIntegration_id(),'costcodes'=>$_nPSoapStructPN_SET_COSTCODE->getCostcodes()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_CONTRACTBUDGET
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_CONTRACTBUDGET::getIntegration_id()
	 * @uses NPSoapStructPN_SET_CONTRACTBUDGET::getContractbudgets()
	 * @param NPSoapStructPN_SET_CONTRACTBUDGET $_nPSoapStructPN_SET_CONTRACTBUDGET
	 * @return NPSoapStructPN_SET_CONTRACTBUDGETResponse
	 */
	public function PN_SET_CONTRACTBUDGET(NPSoapStructPN_SET_CONTRACTBUDGET $_nPSoapStructPN_SET_CONTRACTBUDGET)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_CONTRACTBUDGETResponse(self::getSoapClient()->PN_SET_CONTRACTBUDGET(array('integration_id'=>$_nPSoapStructPN_SET_CONTRACTBUDGET->getIntegration_id(),'contractbudgets'=>$_nPSoapStructPN_SET_CONTRACTBUDGET->getContractbudgets()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_CONTRACT
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_CONTRACT::getIntegration_id()
	 * @uses NPSoapStructPN_SET_CONTRACT::getContracts()
	 * @param NPSoapStructPN_SET_CONTRACT $_nPSoapStructPN_SET_CONTRACT
	 * @return NPSoapStructPN_SET_CONTRACTResponse
	 */
	public function PN_SET_CONTRACT(NPSoapStructPN_SET_CONTRACT $_nPSoapStructPN_SET_CONTRACT)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_CONTRACTResponse(self::getSoapClient()->PN_SET_CONTRACT(array('integration_id'=>$_nPSoapStructPN_SET_CONTRACT->getIntegration_id(),'contracts'=>$_nPSoapStructPN_SET_CONTRACT->getContracts()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_JOBTYPE
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_JOBTYPE::getIntegration_id()
	 * @uses NPSoapStructPN_SET_JOBTYPE::getJobtypes()
	 * @param NPSoapStructPN_SET_JOBTYPE $_nPSoapStructPN_SET_JOBTYPE
	 * @return NPSoapStructPN_SET_JOBTYPEResponse
	 */
	public function PN_SET_JOBTYPE(NPSoapStructPN_SET_JOBTYPE $_nPSoapStructPN_SET_JOBTYPE)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_JOBTYPEResponse(self::getSoapClient()->PN_SET_JOBTYPE(array('integration_id'=>$_nPSoapStructPN_SET_JOBTYPE->getIntegration_id(),'jobtypes'=>$_nPSoapStructPN_SET_JOBTYPE->getJobtypes()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_JOBPHASE
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_JOBPHASE::getIntegration_id()
	 * @uses NPSoapStructPN_SET_JOBPHASE::getJobphases()
	 * @param NPSoapStructPN_SET_JOBPHASE $_nPSoapStructPN_SET_JOBPHASE
	 * @return NPSoapStructPN_SET_JOBPHASEResponse
	 */
	public function PN_SET_JOBPHASE(NPSoapStructPN_SET_JOBPHASE $_nPSoapStructPN_SET_JOBPHASE)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_JOBPHASEResponse(self::getSoapClient()->PN_SET_JOBPHASE(array('integration_id'=>$_nPSoapStructPN_SET_JOBPHASE->getIntegration_id(),'jobphases'=>$_nPSoapStructPN_SET_JOBPHASE->getJobphases()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_PURCHASEORDERS_CONFIRM
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_PURCHASEORDERS_CONFIRM::getIntegration_id()
	 * @uses NPSoapStructPN_SET_PURCHASEORDERS_CONFIRM::getActuals()
	 * @param NPSoapStructPN_SET_PURCHASEORDERS_CONFIRM $_nPSoapStructPN_SET_PURCHASEORDERS_CONFIRM
	 * @return NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResponse
	 */
	public function PN_SET_PURCHASEORDERS_CONFIRM(NPSoapStructPN_SET_PURCHASEORDERS_CONFIRM $_nPSoapStructPN_SET_PURCHASEORDERS_CONFIRM)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResponse(self::getSoapClient()->PN_SET_PURCHASEORDERS_CONFIRM(array('integration_id'=>$_nPSoapStructPN_SET_PURCHASEORDERS_CONFIRM->getIntegration_id(),'actuals'=>$_nPSoapStructPN_SET_PURCHASEORDERS_CONFIRM->getActuals()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_POITEMS_CONFIRM
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_POITEMS_CONFIRM::getIntegration_id()
	 * @uses NPSoapStructPN_SET_POITEMS_CONFIRM::getActuals()
	 * @param NPSoapStructPN_SET_POITEMS_CONFIRM $_nPSoapStructPN_SET_POITEMS_CONFIRM
	 * @return NPSoapStructPN_SET_POITEMS_CONFIRMResponse
	 */
	public function PN_SET_POITEMS_CONFIRM(NPSoapStructPN_SET_POITEMS_CONFIRM $_nPSoapStructPN_SET_POITEMS_CONFIRM)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_POITEMS_CONFIRMResponse(self::getSoapClient()->PN_SET_POITEMS_CONFIRM(array('integration_id'=>$_nPSoapStructPN_SET_POITEMS_CONFIRM->getIntegration_id(),'actuals'=>$_nPSoapStructPN_SET_POITEMS_CONFIRM->getActuals()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_RECEIPTS_CONFIRM
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_RECEIPTS_CONFIRM::getIntegration_id()
	 * @uses NPSoapStructPN_SET_RECEIPTS_CONFIRM::getActuals()
	 * @param NPSoapStructPN_SET_RECEIPTS_CONFIRM $_nPSoapStructPN_SET_RECEIPTS_CONFIRM
	 * @return NPSoapStructPN_SET_RECEIPTS_CONFIRMResponse
	 */
	public function PN_SET_RECEIPTS_CONFIRM(NPSoapStructPN_SET_RECEIPTS_CONFIRM $_nPSoapStructPN_SET_RECEIPTS_CONFIRM)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_RECEIPTS_CONFIRMResponse(self::getSoapClient()->PN_SET_RECEIPTS_CONFIRM(array('integration_id'=>$_nPSoapStructPN_SET_RECEIPTS_CONFIRM->getIntegration_id(),'actuals'=>$_nPSoapStructPN_SET_RECEIPTS_CONFIRM->getActuals()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_RECEIPTITEMS_CONFIRM
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_RECEIPTITEMS_CONFIRM::getIntegration_id()
	 * @uses NPSoapStructPN_SET_RECEIPTITEMS_CONFIRM::getActuals()
	 * @param NPSoapStructPN_SET_RECEIPTITEMS_CONFIRM $_nPSoapStructPN_SET_RECEIPTITEMS_CONFIRM
	 * @return NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResponse
	 */
	public function PN_SET_RECEIPTITEMS_CONFIRM(NPSoapStructPN_SET_RECEIPTITEMS_CONFIRM $_nPSoapStructPN_SET_RECEIPTITEMS_CONFIRM)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResponse(self::getSoapClient()->PN_SET_RECEIPTITEMS_CONFIRM(array('integration_id'=>$_nPSoapStructPN_SET_RECEIPTITEMS_CONFIRM->getIntegration_id(),'actuals'=>$_nPSoapStructPN_SET_RECEIPTITEMS_CONFIRM->getActuals()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_INVOICES_POSTED
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_INVOICES_POSTED::getIntegration_id()
	 * @uses NPSoapStructPN_SET_INVOICES_POSTED::getInvoiceposted()
	 * @param NPSoapStructPN_SET_INVOICES_POSTED $_nPSoapStructPN_SET_INVOICES_POSTED
	 * @return NPSoapStructPN_SET_INVOICES_POSTEDResponse
	 */
	public function PN_SET_INVOICES_POSTED(NPSoapStructPN_SET_INVOICES_POSTED $_nPSoapStructPN_SET_INVOICES_POSTED)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_INVOICES_POSTEDResponse(self::getSoapClient()->PN_SET_INVOICES_POSTED(array('integration_id'=>$_nPSoapStructPN_SET_INVOICES_POSTED->getIntegration_id(),'invoiceposted'=>$_nPSoapStructPN_SET_INVOICES_POSTED->getInvoiceposted()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_INVOICEPAYMENTS
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_INVOICEPAYMENTS::getIntegration_id()
	 * @uses NPSoapStructPN_SET_INVOICEPAYMENTS::getInvoicepayment()
	 * @param NPSoapStructPN_SET_INVOICEPAYMENTS $_nPSoapStructPN_SET_INVOICEPAYMENTS
	 * @return NPSoapStructPN_SET_INVOICEPAYMENTSResponse
	 */
	public function PN_SET_INVOICEPAYMENTS(NPSoapStructPN_SET_INVOICEPAYMENTS $_nPSoapStructPN_SET_INVOICEPAYMENTS)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_INVOICEPAYMENTSResponse(self::getSoapClient()->PN_SET_INVOICEPAYMENTS(array('integration_id'=>$_nPSoapStructPN_SET_INVOICEPAYMENTS->getIntegration_id(),'invoicepayment'=>$_nPSoapStructPN_SET_INVOICEPAYMENTS->getInvoicepayment()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_VENDOR_INSURANCE
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_VENDOR_INSURANCE::getIntegration_id()
	 * @uses NPSoapStructPN_SET_VENDOR_INSURANCE::getInvoicepayment()
	 * @param NPSoapStructPN_SET_VENDOR_INSURANCE $_nPSoapStructPN_SET_VENDOR_INSURANCE
	 * @return NPSoapStructPN_SET_VENDOR_INSURANCEResponse
	 */
	public function PN_SET_VENDOR_INSURANCE(NPSoapStructPN_SET_VENDOR_INSURANCE $_nPSoapStructPN_SET_VENDOR_INSURANCE)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_VENDOR_INSURANCEResponse(self::getSoapClient()->PN_SET_VENDOR_INSURANCE(array('integration_id'=>$_nPSoapStructPN_SET_VENDOR_INSURANCE->getIntegration_id(),'invoicepayment'=>$_nPSoapStructPN_SET_VENDOR_INSURANCE->getInvoicepayment()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_VENDOR_INSURANCE_CONFIRM
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRM::getIntegration_id()
	 * @uses NPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRM::getInvoicepayment()
	 * @param NPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRM $_nPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRM
	 * @return NPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRMResponse
	 */
	public function PN_SET_VENDOR_INSURANCE_CONFIRM(NPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRM $_nPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRM)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRMResponse(self::getSoapClient()->PN_SET_VENDOR_INSURANCE_CONFIRM(array('integration_id'=>$_nPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRM->getIntegration_id(),'invoicepayment'=>$_nPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRM->getInvoicepayment()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_INVOICEITEMS
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_INVOICEITEMS::getIntegration_id()
	 * @uses NPSoapStructPN_SET_INVOICEITEMS::getInvoiceitems()
	 * @param NPSoapStructPN_SET_INVOICEITEMS $_nPSoapStructPN_SET_INVOICEITEMS
	 * @return NPSoapStructPN_SET_INVOICEITEMSResponse
	 */
	public function PN_SET_INVOICEITEMS(NPSoapStructPN_SET_INVOICEITEMS $_nPSoapStructPN_SET_INVOICEITEMS)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_INVOICEITEMSResponse(self::getSoapClient()->PN_SET_INVOICEITEMS(array('integration_id'=>$_nPSoapStructPN_SET_INVOICEITEMS->getIntegration_id(),'invoiceitems'=>$_nPSoapStructPN_SET_INVOICEITEMS->getInvoiceitems()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_INVOICES
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_INVOICES::getIntegration_id()
	 * @uses NPSoapStructPN_SET_INVOICES::getInvoices()
	 * @param NPSoapStructPN_SET_INVOICES $_nPSoapStructPN_SET_INVOICES
	 * @return NPSoapStructPN_SET_INVOICESResponse
	 */
	public function PN_SET_INVOICES(NPSoapStructPN_SET_INVOICES $_nPSoapStructPN_SET_INVOICES)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_INVOICESResponse(self::getSoapClient()->PN_SET_INVOICES(array('integration_id'=>$_nPSoapStructPN_SET_INVOICES->getIntegration_id(),'invoices'=>$_nPSoapStructPN_SET_INVOICES->getInvoices()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_GLACCOUNT
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_GLACCOUNT::getIntegration_id()
	 * @uses NPSoapStructPN_SET_GLACCOUNT::getGlaccount()
	 * @param NPSoapStructPN_SET_GLACCOUNT $_nPSoapStructPN_SET_GLACCOUNT
	 * @return NPSoapStructPN_SET_GLACCOUNTResponse
	 */
	public function PN_SET_GLACCOUNT(NPSoapStructPN_SET_GLACCOUNT $_nPSoapStructPN_SET_GLACCOUNT)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_GLACCOUNTResponse(self::getSoapClient()->PN_SET_GLACCOUNT(array('integration_id'=>$_nPSoapStructPN_SET_GLACCOUNT->getIntegration_id(),'glaccount'=>$_nPSoapStructPN_SET_GLACCOUNT->getGlaccount()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_VENDORCOMBO
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_VENDORCOMBO::getIntegration_id()
	 * @uses NPSoapStructPN_SET_VENDORCOMBO::getVendorcombo()
	 * @param NPSoapStructPN_SET_VENDORCOMBO $_nPSoapStructPN_SET_VENDORCOMBO
	 * @return NPSoapStructPN_SET_VENDORCOMBOResponse
	 */
	public function PN_SET_VENDORCOMBO(NPSoapStructPN_SET_VENDORCOMBO $_nPSoapStructPN_SET_VENDORCOMBO)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_VENDORCOMBOResponse(self::getSoapClient()->PN_SET_VENDORCOMBO(array('integration_id'=>$_nPSoapStructPN_SET_VENDORCOMBO->getIntegration_id(),'vendorcombo'=>$_nPSoapStructPN_SET_VENDORCOMBO->getVendorcombo()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_DATA
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_DATA::getIntegration_id()
	 * @uses NPSoapStructPN_SET_DATA::getData()
	 * @uses NPSoapStructPN_SET_DATA::getDatatype()
	 * @param NPSoapStructPN_SET_DATA $_nPSoapStructPN_SET_DATA
	 * @return NPSoapStructPN_SET_DATAResponse
	 */
	public function PN_SET_DATA(NPSoapStructPN_SET_DATA $_nPSoapStructPN_SET_DATA)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_DATAResponse(self::getSoapClient()->PN_SET_DATA(array('integration_id'=>$_nPSoapStructPN_SET_DATA->getIntegration_id(),'data'=>$_nPSoapStructPN_SET_DATA->getData(),'datatype'=>$_nPSoapStructPN_SET_DATA->getDatatype()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_BUDGET
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_BUDGET::getIntegration_id()
	 * @uses NPSoapStructPN_SET_BUDGET::getBudgets()
	 * @param NPSoapStructPN_SET_BUDGET $_nPSoapStructPN_SET_BUDGET
	 * @return NPSoapStructPN_SET_BUDGETResponse
	 */
	public function PN_SET_BUDGET(NPSoapStructPN_SET_BUDGET $_nPSoapStructPN_SET_BUDGET)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_BUDGETResponse(self::getSoapClient()->PN_SET_BUDGET(array('integration_id'=>$_nPSoapStructPN_SET_BUDGET->getIntegration_id(),'budgets'=>$_nPSoapStructPN_SET_BUDGET->getBudgets()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_ACTUAL
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_ACTUAL::getIntegration_id()
	 * @uses NPSoapStructPN_SET_ACTUAL::getActuals()
	 * @param NPSoapStructPN_SET_ACTUAL $_nPSoapStructPN_SET_ACTUAL
	 * @return NPSoapStructPN_SET_ACTUALResponse
	 */
	public function PN_SET_ACTUAL(NPSoapStructPN_SET_ACTUAL $_nPSoapStructPN_SET_ACTUAL)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_ACTUALResponse(self::getSoapClient()->PN_SET_ACTUAL(array('integration_id'=>$_nPSoapStructPN_SET_ACTUAL->getIntegration_id(),'actuals'=>$_nPSoapStructPN_SET_ACTUAL->getActuals()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_SCHEDULER
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_SCHEDULER::getSchedule()
	 * @uses NPSoapStructPN_SET_SCHEDULER::getStatuslog()
	 * @param NPSoapStructPN_SET_SCHEDULER $_nPSoapStructPN_SET_SCHEDULER
	 * @return NPSoapStructPN_SET_SCHEDULERResponse
	 */
	public function PN_SET_SCHEDULER(NPSoapStructPN_SET_SCHEDULER $_nPSoapStructPN_SET_SCHEDULER)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_SCHEDULERResponse(self::getSoapClient()->PN_SET_SCHEDULER(array('schedule'=>$_nPSoapStructPN_SET_SCHEDULER->getSchedule(),'statuslog'=>$_nPSoapStructPN_SET_SCHEDULER->getStatuslog()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_JOBCODES
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_JOBCODES::getIntegration_id()
	 * @uses NPSoapStructPN_SET_JOBCODES::getJobcodes()
	 * @param NPSoapStructPN_SET_JOBCODES $_nPSoapStructPN_SET_JOBCODES
	 * @return NPSoapStructPN_SET_JOBCODESResponse
	 */
	public function PN_SET_JOBCODES(NPSoapStructPN_SET_JOBCODES $_nPSoapStructPN_SET_JOBCODES)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_JOBCODESResponse(self::getSoapClient()->PN_SET_JOBCODES(array('integration_id'=>$_nPSoapStructPN_SET_JOBCODES->getIntegration_id(),'jobcodes'=>$_nPSoapStructPN_SET_JOBCODES->getJobcodes()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_SET_ERRORCODES
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_SET_ERRORCODES::getIntegration_id()
	 * @uses NPSoapStructPN_SET_ERRORCODES::getErrCodes()
	 * @param NPSoapStructPN_SET_ERRORCODES $_nPSoapStructPN_SET_ERRORCODES
	 * @return NPSoapStructPN_SET_ERRORCODESResponse
	 */
	public function PN_SET_ERRORCODES(NPSoapStructPN_SET_ERRORCODES $_nPSoapStructPN_SET_ERRORCODES)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_SET_ERRORCODESResponse(self::getSoapClient()->PN_SET_ERRORCODES(array('integration_id'=>$_nPSoapStructPN_SET_ERRORCODES->getIntegration_id(),'ErrCodes'=>$_nPSoapStructPN_SET_ERRORCODES->getErrCodes()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_INVOICEITEMS
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_INVOICEITEMS::getIntegrationPackageId()
	 * @param NPSoapStructPN_GET_INVOICEITEMS $_nPSoapStructPN_GET_INVOICEITEMS
	 * @return NPSoapStructPN_GET_INVOICEITEMSResponse
	 */
	public function PN_GET_INVOICEITEMS(NPSoapStructPN_GET_INVOICEITEMS $_nPSoapStructPN_GET_INVOICEITEMS)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_INVOICEITEMSResponse(self::getSoapClient()->PN_GET_INVOICEITEMS(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_INVOICEITEMS->getIntegrationPackageId()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_INVOICES
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_INVOICES::getIntegrationPackageId()
	 * @param NPSoapStructPN_GET_INVOICES $_nPSoapStructPN_GET_INVOICES
	 * @return NPSoapStructPN_GET_INVOICESResponse
	 */
	public function PN_GET_INVOICES(NPSoapStructPN_GET_INVOICES $_nPSoapStructPN_GET_INVOICES)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_INVOICESResponse(self::getSoapClient()->PN_GET_INVOICES(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_INVOICES->getIntegrationPackageId()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_PURCHASEORDERS
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_PURCHASEORDERS::getIntegrationPackageId()
	 * @param NPSoapStructPN_GET_PURCHASEORDERS $_nPSoapStructPN_GET_PURCHASEORDERS
	 * @return NPSoapStructPN_GET_PURCHASEORDERSResponse
	 */
	public function PN_GET_PURCHASEORDERS(NPSoapStructPN_GET_PURCHASEORDERS $_nPSoapStructPN_GET_PURCHASEORDERS)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_PURCHASEORDERSResponse(self::getSoapClient()->PN_GET_PURCHASEORDERS(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_PURCHASEORDERS->getIntegrationPackageId()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_POITEMS
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_POITEMS::getIntegrationPackageId()
	 * @param NPSoapStructPN_GET_POITEMS $_nPSoapStructPN_GET_POITEMS
	 * @return NPSoapStructPN_GET_POITEMSResponse
	 */
	public function PN_GET_POITEMS(NPSoapStructPN_GET_POITEMS $_nPSoapStructPN_GET_POITEMS)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_POITEMSResponse(self::getSoapClient()->PN_GET_POITEMS(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_POITEMS->getIntegrationPackageId()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_RECEIPTS
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_RECEIPTS::getIntegrationPackageId()
	 * @param NPSoapStructPN_GET_RECEIPTS $_nPSoapStructPN_GET_RECEIPTS
	 * @return NPSoapStructPN_GET_RECEIPTSResponse
	 */
	public function PN_GET_RECEIPTS(NPSoapStructPN_GET_RECEIPTS $_nPSoapStructPN_GET_RECEIPTS)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_RECEIPTSResponse(self::getSoapClient()->PN_GET_RECEIPTS(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_RECEIPTS->getIntegrationPackageId()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_RCTITEMS
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_RCTITEMS::getIntegrationPackageId()
	 * @param NPSoapStructPN_GET_RCTITEMS $_nPSoapStructPN_GET_RCTITEMS
	 * @return NPSoapStructPN_GET_RCTITEMSResponse
	 */
	public function PN_GET_RCTITEMS(NPSoapStructPN_GET_RCTITEMS $_nPSoapStructPN_GET_RCTITEMS)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_RCTITEMSResponse(self::getSoapClient()->PN_GET_RCTITEMS(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_RCTITEMS->getIntegrationPackageId()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_VENDORS
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_VENDORS::getIntegrationPackageId()
	 * @param NPSoapStructPN_GET_VENDORS $_nPSoapStructPN_GET_VENDORS
	 * @return NPSoapStructPN_GET_VENDORSResponse
	 */
	public function PN_GET_VENDORS(NPSoapStructPN_GET_VENDORS $_nPSoapStructPN_GET_VENDORS)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_VENDORSResponse(self::getSoapClient()->PN_GET_VENDORS(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_VENDORS->getIntegrationPackageId()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_KOFAX_PROPERTY
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_KOFAX_PROPERTY::getIntegrationPackageId()
	 * @param NPSoapStructPN_GET_KOFAX_PROPERTY $_nPSoapStructPN_GET_KOFAX_PROPERTY
	 * @return NPSoapStructPN_GET_KOFAX_PROPERTYResponse
	 */
	public function PN_GET_KOFAX_PROPERTY(NPSoapStructPN_GET_KOFAX_PROPERTY $_nPSoapStructPN_GET_KOFAX_PROPERTY)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_KOFAX_PROPERTYResponse(self::getSoapClient()->PN_GET_KOFAX_PROPERTY(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_KOFAX_PROPERTY->getIntegrationPackageId()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_KOFAX_VENDORS
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_KOFAX_VENDORS::getIntegrationPackageId()
	 * @param NPSoapStructPN_GET_KOFAX_VENDORS $_nPSoapStructPN_GET_KOFAX_VENDORS
	 * @return NPSoapStructPN_GET_KOFAX_VENDORSResponse
	 */
	public function PN_GET_KOFAX_VENDORS(NPSoapStructPN_GET_KOFAX_VENDORS $_nPSoapStructPN_GET_KOFAX_VENDORS)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_KOFAX_VENDORSResponse(self::getSoapClient()->PN_GET_KOFAX_VENDORS(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_KOFAX_VENDORS->getIntegrationPackageId()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_VENDOR_INSURANCE
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_VENDOR_INSURANCE::getIntegrationPackageId()
	 * @param NPSoapStructPN_GET_VENDOR_INSURANCE $_nPSoapStructPN_GET_VENDOR_INSURANCE
	 * @return NPSoapStructPN_GET_VENDOR_INSURANCEResponse
	 */
	public function PN_GET_VENDOR_INSURANCE(NPSoapStructPN_GET_VENDOR_INSURANCE $_nPSoapStructPN_GET_VENDOR_INSURANCE)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_VENDOR_INSURANCEResponse(self::getSoapClient()->PN_GET_VENDOR_INSURANCE(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_VENDOR_INSURANCE->getIntegrationPackageId()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_SCHEDULER
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_SCHEDULER::getIntegrationPackageId()
	 * @param NPSoapStructPN_GET_SCHEDULER $_nPSoapStructPN_GET_SCHEDULER
	 * @return NPSoapStructPN_GET_SCHEDULERResponse
	 */
	public function PN_GET_SCHEDULER(NPSoapStructPN_GET_SCHEDULER $_nPSoapStructPN_GET_SCHEDULER)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_SCHEDULERResponse(self::getSoapClient()->PN_GET_SCHEDULER(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_SCHEDULER->getIntegrationPackageId()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_SCHEDULER_CUSTOM
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_SCHEDULER_CUSTOM::getIntegrationPackageId()
	 * @uses NPSoapStructPN_GET_SCHEDULER_CUSTOM::getTablename()
	 * @param NPSoapStructPN_GET_SCHEDULER_CUSTOM $_nPSoapStructPN_GET_SCHEDULER_CUSTOM
	 * @return NPSoapStructPN_GET_SCHEDULER_CUSTOMResponse
	 */
	public function PN_GET_SCHEDULER_CUSTOM(NPSoapStructPN_GET_SCHEDULER_CUSTOM $_nPSoapStructPN_GET_SCHEDULER_CUSTOM)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_SCHEDULER_CUSTOMResponse(self::getSoapClient()->PN_GET_SCHEDULER_CUSTOM(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_SCHEDULER_CUSTOM->getIntegrationPackageId(),'tablename'=>$_nPSoapStructPN_GET_SCHEDULER_CUSTOM->getTablename()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_VENDORCOMBO_CONFIRM
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_VENDORCOMBO_CONFIRM::getIntegration_id()
	 * @uses NPSoapStructPN_GET_VENDORCOMBO_CONFIRM::getVendorconfirmlist()
	 * @param NPSoapStructPN_GET_VENDORCOMBO_CONFIRM $_nPSoapStructPN_GET_VENDORCOMBO_CONFIRM
	 * @return NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResponse
	 */
	public function PN_GET_VENDORCOMBO_CONFIRM(NPSoapStructPN_GET_VENDORCOMBO_CONFIRM $_nPSoapStructPN_GET_VENDORCOMBO_CONFIRM)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResponse(self::getSoapClient()->PN_GET_VENDORCOMBO_CONFIRM(array('integration_id'=>$_nPSoapStructPN_GET_VENDORCOMBO_CONFIRM->getIntegration_id(),'vendorconfirmlist'=>$_nPSoapStructPN_GET_VENDORCOMBO_CONFIRM->getVendorconfirmlist()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_INVOICES_CONFIRM
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_INVOICES_CONFIRM::getIntegration_id()
	 * @uses NPSoapStructPN_GET_INVOICES_CONFIRM::getInvoiceconfirmlist()
	 * @param NPSoapStructPN_GET_INVOICES_CONFIRM $_nPSoapStructPN_GET_INVOICES_CONFIRM
	 * @return NPSoapStructPN_GET_INVOICES_CONFIRMResponse
	 */
	public function PN_GET_INVOICES_CONFIRM(NPSoapStructPN_GET_INVOICES_CONFIRM $_nPSoapStructPN_GET_INVOICES_CONFIRM)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_INVOICES_CONFIRMResponse(self::getSoapClient()->PN_GET_INVOICES_CONFIRM(array('integration_id'=>$_nPSoapStructPN_GET_INVOICES_CONFIRM->getIntegration_id(),'invoiceconfirmlist'=>$_nPSoapStructPN_GET_INVOICES_CONFIRM->getInvoiceconfirmlist()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_GET_DATA
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_GET_DATA::getIntegrationPackageId()
	 * @uses NPSoapStructPN_GET_DATA::getDatatype()
	 * @param NPSoapStructPN_GET_DATA $_nPSoapStructPN_GET_DATA
	 * @return NPSoapStructPN_GET_DATAResponse
	 */
	public function PN_GET_DATA(NPSoapStructPN_GET_DATA $_nPSoapStructPN_GET_DATA)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_GET_DATAResponse(self::getSoapClient()->PN_GET_DATA(array('IntegrationPackageId'=>$_nPSoapStructPN_GET_DATA->getIntegrationPackageId(),'datatype'=>$_nPSoapStructPN_GET_DATA->getDatatype()))));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_FINALIZE_JOBCOSTING
	 * Meta informations extracted from the WSDL
	 * - SOAPHeaderNames : SecurityHeader
	 * - SOAPHeaderNamespaces : http://tempuri.org/
	 * - SOAPHeaderTypes : {@link NPSoapStructSecurityHeader}
	 * - SOAPHeaders : required
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @return NPSoapStructPN_FINALIZE_JOBCOSTINGResponse
	 */
	public function PN_FINALIZE_JOBCOSTING()
	{
		try
		{
			$this->setResult(new NPSoapStructPN_FINALIZE_JOBCOSTINGResponse(self::getSoapClient()->PN_FINALIZE_JOBCOSTING()));
		}
		catch(SoapFault $soapFault)
		{
			return !$this->saveLastError(__METHOD__,$soapFault);
		}
		return $this->getResult();
	}
	/**
	 * Method to call the operation originally named PN_VALIDATE_XML
	 * @uses NPSoapWsdlClass::getSoapClient()
	 * @uses NPSoapWsdlClass::setResult()
	 * @uses NPSoapWsdlClass::getResult()
	 * @uses NPSoapWsdlClass::saveLastError()
	 * @uses NPSoapStructPN_VALIDATE_XML::getXml()
	 * @uses NPSoapStructPN_VALIDATE_XML::getMethodname()
	 * @param NPSoapStructPN_VALIDATE_XML $_nPSoapStructPN_VALIDATE_XML
	 * @return NPSoapStructPN_VALIDATE_XMLResponse
	 */
	public function PN_VALIDATE_XML(NPSoapStructPN_VALIDATE_XML $_nPSoapStructPN_VALIDATE_XML)
	{
		try
		{
			$this->setResult(new NPSoapStructPN_VALIDATE_XMLResponse(self::getSoapClient()->PN_VALIDATE_XML(array('xml'=>$_nPSoapStructPN_VALIDATE_XML->getXml(),'methodname'=>$_nPSoapStructPN_VALIDATE_XML->getMethodname()))));
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
	 * @return NPSoapStructPN_FINALIZE_JOBCOSTINGResponse|NPSoapStructPN_GET_DATAResponse|NPSoapStructPN_GET_INVOICEITEMSResponse|NPSoapStructPN_GET_INVOICESResponse|NPSoapStructPN_GET_INVOICES_CONFIRMResponse|NPSoapStructPN_GET_KOFAX_PROPERTYResponse|NPSoapStructPN_GET_KOFAX_VENDORSResponse|NPSoapStructPN_GET_POITEMSResponse|NPSoapStructPN_GET_PURCHASEORDERSResponse|NPSoapStructPN_GET_RCTITEMSResponse|NPSoapStructPN_GET_RECEIPTSResponse|NPSoapStructPN_GET_SCHEDULERResponse|NPSoapStructPN_GET_SCHEDULER_CUSTOMResponse|NPSoapStructPN_GET_VENDORCOMBO_CONFIRMResponse|NPSoapStructPN_GET_VENDORSResponse|NPSoapStructPN_GET_VENDOR_INSURANCEResponse|NPSoapStructPN_SAVE_QUERY_RESULTResponse|NPSoapStructPN_SET_ACTUALResponse|NPSoapStructPN_SET_BUDGETResponse|NPSoapStructPN_SET_CHANGEORDERResponse|NPSoapStructPN_SET_CONTRACTBUDGETResponse|NPSoapStructPN_SET_CONTRACTResponse|NPSoapStructPN_SET_COSTCODEResponse|NPSoapStructPN_SET_DATAResponse|NPSoapStructPN_SET_ERRORCODESResponse|NPSoapStructPN_SET_GLACCOUNTResponse|NPSoapStructPN_SET_INVOICEITEMSResponse|NPSoapStructPN_SET_INVOICEPAYMENTSResponse|NPSoapStructPN_SET_INVOICESResponse|NPSoapStructPN_SET_INVOICES_POSTEDResponse|NPSoapStructPN_SET_JOBCODEResponse|NPSoapStructPN_SET_JOBCODESResponse|NPSoapStructPN_SET_JOBPHASEResponse|NPSoapStructPN_SET_JOBTYPEResponse|NPSoapStructPN_SET_KOFAX_PROPERTYResponse|NPSoapStructPN_SET_KOFAX_VENDORResponse|NPSoapStructPN_SET_PHASECODEResponse|NPSoapStructPN_SET_POITEMS_CONFIRMResponse|NPSoapStructPN_SET_PURCHASEORDERS_CONFIRMResponse|NPSoapStructPN_SET_RECEIPTITEMS_CONFIRMResponse|NPSoapStructPN_SET_RECEIPTS_CONFIRMResponse|NPSoapStructPN_SET_SCHEDULERResponse|NPSoapStructPN_SET_VENDORCOMBOResponse|NPSoapStructPN_SET_VENDOR_INSURANCEResponse|NPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRMResponse|NPSoapStructPN_VALIDATE_XMLResponse
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