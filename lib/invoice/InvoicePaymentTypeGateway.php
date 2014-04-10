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

	/**
	 * Returns an invoicepayment_type_id that matches the invoicepayment_type argument
	 *
	 * @param  string $invoicepayment_type
	 * @return int
	 */
	public function findIdByName($invoicepayment_type) {
		return $this->findValue(
			['invoicepayment_type'=>'?'],
			[$invoicepayment_type],
			'invoicepayment_type_id'
		);
	}
}

?>