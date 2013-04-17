<?php

namespace NP\catalog\sql;

use NP\core\db\Select;

/**
 * A custom Select object for Vc records with some shortcut methods
 *
 * @author Thomas Messier
 */
class VcSelect extends Select {
	
	public function __construct() {
		parent::__construct();
		$this->from(array('v'=>'vc'));
	}
	
	/**
	 * Adds the number of items subquery as a column
	 *
	 * @param \NP\catalog\sql\VcSelect Returns caller object for easy chaining
	 */
	public function columnNumberOfItems() {
		$subSelect = new Select();
		$subSelect->from(array('vi'=>'vcitem'))
					->count()
					->where('v.vc_id = vi.vc_id AND vi.vcitem_status = 1');
		
		return $this->column($subSelect, 'vc_total_items');
	}

	/**
	 * Joins USERPROFILE table for user that created catalog
	 *
	 * @param \NP\catalog\sql\VcSelect Returns caller object for easy chaining
	 */
	public function joinCreator($cols=array(), $type=self::JOIN_LEFT) {
		return $this->join(array('u' => 'userprofile'),
						"v.vc_createdby = u.userprofile_id",
						$cols,
						$type);
	}

	/**
	 * Joins USERPROFILE table for user that last updated catalog
	 *
	 * @param \NP\catalog\sql\VcSelect Returns caller object for easy chaining
	 */
	public function joinUpdater($cols=array(), $type=self::JOIN_LEFT) {
		return $this->join(array('u2' => 'userprofile'),
						"v.vc_lastupdateby = u2.userprofile_id",
						$cols,
						$type);
	}
	
}