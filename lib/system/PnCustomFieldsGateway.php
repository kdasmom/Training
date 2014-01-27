<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Expression;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Update;

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


	/**
	 * @param $type
	 * @return int
	 */
	public function getNextMaxUFN($type) {
		$select = new Select();

		$select->from(['p' => 'pnuniversalfield'])
			->columns(['maxUFN' => new Expression('max(universal_field_number)')])
			->where(['customfield_pn_type' => '?']);

		$result = $this->adapter->query($select, [$type]);

		return $result[0]['maxUFN'] == '' ? 1 : $result[0]['maxUFN'];
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


}

?>