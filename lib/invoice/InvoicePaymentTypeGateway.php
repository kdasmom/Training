<?php

namespace NP\invoice;

use NP\core\AbstractGateway;

/**
 * Gateway for the INVOICEPAYMENTTYPE table
 *
 * @author Thomas Messier
 */
class InvoicePaymentTypeGateway extends AbstractGateway {
	protected $pk = 'invoicepayment_type_id';
}

?>