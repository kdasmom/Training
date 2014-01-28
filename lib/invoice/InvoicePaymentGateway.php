<?php

namespace NP\invoice;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Expression;

/**
 * Gateway for the INVOICEPAYMENT table
 *
 * @author Thomas Messier
 */
class InvoicePaymentGateway extends AbstractGateway {

	/**
	 * Gets all payments for an invoice
	 *
	 * @param  int $invoice_id
	 * @return array
	 */
	public function findForInvoice($invoice_id) {
		$select = Select::get()->from(['ip'=>'invoicepayment'])
							->join(new sql\join\InvoicePaymentInvoicePaymentStatusJoin())
							->join(new sql\join\InvoicePaymentInvoicePaymentVoidJoin())
							->join(new sql\join\InvoicePaymentInvoicePaymentTypeJoin())
							->join(new sql\join\InvoicePaymentUserJoin())
							->join(new \NP\user\sql\join\UserUserroleJoin())
							->join(new \NP\user\sql\join\UserroleStaffJoin())
							->join(new \NP\user\sql\join\StaffPersonJoin())
							->join(new sql\join\InvoicePaymentDelegationUserJoin())
							->whereEquals('ip.invoice_id', '?')
							->order('ip.invoicepayment_number');

		return $this->adapter->query($select, array($invoice_id));
	}

	/**
 	 * Gets the next payment line number for an invoice
	 */
	public function getNextLineNumber($invoice_id) {
		$res = $this->adapter->query(
			Select::get()
				->column(new Expression('MAX(invoicepayment_number)'), 'maxLine')
				->from('invoicepayment')
				->whereEquals('invoice_id', '?'),
			[$invoice_id]
		);

		if ($res[0]['maxLine'] === null) {
			return 1;
		} else {
			return ($res[0]['maxLine'] + 1);
		}
	}
}

?>