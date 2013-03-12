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

	/**
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string $type                        The context filter type; valid values are 'property','region', and 'all'
	 * @param  int    $selection                   The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 */
	public function __construct($userprofile_id, $delegation_to_userprofile_id, $type, $selection) {
		if (!is_numeric($userprofile_id)) {
			throw new \NP\core\Exception('Invalid \$userprofile_id; it should be a number');
		}
		if (!is_numeric($delegation_to_userprofile_id)) {
			throw new \NP\core\Exception('Invalid \$delegation_to_userprofile_id; it should be a number');
		}
		if (!in_array($type, array('property','region','all'))) {
			throw new \NP\core\Exception('Invalid \$type argument; valid types are "property", "region", and "all"');
		}
		if ($type == 'property' && !is_numeric($selection)) {
			throw new \NP\core\Exception('Invalid arguments; when \$type is "property", \$selection should be an integer representing a property ID');
		}
		if ($type == 'region' && !is_numeric($selection)) {
			throw new \NP\core\Exception('Invalid arguments; when \$type is "region", \$selection should be an integer representing a region ID');
		}

		$this->userprofile_id               = $userprofile_id;
		$this->delegation_to_userprofile_id = $delegation_to_userprofile_id;
		$this->type                         = $type;
		$this->selection                    = $selection;
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
	
}

?>