<?php

namespace NP\invoice;

use NP\core\AbstractGateway;

/**
 * Gateway for the INVOICEPAYMENTSTATUS table
 *
 * @author Thomas messier
 */
class InvoicePaymentStatusGateway extends AbstractGateway {
	protected $pk = 'invoicepayment_status_id';

	/**
	 * Returns an invoicepayment_status_id that matches the invoicepayment_status argument
	 *
	 * @param  string $invoicepayment_type
	 * @return int
	 */
	public function findIdByName($invoicepayment_status) {
		return $this->findValue(
			['invoicepayment_status'=>'?'],
			[$invoicepayment_status],
			'invoicepayment_status_id'
		);
	}
}

?>