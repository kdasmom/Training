<?php
namespace NP\po;

/**
 * Entity class for PurchaseOrder
 *
 * @author Thomas Messier
 */
class PurchaseOrderEntity extends \NP\core\AbstractEntity implements \NP\workflow\WorkflowableInterface {
	protected $auditable = true;

	protected $lines;
	
	protected $fields = array(
		'purchaseorder_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'sent_vendor_portal_flag'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_quote'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'purchaseorder_quoteamount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'vendorsite_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'displayName'  => 'Vendor'
			]
		),
		'purchaseorder_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'purchaseorder_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'purchaseorder_created'	 => array(
			'timestamp' => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
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
		'purchaseorder_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			),
			'auditable' => [
				'displayName'  => 'Note'
			]
		),
		'purchaseorder_closeddatetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
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
		'purchaseorder_reject_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'purchaseorder_period'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => [
				'displayNameSetting'=>'PN.General.postPeriodTerm',
				'convert'      => 'convertPeriod'
			]
		),
		'purchaseorder_multiproperty'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_taxallflag'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_ref'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'purchaseorder_budgetoverage_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			),
			'auditable' => [
				'displayName'  => 'Budget Overage Note'
			]
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
		'purchaseorder_NeededBy_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => [
				'displayName'  => 'Needed By'
			]
		),
		'Purchaseorder_billaddress'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>500)
			),
			'auditable' => [
				'displayName'  => 'Bill To Address'
			]
		),
		'Purchaseorder_shipaddress'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>500)
			),
			'auditable' => [
				'displayName'  => 'Ship To Address'
			]
		),
		'Purchaseorder_bill_propertyID'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'Purchaseorder_ship_propertyID'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_rct_req'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_rct_canReceive'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'sysdatetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'purchaseorder_rct_canReceive_userprofileID'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_rct_canReceive_dt'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'address_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'print_template_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'printTemplate',
				'displayField' => 'print_template_name',
				'displayName'  => 'PO Terms'
			]
		)
	);

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
			if (!($line instanceOf PoItemEntity)) {
				$line = new PoItemEntity($line);
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
		return ['purchaseorder','poitem','budget','vendor'];
	}
}
?>