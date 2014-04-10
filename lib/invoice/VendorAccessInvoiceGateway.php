<?php

namespace NP\invoice;

use NP\core\AbstractGateway;

/**
 * Gateway for the VENDORACCESSINVOICE table
 *
 * @author Thomas Messier
 */
class VendorAccessInvoiceGateway extends AbstractGateway {
	protected $pk = 'invoice_id';
}

?>