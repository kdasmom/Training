<?php

namespace NP\invoice;


use NP\system\BaseImportServiceGateway;
use NP\core\db\Select;

class InvoicePaymentsGateway extends BaseImportServiceGateway {
    
    protected $table = 'INVOICEPAYMENT';
}