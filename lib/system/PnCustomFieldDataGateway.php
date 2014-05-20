<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the PNCUSTOMFIELDDATA table
 *
 * @author Thomas Messier
 */
class PnCustomFieldDataGateway extends AbstractGateway {
	protected $pk = 'customfielddata_id';

	public function isServiceVendor($vendor_id) {
		$select = Select::get()
					->count(true, 'total')
					->from(['cfd'=>'pncustomfielddata'])
						->join(
							['cf'=>'pncustomfields'],
							'cfd.customfield_id = cf.customfield_id',
							[]
						)
					->whereEquals('cfd.customfielddata_table_id', '?')
					->whereEquals('cfd.customfielddata_value', "'on'")
					->whereEquals('cf.customfield_name', "'is_service_vendor'")
					->whereEquals('cf.customfield_status', 1);

		$res = $this->adapter->query($select, [$vendor_id]);

		return ($res[0]['total'] > 0);
	}

	public function findCustomFieldValue($customfield_name, $customfielddata_table_id, $customfield_status=1) {
		$select = Select::get()
					->column('customfielddata_value')
					->from(['cfd'=>'pncustomfielddata'])
						->join(
							['cf'=>'pncustomfields'],
							'cfd.customfield_id = cf.customfield_id',
							[]
						)
					->whereEquals('cf.customfield_name', '?')
					->whereEquals('cfd.customfielddata_table_id', '?');

		$params = [$customfield_name, $customfielddata_table_id];

		if (!empty($customfield_status)) {
			$select->whereEquals('cf.customfield_status', '?');
			$params[] = $customfield_status;
		}

		$res = $this->adapter->query($select, $params);

		if (count($res)) {
			return $res[0]['customfielddata_value'];
		} else {
			return null;
		}
	}

	/**
	 * Gets service fields and values for a PO
	 */
	public function findPoServiceFields($purchaseorder_id) {
		$select = Select::get()
					->columns([
						'customfield_label',
						'customfield_name',
						'customfield_id',
						'customfield_type',
						'customfield_required',
						'customfield_max_length',
						'universal_field_number'
					])
					->from(['cf'=>'pncustomfields'])
						->join(
							['cfd'=>'pncustomfielddata'],
							'cfd.customfield_id = cf.customfield_id AND cfd.customfielddata_table_id = ?',
							['customfielddata_value'],
							Select::JOIN_LEFT
						)
					->whereEquals('cf.customfield_pn_type', "'po'")
					->whereEquals('cf.customfield_status', 1)
					->whereIsNotEmpty('cf.customfield_label');

		return $this->adapter->query($select, [$purchaseorder_id]);
	}
}

?>