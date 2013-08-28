<?php

namespace NP\invoice;


use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\system\BaseImportService;

class InvoiceExportService extends BaseImportService {

    /**
     * @var InvoiceExportGateway
     */
    protected $gateway;

    /**
     * @var PropertyGateway
     */
    protected $propertyGateway;

    /**
     * @var GlAccountGateway
     */
    protected $glAccountGateway;

    /**
     * @var InvoiceExportEntityValidator
     */
    protected $validator;

    public function __construct
    (
        InvoiceExportGateway $gateway,
        InvoiceExportEntityValidator $validator,
        PropertyGateway $propertyGateway,
        GLAccountGateway $glAccountGateway
    )
    {
        $this->gateway = $gateway;
        $this->validator = $validator;
        $this->propertyGateway = $propertyGateway;
        $this->glAccountGateway = $glAccountGateway;
    }

    /**
     * @param $data array Row array for entity defined in next param
     * @param $entityClass string Entity class to map data
     */
    public function save(\ArrayObject $data, $entityClass)
    {

        $property = $this->propertyGateway->findByAltId($data['PropertyCode']);
        $propertyId = $property['id'];
        $glaccount = $this->glAccountGateway->findByAltId($data['AccountNumber']);
        $glaccountId = $glaccount['glaccount_id'];
        $entityData = array(
            'reftable_name' => '',
            'invoice_datetm' => $data['InvoiceDate'],
            'invoice_createddatetm' => $data['InvoiceCreatedDate'],
            'invoice_status' => '',
            'invoice_budgetid' => '',
            'invoice_glaccountid' => $glaccountId,
            'paytable_name' => '',
            'paytablekey_id' => '',
            'property_id' => $propertyId,
            'invoice_ref' => $data['InvoiceNumber'],
            'invoice_note' => $data['InvoiceItemDescription'],
            'invoice_duedate' => $data['DueDate'],
            'invoice_submitteddate' => '',
            'invoicetype_id' => '1',
            'frequency_id' => '',
            'invoice_startdate' => '',
            'invoice_endate' => '',
            'invoice_activityday' => '',
            'invoice_dueday' => '',
            'invoice_paymentmethod' => '',
            'invoicepayment_type_id' => '',
            'project_id' => '',
            'task_id' => '',
            'imagekey_id' => '',
            'invoiced_amount' => $data['InvoiceItemAmount'],
            'initial_amount' => '',
            'invoice_reject_note' => '',
            'invoice_period' => $data['InvoicePeriod'],
            'control_amount' => '',
            'invoice_multiproperty' => '',
            'invoice_taxallflag' => '',
            'invoice_budgetoverage_note' => '',
            'invoice_cycle_from' => '',
            'invoice_cycle_to' => '',
            'vendor_code' => $data['VendorCode'],
            'lock_id' => '',
            'universal_field1' => $data['InvoiceCustomField1'],
            'universal_field2' => $data['InvoiceCustomField2'],
            'universal_field3' => $data['InvoiceCustomField3'],
            'reftablekey_id' => '',
            'remit_advice' => '',
            'vendoraccess_notes' => '',
            'PriorityFlag_ID_Alt' => '',
            'invoice_NeededBy_datetm' => '',
            'universal_field4' => $data['InvoiceCustomField4'],
            'universal_field5' => $data['InvoiceCustomField5'],
            'universal_field6' => $data['InvoiceCustomField6'],
            'universal_field7' => '',
            'universal_field8' => '',
            'payablesconnect_flag' => '',
            'address_id' => '',
            'template_name' => ''
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
