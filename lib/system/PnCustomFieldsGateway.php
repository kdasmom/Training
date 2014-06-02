<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Delete;
use NP\core\db\Expression;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Update;
use NP\util\Util;

/**
 * Gateway for the PNCUSTOMFIELDS table
 *
 * @author 
 */
class PnCustomFieldsGateway extends AbstractGateway {
	protected $pk = 'customfield_id';

	public function findCustomFieldData($customfield_pn_type, $customfielddata_table_id) {
		$select = new Select();
		$select->from(array('f'=>'pncustomfields'))
				->join(array('d'=>'pncustomfielddata'),
						'd.customfield_id = f.customfield_id AND d.customfielddata_table_id = ?',
						array('customfielddata_id','customfielddata_value'),
						Select::JOIN_LEFT)
				->whereEquals('f.customfield_pn_type', '?')
				->whereEquals('f.customfield_status', '?')
				->order('f.universal_field_number');

		return $this->adapter->query($select, array($customfielddata_table_id, $customfield_pn_type, 1));
	}

	public function getCustomFieldValues($fid) {
		$select = new Select();

		$select->from(['pc' => 'pncustomfields'])
			->columns(
				[
					'controlpanelitem_number' 	=> new Expression('right(customfield_name, 1)'),
					'controlpanelitem_name'		=> 'customfield_name',
					'customfield_label',
					'po_on_off'					=> 'customfield_status',
					'customfield_status',
					'customfield_type',
					'customfield_max_length',
					'universal_field_number',
					'po_req'					=> 'customfield_required',
					'customfield_pn_type'

				]
			)
			->where(['customfield_id' => '?']);

		return $this->adapter->query($select, [$fid]);
	}

	public function updateCustomField($data) {
		$update = new Update();

		$update->table('pnuniversalfield')
			->values(
				[
					'universal_field_data'	=> $data['universal_field_data'],
					''
				]
			);
	}

	public function validateCustomField($value, $number, $customFieldType) {
		$select = new Select();

		$select->count(true, 'cnt')
			->from(['u' => 'pnuniversalfield'])
			->where([
				'universal_field_data'		=> '?',
				'UNIVERSAL_FIELD_NUMBER'	=> '?',
				'customfield_pn_type'		=> '?'
			]);

		if ($customFieldType == 'header') {
			$select->whereNotEquals('islineitem', '?');
		}
		if ($customFieldType == 'lineitem') {
			$select->whereEquals('islineitem', '?');
		}

		$result = $this->adapter->query($select, [$value, $number, 'customInvoicePO', 1]);

		return $result[0]['cnt'] > 0 ? false : true;
	}

	public function customFieldImportProcess($userprofile_id, $customfield_value, $customfield_type, $customfield_number, $customfield_name, $validate = false) {
		$insert = new Insert();

		$insert->into('exim_customfield')
				->columns([
					'customfield_value',
					'customfield_name',
					'customfield_type',
					'customfield_number',
					'userprofile_id',
					'exim_error',
					'exim_errflag'
				])
				->values(Select::get()->columns([
					new Expression("?"),
					new Expression("?"),
					new Expression("?"),
					new Expression("?"),
					new Expression("?"),
					new Expression("?"),
					new Expression("?")
				]));
		$queryParams = [$customfield_value, $customfield_name, $customfield_type, $customfield_number, $userprofile_id];

		if ($validate) {
			if (!$this->validateCustomField($customfield_value, $customfield_number, $customfield_type)) {
				$queryParams = array_merge($queryParams, ['Custom Field Value Already Exists', 2]);
			} else {
				$queryParams = array_merge($queryParams, ['', null]);
			}
		} else {
			$queryParams = array_merge($queryParams, ['', null]);
		}

		return $this->adapter->query($insert, $queryParams);
	}


	public function importCustomfieldInit($userprofile_id, $customfield_type, $customfield_label, $customfield_number) {
		$delete = new Delete();

		$delete->from('exim_customfield')
				->whereNest('OR')
				->whereEquals('userprofile_id', '?')
				->whereLessThan('exim_datetm', '?');
		$date = new \DateTime();
		$date->add(new \DateInterval('P30D'));
		$date->invert = 1;

		$this->adapter->query($delete, [$userprofile_id, Util::formatDateForDB($date)]);
	}

	public function saveCustomFieldFromImport($userprofile_id, $type) {
		$insert = new Insert();

		$islineitem = $type == 'lineitem' ? 1 : 0;

		$select = new Select();
		$select->from(['e' => 'exim_customfield'])
				->columns([
					'customfield_value',
					'customfield_number',
					new Expression("1"),
					new Expression("0"),
					new Expression("$islineitem"),
					new Expression("'customInvoicePO'")
				])
				->whereEquals('userprofile_id', '?')
				->whereIsNull('exim_errflag');

		$insert->into('pnuniversalfield')
				->columns(['universal_field_data', 'universal_field_number', 'universal_field_status', 'universal_field_order', 'islineitem', 'customfield_pn_type'])
				->values($select);


		$result = $this->adapter->query($insert, [$userprofile_id]);

		if ($result) {
			$this->removeFromEximCustomField($userprofile_id);
		}

		return $result;
	}

	public function removeFromEximCustomField($userprofile_id) {
		$delete = new Delete();

		$delete->from('exim_customfield')
				->where(['userprofile_id' => '?']);

		return $this->adapter->query($delete, [$userprofile_id]);
	}

}

?>