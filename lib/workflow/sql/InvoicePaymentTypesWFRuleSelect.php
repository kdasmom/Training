<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class InvoicePaymentTypesWFRuleSelect extends Select {
	public function __construct($ruleid) {
		parent::__construct();

		$this->columns(['invoicepayment_type_id', 'invoicepayment_type'])
			->from(['i'  => 'invoicepaymenttype'])
			->join(['wf' => 'wfrulescope'], 'wf.table_name=\'invoicepaymenttype\' and wf.tablekey_id = i.invoicepayment_type_id', [], Select::JOIN_INNER);

		$where = Where::get()->equals('wf.wfrule_id', $ruleid);
		$this->where($where);
	}
}