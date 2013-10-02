<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Expression;
use NP\core\db\Insert;

/**
 * Gateway for the DFSPLIT table
 *
 * @author Thomas Messier
 */
class DfSplitGateway extends AbstractGateway {
	protected $tableAlias = 's';
	
	/**
	 * Override default getSelect() to add some joins
	 */
	public function getSelect() {
		return Select::get()->from(array('s'=>'dfsplit'))
							->join(array('vs'=>'vendorsite'),
									's.vendorsite_id = vs.vendorsite_id',
									array('vendorsite_id'),
									Select::JOIN_LEFT)
							->join(array('v'=>'vendor'),
									'vs.vendor_id = v.vendor_id',
									array('vendor_id','vendor_id_alt','vendor_name'),
									Select::JOIN_LEFT);
	}

	public function findByFilter($property_id=null, $glaccount_id=null, $pageSize=null, $page=1, $sort='dfsplit_name') {
		$select = new Select();
		
		// Main query
		$select->columns(array(
					'dfsplit_id',
					'dfsplit_name',
					'dfsplit_status',
					'vendorsite_id',
					'dfsplit_datetm',
					'integration_package_id',
					'dfsplit_update_datetm',
					'dfsplit_update_userprofile',
					'alert' => Select::get()->column(new Expression("
												CASE 
													WHEN p.property_status = 0 THEN 'propInactive'
													WHEN p.property_status = -1 THEN 'propOnHold'
													WHEN g.glaccount_status = 'inactive' THEN 'glInactive'
												END
											"))
											->from(array('si'=>'dfsplititems'))
											->join(array('p'=>'property'),
													'si.property_id = p.property_id',
													array())
											->join(array('g'=>'glaccount'),
													'si.glaccount_id = g.glaccount_id',
													array())
											->whereEquals('s.dfsplit_id', 'si.dfsplit_id')
											->whereNest('OR')
											->whereNotEquals('p.property_status', '1')
											->whereEquals('g.glaccount_status', "'inactive'")
											->limit(1)
				))
				->from(array('s'=>'dfsplit'))
				->join(array('u'=>'userprofile'),
						's.dfsplit_update_userprofile = u.userprofile_id',
						array('userprofile_id','userprofile_username'),
						Select::JOIN_LEFT)
				->whereEquals('s.dfsplit_status', '?')
				->order($sort);

		// If we have any filters selected, apply them
		$params = array('active');
		
		$subSelect = new Select();
		$subSelect->from(array('si'=>'dfsplititems'))
						->whereEquals('s.dfsplit_id', 'si.dfsplit_id')
						->whereExists(
							Select::get()->from(array('p'=>'property'))
										->whereEquals('si.property_id', 'p.property_id')
						)
						->whereExists(
							Select::get()->from(array('g'=>'glaccount'))
										->whereEquals('si.glaccount_id', 'g.glaccount_id')
						);

		// If property was supplied, use it to filter
		if ($property_id !== null && $property_id !== '') {
			$subSelect->whereEquals('si.property_id', '?');
			$params[] = $property_id;
		}
		// If GL account was supplied, use it to filter
		if ($glaccount_id !== null && $glaccount_id !== '') {
			$subSelect->whereEquals('si.glaccount_id', '?');
			$params[] = $glaccount_id;
		}

		// Apply subquery to main query in EXISTS clause
		$select->whereExists($subSelect);


		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	public function copySplit($dfsplit_id) {
		// Get the record so we have the current name
		$dfsplit_name = $this->findById($dfsplit_id, array('dfsplit_name'));
		$dfsplit_name = $dfsplit_name['dfsplit_name'];

		// Get a unique name for the split
		$nameSuffix = '(Copy)';
		$increment = 1;
		while (true) {
			$new_dfsplit_name = $dfsplit_name . ' ' . $nameSuffix;
			$splitRec = $this->find(array('dfsplit_name' => '?', 'dfsplit_status' => '?'), array($new_dfsplit_name, 'active'));
			if ( count($splitRec) ) {
				$increment++;
				$nameSuffix = "(Copy {$increment})";
			} else {
				break;
			}
		}

		// Create the split insert query
		$insert = Insert::get()->into('dfsplit')
								->columns(array(
									'dfsplit_name',
									'dfsplit_status',
									'vendorsite_id',
									'integration_package_id'
								))
								->values(
									Select::get()->columns(array(
													new Expression('?'),
													'dfsplit_status',
													'vendorsite_id',
													'integration_package_id'
												))
												->from('dfsplit')
												->whereEquals('dfsplit_id', '?')
								);

		// Save the new split
		$this->adapter->query($insert, array($new_dfsplit_name, $dfsplit_id));

		$new_dfsplit_id = $this->adapter->lastInsertId();

		// Create the split items insert query
		$insert = Insert::get()->into('dfsplititems')
								->columns(array(
									'dfsplit_id',
									'property_id',
									'glaccount_id',
									'dfsplititem_percent',
									'universal_field1',
									'universal_field2',
									'universal_field3',
									'universal_field4',
									'universal_field5',
									'universal_field6',
									'universal_field7',
									'universal_field8',
									'unit_id'
								))
								->values(
									Select::get()->columns(array(
													new Expression('?'),
													'property_id',
													'glaccount_id',
													'dfsplititem_percent',
													'universal_field1',
													'universal_field2',
													'universal_field3',
													'universal_field4',
													'universal_field5',
													'universal_field6',
													'universal_field7',
													'universal_field8',
													'unit_id'
												))
												->from('dfsplititems')
												->whereEquals('dfsplit_id', '?')
								);
		// Save the line items
		$this->adapter->query($insert, array($new_dfsplit_id, $dfsplit_id));

		return $new_dfsplit_id;
	}
}

?>