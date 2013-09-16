<?php
/**
 * Test with NPSoap
 * @package NPSoap
 * @author Mikaël DELSOL <contact@wsdltophp.com>
 * @version 20130912-01
 * @date 2013-09-16
 */
ini_set('memory_limit','512M');
ini_set('display_errors', true);
error_reporting(-1);
/**
 * Load autoload
 */
require_once dirname(__FILE__) . '/NPSoapAutoload.php';
/**
 * NPSoap Informations
 */
define('NPSOAP_WSDL_URL','http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?wsdl');
define('NPSOAP_USER_LOGIN','');
define('NPSOAP_USER_PASSWORD','');
/**
 * Wsdl instanciation infos
 */
$wsdl = array();
$wsdl[NPSoapWsdlClass::WSDL_URL] = NPSOAP_WSDL_URL;
$wsdl[NPSoapWsdlClass::WSDL_CACHE_WSDL] = WSDL_CACHE_NONE;
$wsdl[NPSoapWsdlClass::WSDL_TRACE] = true;
if(NPSOAP_USER_LOGIN !== '')
	$wsdl[NPSoapWsdlClass::WSDL_LOGIN] = NPSOAP_USER_LOGIN;
if(NPSOAP_USER_PASSWORD !== '')
	$wsdl[NPSoapWsdlClass::WSDL_PASSWD] = NPSOAP_USER_PASSWORD;
// etc....
/**
 * Examples
 */


/********************************
 * Example for NPSoapServiceLogin
 */
$nPSoapServiceLogin = new NPSoapServiceLogin($wsdl);
// sample call for NPSoapServiceLogin::Login()
if($nPSoapServiceLogin->Login(new NPSoapStructLogin(/*** update parameters list ***/)))
	print_r($nPSoapServiceLogin->getResult());
else
	print_r($nPSoapServiceLogin->getLastError());

/*****************************
 * Example for NPSoapServicePN
 */
$nPSoapServicePN = new NPSoapServicePN($wsdl);
// sample call for NPSoapServicePN::setSoapHeaderSecurityHeader() in order to initialize required SoapHeader
$nPSoapServicePN->setSoapHeaderSecurityHeader(new NPSoapStructSecurityHeader(/*** update parameters list ***/));
// sample call for NPSoapServicePN::PN_SET_PHASECODE()
if($nPSoapServicePN->PN_SET_PHASECODE(new NPSoapStructPN_SET_PHASECODE(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_CHANGEORDER()
if($nPSoapServicePN->PN_SET_CHANGEORDER(new NPSoapStructPN_SET_CHANGEORDER(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_KOFAX_VENDOR()
if($nPSoapServicePN->PN_SET_KOFAX_VENDOR(new NPSoapStructPN_SET_KOFAX_VENDOR(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_KOFAX_PROPERTY()
if($nPSoapServicePN->PN_SET_KOFAX_PROPERTY(new NPSoapStructPN_SET_KOFAX_PROPERTY(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_JOBCODE()
if($nPSoapServicePN->PN_SET_JOBCODE(new NPSoapStructPN_SET_JOBCODE(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SAVE_QUERY_RESULT()
if($nPSoapServicePN->PN_SAVE_QUERY_RESULT(new NPSoapStructPN_SAVE_QUERY_RESULT(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_COSTCODE()
if($nPSoapServicePN->PN_SET_COSTCODE(new NPSoapStructPN_SET_COSTCODE(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_CONTRACTBUDGET()
if($nPSoapServicePN->PN_SET_CONTRACTBUDGET(new NPSoapStructPN_SET_CONTRACTBUDGET(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_CONTRACT()
if($nPSoapServicePN->PN_SET_CONTRACT(new NPSoapStructPN_SET_CONTRACT(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_JOBTYPE()
if($nPSoapServicePN->PN_SET_JOBTYPE(new NPSoapStructPN_SET_JOBTYPE(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_JOBPHASE()
if($nPSoapServicePN->PN_SET_JOBPHASE(new NPSoapStructPN_SET_JOBPHASE(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_PURCHASEORDERS_CONFIRM()
if($nPSoapServicePN->PN_SET_PURCHASEORDERS_CONFIRM(new NPSoapStructPN_SET_PURCHASEORDERS_CONFIRM(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_POITEMS_CONFIRM()
if($nPSoapServicePN->PN_SET_POITEMS_CONFIRM(new NPSoapStructPN_SET_POITEMS_CONFIRM(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_RECEIPTS_CONFIRM()
if($nPSoapServicePN->PN_SET_RECEIPTS_CONFIRM(new NPSoapStructPN_SET_RECEIPTS_CONFIRM(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_RECEIPTITEMS_CONFIRM()
if($nPSoapServicePN->PN_SET_RECEIPTITEMS_CONFIRM(new NPSoapStructPN_SET_RECEIPTITEMS_CONFIRM(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_INVOICES_POSTED()
if($nPSoapServicePN->PN_SET_INVOICES_POSTED(new NPSoapStructPN_SET_INVOICES_POSTED(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_INVOICEPAYMENTS()
if($nPSoapServicePN->PN_SET_INVOICEPAYMENTS(new NPSoapStructPN_SET_INVOICEPAYMENTS(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_VENDOR_INSURANCE()
if($nPSoapServicePN->PN_SET_VENDOR_INSURANCE(new NPSoapStructPN_SET_VENDOR_INSURANCE(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_VENDOR_INSURANCE_CONFIRM()
if($nPSoapServicePN->PN_SET_VENDOR_INSURANCE_CONFIRM(new NPSoapStructPN_SET_VENDOR_INSURANCE_CONFIRM(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_INVOICEITEMS()
if($nPSoapServicePN->PN_SET_INVOICEITEMS(new NPSoapStructPN_SET_INVOICEITEMS(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_INVOICES()
if($nPSoapServicePN->PN_SET_INVOICES(new NPSoapStructPN_SET_INVOICES(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_GLACCOUNT()
if($nPSoapServicePN->PN_SET_GLACCOUNT(new NPSoapStructPN_SET_GLACCOUNT(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_VENDORCOMBO()
if($nPSoapServicePN->PN_SET_VENDORCOMBO(new NPSoapStructPN_SET_VENDORCOMBO(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_DATA()
if($nPSoapServicePN->PN_SET_DATA(new NPSoapStructPN_SET_DATA(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_BUDGET()
if($nPSoapServicePN->PN_SET_BUDGET(new NPSoapStructPN_SET_BUDGET(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_ACTUAL()
if($nPSoapServicePN->PN_SET_ACTUAL(new NPSoapStructPN_SET_ACTUAL(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_SCHEDULER()
if($nPSoapServicePN->PN_SET_SCHEDULER(new NPSoapStructPN_SET_SCHEDULER(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_JOBCODES()
if($nPSoapServicePN->PN_SET_JOBCODES(new NPSoapStructPN_SET_JOBCODES(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_SET_ERRORCODES()
if($nPSoapServicePN->PN_SET_ERRORCODES(new NPSoapStructPN_SET_ERRORCODES(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_INVOICEITEMS()
if($nPSoapServicePN->PN_GET_INVOICEITEMS(new NPSoapStructPN_GET_INVOICEITEMS(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_INVOICES()
if($nPSoapServicePN->PN_GET_INVOICES(new NPSoapStructPN_GET_INVOICES(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_PURCHASEORDERS()
if($nPSoapServicePN->PN_GET_PURCHASEORDERS(new NPSoapStructPN_GET_PURCHASEORDERS(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_POITEMS()
if($nPSoapServicePN->PN_GET_POITEMS(new NPSoapStructPN_GET_POITEMS(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_RECEIPTS()
if($nPSoapServicePN->PN_GET_RECEIPTS(new NPSoapStructPN_GET_RECEIPTS(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_RCTITEMS()
if($nPSoapServicePN->PN_GET_RCTITEMS(new NPSoapStructPN_GET_RCTITEMS(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_VENDORS()
if($nPSoapServicePN->PN_GET_VENDORS(new NPSoapStructPN_GET_VENDORS(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_KOFAX_PROPERTY()
if($nPSoapServicePN->PN_GET_KOFAX_PROPERTY(new NPSoapStructPN_GET_KOFAX_PROPERTY(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_KOFAX_VENDORS()
if($nPSoapServicePN->PN_GET_KOFAX_VENDORS(new NPSoapStructPN_GET_KOFAX_VENDORS(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_VENDOR_INSURANCE()
if($nPSoapServicePN->PN_GET_VENDOR_INSURANCE(new NPSoapStructPN_GET_VENDOR_INSURANCE(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_SCHEDULER()
if($nPSoapServicePN->PN_GET_SCHEDULER(new NPSoapStructPN_GET_SCHEDULER(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_SCHEDULER_CUSTOM()
if($nPSoapServicePN->PN_GET_SCHEDULER_CUSTOM(new NPSoapStructPN_GET_SCHEDULER_CUSTOM(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_VENDORCOMBO_CONFIRM()
if($nPSoapServicePN->PN_GET_VENDORCOMBO_CONFIRM(new NPSoapStructPN_GET_VENDORCOMBO_CONFIRM(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_INVOICES_CONFIRM()
if($nPSoapServicePN->PN_GET_INVOICES_CONFIRM(new NPSoapStructPN_GET_INVOICES_CONFIRM(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_GET_DATA()
if($nPSoapServicePN->PN_GET_DATA(new NPSoapStructPN_GET_DATA(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_FINALIZE_JOBCOSTING()
if($nPSoapServicePN->PN_FINALIZE_JOBCOSTING())
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());
// sample call for NPSoapServicePN::PN_VALIDATE_XML()
if($nPSoapServicePN->PN_VALIDATE_XML(new NPSoapStructPN_VALIDATE_XML(/*** update parameters list ***/)))
	print_r($nPSoapServicePN->getResult());
else
	print_r($nPSoapServicePN->getLastError());

/************************************
 * Example for NPSoapServicePNGETDATA
 */
$nPSoapServicePNGETDATA = new NPSoapServicePNGETDATA($wsdl);
// sample call for NPSoapServicePNGETDATA::setSoapHeaderSecurityHeader() in order to initialize required SoapHeader
$nPSoapServicePNGETDATA->setSoapHeaderSecurityHeader(new NPSoapStructSecurityHeader(/*** update parameters list ***/));
// sample call for NPSoapServicePNGETDATA::PNGETDATA()
if($nPSoapServicePNGETDATA->PNGETDATA(new NPSoapStructPNGETDATA(/*** update parameters list ***/)))
	print_r($nPSoapServicePNGETDATA->getResult());
else
	print_r($nPSoapServicePNGETDATA->getLastError());
?>