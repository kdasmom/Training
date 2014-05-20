<?php
namespace NP\invoice;

/**
 * Entity class for Invoice
 *
 * @author Thomas Messier
 */
class InvoiceEntity extends \NP\core\AbstractEntity implements \NP\workflow\WorkflowableInterface {
	protected $auditable = true;

	protected $lines;

	public $fields = array(
		'invoice_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'reftable_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'invoice_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => [
				'displayName'  => 'Invoice Date'
			]
		),
		'invoice_createddatetm'	 => array(
			'timestamp' => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoice_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'invoice_budgetid'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_glaccountid'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'paytable_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'paytablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'displayName'  => 'Vendor'
			]
		),
		'property_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'property',
				'displayField' => 'property_name',
				'displayName'  => 'Property'
			]
		),
		'invoice_ref'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			),
			'auditable' => [
				'displayName'  => 'Invoice Number'
			]
		),
		'invoice_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			),
			'auditable' => [
				'displayName'  => 'Note'
			]
		),
		'invoice_duedate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => [
				'displayName'  => 'Due Date'
			]
		),
		'invoice_submitteddate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoicetype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'frequency_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_startdate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoice_endate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoice_activityday'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_dueday'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_paymentmethod'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'invoicepayment_type_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'invoicePaymentType',
				'displayField' => 'invoicepayment_type',
				'displayName'  => 'Paid By'
			]
		),
		'project_id'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'task_id'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'imagekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoiced_amount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'initial_amount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'invoice_reject_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			),
			'auditable' => [
				'displayName'  => 'Rejection Note'
			]
		),
		'invoice_period'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => [
				'displayNameSetting'=>'PN.General.postPeriodTerm',
				'convert'      => 'convertPeriod'
			]
		),
		'control_amount'	 => array(
			'auditable' => [
				'displayName'  => 'Invoice Total',
				'convert'      => 'currency'
			]
		),
		'invoice_multiproperty'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_taxallflag'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_budgetoverage_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			),
			'auditable' => [
				'displayName'  => 'Budget Overage Note'
			]
		),
		'invoice_cycle_from'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => [
				'displayName'  => 'Cycle From'
			]
		),
		'invoice_cycle_to'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => [
				'displayName'  => 'Cycle To'
			]
		),
		'vendor_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>16)
			)
		),
		'lock_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'universal_field1'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL1'
			]
		),
		'universal_field2'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL2'
			]
		),
		'universal_field3'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL3'
			]
		),
		'universal_field4'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL4'
			]
		),
		'universal_field5'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL5'
			]
		),
		'universal_field6'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL6'
			]
		),
		'universal_field7'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL7'
			]
		),
		'universal_field8'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL8'
			]
		),
		'reftablekey_id'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>64)
			)
		),
		'remit_advice'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'displayName'  => 'Remittance Advice',
				'convert'      => 'convertRemit'
			]
		),
		'vendoraccess_notes'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'PriorityFlag_ID_Alt'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'displayName'  => 'Priority',
				'table'        => 'PriorityFlag',
				'displayField' => 'PriorityFlag_Display'
			]
		),
		'invoice_NeededBy_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => [
				'displayName'  => 'Needed By'
			]
		),
		'payablesconnect_flag'	 => array(),
		'address_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'template_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		)
	);

	public function convertRemit($val) {
		return (empty($val) || $val === 0) ? 'No' : 'Yes';
	}

	public function convertPeriod($val) {
		if (!empty($val)) {
			$val = \DateTime::createFromFormat(\NP\util\Util::getServerDateFormat(), $val);
			return $val->format('m/Y');
		}

		return null;
	}

	public function setLines($lines) {
		$this->lines = [];
		foreach ($lines as $line) {
			if (!($line instanceOf InvoiceItemEntity)) {
				$line = new InvoiceItemEntity($line);
			}
			$this->lines[] = $line;
		}
	}

	public function getLines() {
		if ($this->lines === null) {
			throw new \NP\core\Exception('Lines have not been instantiated for this invoice. Use setLines() before calling this method');
		}
		return $this->lines;
	}

	public function getPropertyId() {
		return $this->property_id;
	}

	public function getAmount() {
		$lines = $this->getLines();
		$total = 0;
		foreach ($lines as $line) {
			$total += $line->getAmount();
		}

		return $total;
	}

	public function getApplicableRuleTypes() {
		return ['invoice','invoiceitem','budget','vendor'];
	}
}
?>