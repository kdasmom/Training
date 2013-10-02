<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the PNUNIVERSALFIELD table
 *
 * @author Thomas Messier
 */
class PnUniversalFieldGateway extends AbstractGateway {
	protected $pk = 'universal_field_id';

	/**
	 * Gets values for a custom field drop down 
	 *
	 * @param  string  $customfield_pn_type    The entity type for which we want to get custom field options
	 * @param  int     $universal_field_number The custom field number
	 * @param  boolean [$activeOnly=true]      Whether or not to retrieve only active items
	 * @param  int     [$isLineItem=1]         Whether or not it's a line or header custom field (0=header; 1=line); defaults to 1
	 * @param  int     [$glaccount_id]         Associated GL account ID (optional); defaults to null
	 * @return array
	 */
	public function findCustomFieldOptions($customfield_pn_type, $universal_field_number, $activeOnly=true, 
										  $isLineItem=1, $glaccount_id=null, $keyword=null) {
		$select = new Select();
		$select->from(array('u'=>'PnUniversalField'))
				->columns(array('universal_field_data','universal_field_status','universal_field_order'))
				->whereEquals('u.customfield_pn_type', '?')
				->whereEquals('u.universal_field_number', '?')
				->whereEquals('u.islineitem', '?')
				->order('u.universal_field_order, u.universal_field_data');

		$params = array($customfield_pn_type, $universal_field_number, $isLineItem);

		if ($activeOnly) {
			$select->whereIn('u.universal_field_status', '?,?');
			$params[] = 1;
			$params[] = 2;
		}

		// If a glaccount_id argument was passed, we need to filter by that GL Account
		if ($glaccount_id !== null) {
			$select->join(array('l'=>'link_universal_gl'),
							'u.universal_field_id = l.universal_field_id',
							array())
					->whereEquals('l.gl_id', '?');
			$params[] = $glaccount_id;
		}

		if ($keyword !== null) {
			$select->whereLike('u.universal_field_data', '?');
			$keyword = $keyword . '%';
			$params[] = $keyword;
		}
		
		return $this->adapter->query($select, $params);
	}

	/**
	 * Checks if a value is a valid option for a certain custom field type
	 */
	public function isValueValid($customfield_pn_type, $universal_field_number, $customfielddata_value, $isLineItem=1) {
		$select = Select::get()->from('pnuniversalfield')
							->whereEquals('customfield_pn_type', '?')
							->whereEquals('universal_field_number', '?')
							->whereEquals('universal_field_data', '?')
							->whereEquals('islineitem', '?')
							->whereNotEquals('universal_field_status', '0');
		$res = $this->adapter->query(
			$select,
			array($customfield_pn_type, $universal_field_number, $customfielddata_value, $isLineItem)
		);

		return (count($res)) ? true : false;
	}
}

?>