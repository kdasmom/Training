<?php

namespace NP\invoice;


use NP\property\PropertyGateway;
use NP\vendor\VendorGateway;
use NP\invoice\InvoiceGateway;
use NP\invoice\InvoicePaymentStatusGateway;
use NP\system\IntegrationPackageGateway;
use NP\system\BaseImportService;

class InvoicePaymentsService extends BaseImportService {


    protected $gateway, $validator;

    protected  $propertyGateway, $vendorGateway, $invoiceGateway, $invoicepaymentstatusGateway, $integrationpackageGateway;

    public function __construct
    (
        InvoicePaymentsGateway $gateway,
        InvoicePaymentsEntityValidator $validator,
        PropertyGateway $propertyGateway, 
        VendorGateway $vendorGateway, 
        InvoiceGateway $invoiceGateway, 
        InvoicePaymentStatusGateway $invoicepaymentstatusGateway, 
        IntegrationPackageGateway $integrationpackageGateway
    )
    {
        $this->gateway = $gateway;
        $this->validator = $validator;
        $this->propertyGateway = $propertyGateway;
        $this->vendorGateway = $vendorGateway;
        $this->invoiceGateway = $invoiceGateway;
        $this->invoicepaymentstatusGateway = $invoicepaymentstatusGateway;
        $this->integrationpackageGateway = $integrationpackageGateway;
        
    }

    /**
     * @param $data array Row array for entity defined in next param
     * @param $entityClass string Entity class to map data
     */
    public function save(\ArrayObject $data, $entityClass)
    {

        $property = $this->propertyGateway->findByAltIdAp($data['BusinessUnit']);
        $propertyId = $property['id'];
        
        $integrationPackage = $this->integrationpackageGateway->find('integration_package_name = ?', array($data['IntegrationPackage']));
        $integrationPackageId = $integrationPackage[0]['integration_package_id'];
        
        $vendor = $this->vendorGateway->findByAltIdAndIntegrationPackage($data['VendorID'], $integrationPackageId);
        $vendorId = $vendor['vendor_id'];
        
        $invoicePaymentStatus = $this->invoicepaymentstatusGateway->find('invoicepayment_status = ?', array(strtolower($data['PaymentStatus'])));
        $invoicePaymentStatusId = $invoicePaymentStatus[0]['invoicepayment_status_id'];
        
        $invoice = $this->invoiceGateway->find('invoice_id = ?', array($data['InvoiceID']));
        $invoiceId = $invoice[0]['invoice_id'];
        
        $createDateTM = substr(date('Y-m-d H:i:s.u'), 0, -3);
        
        $checkNum = $data['CheckNumber']; 
        
        $idAlt = $invoiceId . 'op' . $checkNum;
        
        $entityData = array(
         	'invoice_id'	          => $invoiceId,
		'invoicepayment_number'	  => 1,
		'invoicepayment_datetm'	  => $createDateTM,
		'invoicepayment_checknum' => $data['CheckNumber'],
		'invoicepayment_amount'	  => $data['PaymentAmount'],
		'invoicepayment_status_id'	 => $invoicePaymentStatusId,
		'checkbook_id'	 => 0,
		'invoicepayment_status'	 => '',
		'paid'	 => 0,
		'invoicepayment_group_id'	 => '',
		'invoicepayment_reject_note'	 => '',
		'invoicepayment_id_alt'	 => $idAlt,
		'invoicepayment_checkcleared_datetm'	 => '',
		'VP_invoice_id'	 => $vendorId,
		'invoicepayment_applied_amount'	 => '',
		'invoicepayment_paid_by'	 => '',
		'invoicepayment_type_id'	 => '',
		'invoicepayment_paid_datetm'	 => '',
		'invoicepayment_voided_id'	 => '',
		'property_id'	 => $propertyId,
		'invoicepayment_paid_by_delegation_to'	 => ''
          );
        $entity = new $entityClass($entityData);
        $errors = $this->validate($entity);

        // If the data is valid, save it
        if (count($errors) == 0) {
            // Begin transaction
            $this->gateway->beginTransaction();

            try {
                // Save the glaccount record
                $this->gateway->save($entity);
            } catch(\Exception $e) {
                // Add a global error to the error array
                $errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e), 'extra'=>null);
            }
        }

        if (count($errors)) {
            $this->gateway->rollback();
        } else {
            $this->gateway->commit();
        } 
    }
}
