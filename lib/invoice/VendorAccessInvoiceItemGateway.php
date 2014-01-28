<?php

namespace NP\invoice;

use NP\core\AbstractGateway;

/**
 * Gateway for the VENDORACCESSINVOICEITEM table
 *
 * @author Thomas Messier
 */
class VendorAccessInvoiceItemGateway extends AbstractGateway {
	protected $pk = 'invoiceitem_id';

	public function findByLinkedPo($poitem_id) {
		return $this->findSingle(
			['linked_poitem_id'=>'?'],
			[$poitem_id]
		);
	}
}

?>