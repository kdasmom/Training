<?php

namespace NP\invoice;

use NP\core\AbstractGateway;

/**
 * Gateway for the INVOICEPAYMENTGROUP table
 *
 * @author Thomas Messier
 */
class InvoicePaymentGroupGateway extends AbstractGateway {
	protected $pk = 'invoicepayment_group_id';
}

?>