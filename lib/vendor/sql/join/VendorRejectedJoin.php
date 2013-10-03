<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/3/13
 * Time: 10:49 PM
 */

namespace NP\vendor\sql\join;


use NP\core\db\Expression;
use NP\core\db\Join;
use NP\core\db\Select;

class VendorRejectedJoin extends Join {
	public function __construct($cols = [], $type = Select::JOIN_INNER, $toAlias = 'rejectTbl', $fromAlias = 'v') {
		$select = new Select();
		$select->from(['v1' => 'vendor'])
				->columns([
					'approval_tracking_id',
					'MostRecentDate' => new Expression('MAX(v1.vendor_lastupdate_date)')
				])
				->group('v1.approval_tracking_id')
				->distinct();

		$this->setTable(array($toAlias => $select))
		  ->setCondition("{$fromAlias}.approval_tracking_id = {$toAlias}.approval_tracking_id and
		  ({$fromAlias}.vendor_lastupdate_date = {$toAlias}.mostrecentdate or {$toAlias}.mostrecentdate is null)")
		  ->setCols($cols)
		  ->setType($type);
	}
} 