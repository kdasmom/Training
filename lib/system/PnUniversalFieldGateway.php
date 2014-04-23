<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Delete;
use NP\core\db\Expression;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Update;

/**
 * Gateway for the PNUNIVERSALFIELD table
 *
 * @author Thomas Messier
 */
class PnUniversalFieldGateway extends AbstractGateway {
	const STATUS_ACTIVE = 1;
	const STATUS_INACTIVE = 0;
	const STATUS_DEFAULT = 2;

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

	public function updateUniversalField($data) {
		if ($data['universal_field_status'] == self::STATUS_DEFAULT) {
			$updateStatus = new Update();
			$subSelect = new Select();

			$subSelect->from(['p' => 'pnuniversalfield'])
				->column('universal_field_number')
				->where(
					[
						'universal_field_id' => '?'
					]
				);

			$updateStatus->table('pnuniversalfield')
				->values([
					'universal_field_status' => '?'
				])
				->where(
					[
						'islineitem'				=> '?',
						'universal_field_status'	=> '?',
						'customfield_pn_type'		=> '?'
					]
				)
				->whereEquals('universal_field_number', $subSelect);


			$this->adapter->query($updateStatus, [self::STATUS_ACTIVE, $data['tabindex'], self::STATUS_DEFAULT, 'customInvoicePO', $data['universal_field_id']]);
		}


		$update = new Update();

		$update->table('pnuniversalfield')
			->values([
				'universal_field_data'		=> '?',
				'universal_field_status'	=> '?'
			])
			->where([
				'universal_field_id'		=> '?'
			]);

		return $this->adapter->query($update, [$data['universal_field_data'], $data['universal_field_status'], $data['universal_field_id']]);
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

		return $result[0]['maxUFN'] == '' ? 1 : $result[0]['maxUFN']+1;
	}

	/**
	 * Return custom field data
	 *
	 * @param $fid
	 * @return array|bool
	 */
	public function getCustomFieldData($fid, $tabindex, $pntype = false, $universal_field_id = null) {
		$select = new Select();

		$result = [
			[
				'universal_field_id'		=> 0,
				'universal_field_data'		=> 'New',
				'universal_field_status'	=> 1,
				'universal_field_order'		=> 0
			]
		];

		if ($tabindex < ConfigService::TABINDEX_CUSTOMFIELD_SERVICEFIELDS) {
			$select->from(['pn' => 'pnuniversalfield'])
				->columns(['universal_field_id', 'universal_field_data', 'universal_field_status', 'universal_field_order'])
				->where(
					[
						'universal_field_number'	=> '?',
						'islineitem'				=> '?',
						'customfield_pn_type'		=> '?'
					]
				)
				->order('universal_field_order, universal_field_data');

			$result = array_merge($result, $this->adapter->query($select, [$fid, $tabindex, 'customInvoicePO']));
		} else {
			$select->from(['pu' => 'pnuniversalfield'])
				->where(
					[
						'universal_field_number'	=> '?',
						'customfield_pn_type'		=> '?'
					]
				)
				->order('universal_field_order');

			$result = array_merge($result, $this->adapter->query($select, [$universal_field_id, $pntype]));
		}

		return $result;
	}



	/**
	 * Delete universal field
	 *
	 * @param $universal_field_id
	 * @return array|bool
	 */
	public function deleteUniversalField($universal_field_id) {
		$delete = new Delete();

		$delete->from('pnuniversalfield')
			->where(['universal_field_id' => '?']);

		return $this->adapter->query($delete, [$universal_field_id]);
	}

	/**
	 * Return next universal field number
	 *
	 * @param $pn_type
	 * @return int
	 */
	public function getNextUniversalFieldNumber($pn_type) {
		$select = new Select();

		$select->from(['pu' => 'pnuniversalfield'])
			->columns(['nextNum' => new Expression('isnull(max(universal_field_number), 0)+1')])
			->where([
				'customfield_pn_type' => '?'
			]);

		$result = $this->adapter->query($select, [$pn_type]);

		return $result[0]['nextNum'] == '' ? 1 : $result[0]['nextNum'];
	}

	/**
	 * Find assigned glaccounts
	 *
	 * @param $field_id
	 * @return array
	 */
	public function findAssignedGlaccounts($field_id) {
		$select = new Select();

		$select->from(['l' => 'link_universal_gl'])
			->columns(['glaccount_id' => 'gl_id'])
			->distinct()
			->where(['universal_field_id' => '?']);

		$result = $this->adapter->query($select, [$field_id]);

		$glaccounts = [];
		foreach ($result as $item) {
			$glaccounts[] = $item['glaccount_id'];
		}

		return $glaccounts;
	}

	/**
	 * Assign glaccounts
	 *
	 * @param $field_id
	 * @param $glaccounts
	 * @return bool
	 * @throws \NP\core\Exception
	 */
	public function assignGlAccountToTheUniversalFields($field_id, $glaccounts) {
		$insert = new Insert();
		$delete = new Delete();

		$delete->from('link_universal_gl')
			->where(['universal_field_id' => '?']);

		$this->adapter->query($delete, [$field_id]);

		if (count($glaccounts) > 0) {
			foreach ($glaccounts as $account) {
				$insert->into('link_universal_gl')
					->columns(['universal_field_id', 'gl_id'])
					->values(Select::get()->columns([
						new Expression('?'),
						new Expression('?')
					]));

				if (!$this->adapter->query($insert, [$field_id, $account])) {
					throw new \NP\core\Exception("Cannot assign glaccount ot the universal field.");
				}
			}
		}

		return true;
	}
}

?>