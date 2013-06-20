<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;

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

}

?>