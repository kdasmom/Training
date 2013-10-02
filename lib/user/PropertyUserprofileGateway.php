<?php

namespace NP\user;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Delete;

/**
 * Gateway for the PROPERTYUSERPROFILE table
 *
 * @author 
 */
class PropertyUserprofileGateway extends AbstractGateway {
	protected $tableAlias = 'pu';
	protected $pk         = 'propuser_id';

	/**
	 * Override getSelect() to include some joins
	 */
	public function getSelect() {
		$select = new Select();
		$select->from(array('pu'=>'propertyuserprofile'))
				->join(array('p'=>'property'),
						'pu.property_id = p.property_id',
						array('property_id_alt','property_name'))
				->join(array('u'=>'userprofile'),
						'pu.userprofile_id = u.userprofile_id',
						array('userprofile_username'))
				->join(array('ur'=>'userprofilerole'),
						'u.userprofile_id = ur.userprofile_id',
						array())
				->join(array('s' => 'staff'),
						'ur.tablekey_id = s.staff_id',
						array())
				->join(array('pe' => 'person'),
						's.person_id = pe.person_id',
						array('person_firstname','person_lastname'));
		return $select;
	}

	public function deleteUsersWithoutOnHoldPermission($property_id_list) {
		// Create SQL objects to abstract query
		$selectSub = new Select();
		$delete = new Delete();

		// Create an placeholders for the IN clause
		$propertyPlaceHolders = $this->createPlaceholders($property_id_list);

		// Build the delete statement
		$delete->from('propertyuserprofile')
				->whereIn('property_id', $propertyPlaceHolders)
				->whereNotIn(
					'userprofile_id',
					$selectSub->column('userprofile_id')
								->from(array('ur'=>'userprofilerole'))
								->join(array('mp'=>'modulepriv'),
									'ur.role_id = mp.tablekey_id',
									array())
								->whereEquals('mp.table_name', "'role'")
								->whereEquals('mp.module_id', '2010')
				);

		return $this->adapter->query($delete, $property_id_list);
	}

	public function removeAssociationToProperties($property_id_list) {
		// Create an placeholders for the IN clause
		$propertyPlaceHolders = $this->createPlaceholders($property_id_list);

		// Build the DELETE SQL statement
		$delete = new Delete();
		$delete->from('propertyuserprofile')
				->whereIn('property_id', $propertyPlaceHolders);
		
		return $this->adapter->query($delete, $property_id_list);
	}
}

?>