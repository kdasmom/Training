<?php

namespace NP\invoice\sql;

use NP\shared\sql\AbstractEntitySelect;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * A custom Select object for Invoice records with some shortcut methods
 *
 * @author Thomas Messier
 */
class InvoiceSelect extends AbstractEntitySelect {
	
	protected $tableName     = 'invoice';
	protected $lineTableName = 'invoiceitem';

	/**
	 * Adds the invoice amount subquery as a column
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnSubjectName($alias='subject_name') {
		return $this->column(new Expression('
			CASE 
				WHEN vone.vendoronetime_name IS NOT NULL THEN vone.vendoronetime_Name 
				ELSE v.vendor_name
			END
		'), $alias);
	}
	
	/**
	 * Adds the pending days column
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnPendingDays() {
		return $this->column(new Expression('DateDiff(day, i.invoice_createddatetm, getDate())'), 'invoice_pending_days');
	}
	
	/**
	 * Adds the on hold days column
	 *
	 * @return \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnOnHoldDays() {
		return $this->column(new Expression('DateDiff(day, a.approve_datetm, getDate())'), 'invoice_days_onhold');
	}
	
	/**
	 * Adds the on hold by column
	 *
	 * @return \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnOnHoldBy() {
		return $this->column(new Expression('(SELECT userprofile_username FROM USERPROFILE WHERE userprofile_id = a.userprofile_id)'), 'invoice_onhold_by');
	}
	
	/**
	 * Adds the on hold notes column
	 *
	 * @return \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnOnHoldNotes() {
		return $this->column(
			$this->getHoldSelect()->column('note'),
			'invoice_onhold_notes'
		);
	}
	
	/**
	 * Adds the on hold reason column
	 *
	 * @return \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnOnHoldReason() {
		return $this->column(
			$this->getHoldSelect()->columns([])
								->join(
									['rea'=>'reason'],
									'n.reason_id = rea.reason_id',
									['reason_text']
								),
			'invoice_onhold_reason'
		);
	}

	/**
	 * 
	 */
	protected function getHoldSelect() {
		return Select::get()
			->from(['n'=>'note'])
				->join(
					['ot'=>'objecttype'],
					'n.objecttype_id = ot.objtype_id',
					[]
				)
			->whereEquals('n.table_name', "'invoice'")
			->whereEquals('n.tablekey_id', 'i.invoice_id')
			->whereEquals('ot.objtype_name', "'onhold'")
			->limit(1)
			->order('n.note_createddatetm DESC');
	}

	/**
	 * Adds the void date column
	 *
	 * @return \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnVoidDate() {
		return $this->column(
			$this->getApproveSelect('__a', 'void')->column('approve_datetm'),
			'void_datetm'
		);
	}

	/**
	 * Adds the voided by column
	 *
	 * @return \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnVoidBy() {
		$alias = '__a';

		return $this->column(
			$this->getApproveSelect($alias, 'void')->columns([])
												->join(new \NP\workflow\sql\join\ApproveUserJoin(
													array('userprofile_username'),
													Select::JOIN_INNER,
													'u',
													$alias
												)),
			'void_by'
		);
	}

	/**
	 * Adds the payment details column
	 *
	 * @return \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnPaymentDetails() {
		return $this->column(
			Select::get()->column(
							new Expression("'(CHK #' + ip.invoicepayment_checknum + ' - ' + CONVERT(varchar(6),MONTH(ip.invoicepayment_datetm))+'/'+ CONVERT(varchar(16),DAY(ip.invoicepayment_datetm))+ '/'+ CONVERT(varchar(5),YEAR(ip.invoicepayment_datetm)) +')'")
						)
						->from(['ip'=>'invoicepayment'])
						->whereEquals('ip.invoice_id', 'i.invoice_id')
						->limit(1)
						->order('ip.invoicepayment_id DESC'),
			'payment_details'
		);
	}

	/**
	 * Adds the payment amount remaining column
	 *
	 * @return \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnPaymentAmountRemaining() {
		$invoiceTotalSelect = Select::get()->column(new Expression('SUM(ii.invoiceitem_amount + ii.invoiceitem_shipping + ii.invoiceitem_salestax)'))
										->from(['ii'=>'invoiceitem'])
										->whereEquals('ii.invoice_id', 'i.invoice_id');

		$retAmountSelect = clone $invoiceTotalSelect;
		$retAmountSelect->columns([new Expression('SUM(ISNULL(jb.jbassociation_retamt, 0))')])
						->join(new join\InvoiceItemJobAssociationJoin([]));

		$invoicePaidSelect = Select::get()->column(new Expression("
												SUM(
													CASE
														WHEN ip.invoicepayment_applied_amount IS NULL THEN ip.invoicepayment_amount
														ELSE ip.invoicepayment_applied_amount
													END
												)
											"))
										->from(['ip'=>'invoicepayment'])
										->join(new join\InvoicePaymentInvoicePaymentStatusJoin([]))
										->whereEquals('ip.invoice_id', 'i.invoice_id')
										->whereEquals('ips.invoicepayment_status',"'paid'");

		$invoiceVoidSelect = clone $invoicePaidSelect;
		$invoiceVoidSelect->where(new Where())
						->whereEquals('ip.invoice_id', 'i.invoice_id')
						->whereIn('ips.invoicepayment_status',"'void','nsf'");

		return $this->column(
			new Expression("
				ISNULL(({$invoiceTotalSelect->toString()}), 0)
				- ISNULL(({$retAmountSelect->toString()}), 0)
				- ISNULL(({$invoicePaidSelect->toString()}), 0)
				+ ISNULL(({$invoiceVoidSelect->toString()}), 0)
			"),
			'payment_amount_remaining'
		);
	}
	
}

?>