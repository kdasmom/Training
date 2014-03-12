<?php

namespace NP\property;

/**
 * PropertyContext just encapsulates a property context as selected by a user on the UI
 * (radio boxes with Current Property, Region, and All Properties along with the dropdown)
 *
 * @author Thomas Messier
 */
class PropertyContext {
	
	protected $userprofile_id;
	protected $delegation_to_userprofile_id;
	protected $type;
	protected $selection;
	protected $property_status;
	protected $includeCodingOnly;

	/**
	 * @param  int     $userprofile_id              The active user ID, can be a delegated account
	 * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string  $type                        The context filter type; valid values are 'property','region', and 'all'
	 * @param  mixed   $selection                   The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  mixed   $property_status             Status of properties to retrieve; only applies to filter type 'all', can be an array of statuses or an integer for a status (0,-1,1)
	 * @param  boolean $includeCodingOnly           Whether or not to include coding access only properties; defaults to false
	 */
	public function __construct($userprofile_id, $delegation_to_userprofile_id, $type, $selection, $property_status=null, $includeCodingOnly=false) {
		if (!is_numeric($userprofile_id)) {
			throw new \NP\core\Exception('Invalid \$userprofile_id; it should be a number');
		}
		if (!is_numeric($delegation_to_userprofile_id)) {
			throw new \NP\core\Exception('Invalid \$delegation_to_userprofile_id; it should be a number');
		}
		if (!in_array($type, array('property','multiProperty','region','all'))) {
			throw new \NP\core\Exception('Invalid \$type argument; valid types are "property", "multiProperty", "region", and "all"');
		}
		if ($type == 'multiProperty') {
			$type = 'property';
		}
		if (($type == 'property' || $type == 'region') && !is_numeric($selection)) {
			if (is_array($selection)) {
				$items = implode(',', $selection);
				if (preg_match('/[^0-9,]/', $items) != 0) {
					throw new \NP\core\Exception("Invalid arguments; the array of {$type} IDs contains non numeric items");
				}
			} else {
				throw new \NP\core\Exception("Invalid arguments; {$type} ID must be either an integer or an array");
			}
		}

		if (is_int($property_status)) {
			$property_status = [$property_status];
		}

		$this->userprofile_id               = $userprofile_id;
		$this->delegation_to_userprofile_id = $delegation_to_userprofile_id;
		$this->type                         = $type;
		$this->selection                    = $selection;
		$this->property_status              = $property_status;
		$this->includeCodingOnly            = $includeCodingOnly;
	}

	/**
	 * Getter for userprofile_id
	 */
	public function getUserId() {
		return $this->userprofile_id;
	}

	/**
	 * Getter for delegation_to_userprofile_id
	 */
	public function getDelegationToUserId() {
		return $this->delegation_to_userprofile_id;
	}

	/**
	 * Getter for type
	 */
	public function getType() {
		return $this->type;
	}

	/**
	 * Getter for selection
	 */
	public function getSelection() {
		return $this->selection;
	}

	/**
	 * Getter for property status
	 */
	public function getPropertyStatus() {
		return $this->property_status;
	}

	/**
	 * Getter for coding only
	 */
	public function includeCoding() {
		return $this->includeCodingOnly;
	}

	public function toArray() {
		return [
			'userprofile_id'               => $this->userprofile_id,
			'delegation_to_userprofile_id' => $this->delegation_to_userprofile_id,
			'type'                         => $this->type,
			'selection'                    => $this->selection,
			'includeCodingOnly'            => $this->includeCodingOnly
		];
	}
	
}

?>