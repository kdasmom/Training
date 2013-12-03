<?php

namespace NP\invoice;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the INVOICEPAYMENT table
 *
 * @author Thomas Messier
 */
class InvoicePaymentGateway extends AbstractGateway {

	/**
	 * 
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
}

?>