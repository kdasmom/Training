<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Update;
use NP\core\db\Delete;

/**
 * Gateway for the PROPERTY table
 *
 * @author Thomas Messier
 */
class PropertyGateway  extends AbstractGateway {
	protected $tableAlias = 'p';
	
	/**
	 * Retrieve a property by Id
	 */
	public function findById($id, $cols=null) {
		$joins = array(
			new sql\join\PropertyAddressJoin(),
			new sql\join\PropertyPhoneJoin(),
			new sql\join\PropertyFaxJoin(),
			new sql\join\PropertyBillToShipToJoin('bill'),
			new sql\join\PropertyBillToShipToJoin('ship')
		);

		$res = $this->find(
			array('p.property_id'=>'?'),
			array($id),
			null,
			$cols,
			null,
			null,
			$joins
		);

		return $res[0];
	}

	/**
	 * Find properties for a given user
	 *
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @return array                               Array of property records
	 */
	public function findByUser($userprofile_id, $delegation_to_userprofile_id, $cols=null) {
		$select = new Select();
		$select->from(array('p'=>'property'))
				->columns($cols)
				->order("p.property_name");
		if ($userprofile_id == $delegation_to_userprofile_id) {
			$select->join(array('pu'=>'propertyuserprofile'),
							"p.property_id = pu.property_id",
							array())
					->where("
						pu.userprofile_id = ?
						AND p.property_status <> 0
					");
			$params = array($userprofile_id);
		} else {
			$select->join(array('dp'=>'delegationprop'),
							"p.property_id = dp.property_id",
							array())
					->join(array('d'=>'delegation'),
							"dp.delegation_id = d.delegation_id",
							array())
					->where('
						d.userprofile_id = ?
						AND d.delegation_to_userprofile_id = ?
						AND d.delegation_status = 1
						AND d.delegation_startdate <= getDate()
						AND d.delegation_stopdate > getDate()
					');
			$params = array($userprofile_id, $delegation_to_userprofile_id);
		}

		return $this->adapter->query($select, $params);
	}

	/**
	 * Find coding access only properties for a given user
	 *
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @return array                               Array of property records
	 */
	public function findCodingByUser($userprofile_id, $cols=null) {
		$select = new Select();
		$select->from(array('p'=>'property'))
				->columns($cols)
				->join(array('pu'=>'propertyusercoding'),
						"p.property_id = pu.property_id",
						array())
				->whereEquals('pu.userprofile_id', '?')
				->whereNotEquals('p.property_status', '0')
				->order("p.property_name");
		
		return $this->adapter->query($select, array($userprofile_id));
	}
	
	public function getBillToShipToProperties($type, $property_id) {
		$type = strtolower($type);

		$validTypes = array('bill','ship');
		if (!in_array($type, $validTypes)) {
			throw new \NP\core\Exception('Invalid $type argument. Valid options for $type are ' . implode(' and ', $validTypes));
		}
		$type = ucfirst($type);

		$select = new Select();
		$select->columns(array(
					'property_id',
					'property_id_alt',
					'property_name'
				))
				->from('property')
				->whereOr()
				->whereEquals('property_id', '?')
				->whereNest()
				->whereIn('property_status', '?,?')
				->whereNest('OR')
				->whereEquals("property_option{$type}Address", 1)
				->whereIsNull("property_option{$type}Address")
				->order('property_name');

		return $this->adapter->query($select, array($property_id, 1,-1));
	}

	/**
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string $property_keyword            A keyword
	 * @return array                               Array of property records
	 */
	public function findForInvoiceItemComboBox($userprofile_id, $delegation_to_userprofile_id, $property_keyword) {
		$select = new Select();
		$select->from(array('p'=>'property'))
				->where('
					EXISTS (
						SELECT *
						FROM propertyuserprofile pu
						WHERE pu.property_id = p.property_id
							AND pu.userprofile_id = ?
					)
					AND (
						property_name LIKE ?
						OR property_id_alt LIKE ?
					)
				')
				->order('p.property_name');
		
		$property_keyword = $property_keyword . '%';
		
		return $this->adapter->query($select, array($userprofile_id,$property_keyword,$property_keyword));
	}

	/**
	 * Updates the status of several properties
	 *
	 * @param  int      $property_status  The status to set the properties to
	 * @param  string[] $property_id_list The IDs for the properties to perform the operation on
	 * @param  int      $userprofile_id   The user performing the operation
	 * @return boolean                    Whether or not the operation was successful
	 */
	public function updatePropertiesStatus($property_status, $property_id_list, $userprofile_id) {
		$now = \NP\util\Util::formatDateForDB();
		$update = new Update();
		
		// Create an placeholders for the IN clause
		$propertyPlaceHolders = $this->createPlaceholders($property_id_list);

		// Create the update statement
		$update->table('property')
				->values(array(
					'property_status'     => '?',
					'last_updated_by'     => '?',
					'last_updated_datetm' => "'{$now}'"
				))
				->whereIn('property_id', $propertyPlaceHolders);

		// Prepend the userprofile_id parameter to the list of property IDs since it comes first in the query
		array_unshift($property_id_list, $property_status, $userprofile_id);

		return $this->adapter->query($update, $property_id_list);
	}
}

?>