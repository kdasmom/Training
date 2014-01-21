<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 1/20/14
 * Time: 4:21 PM
 */

namespace NP\system\sql;


use NP\core\db\Expression;
use NP\core\db\Select;

class CustomFieldSelect extends Select {
	public function __construct($rightPosition, $useUnLike = true) {
		parent::__construct();

		$this->from(['c' => 'configsys'])
			->columns([])
			->join(['cv' => 'configsysval'], 'c.configsys_id = cv.configsys_id', ['controlpanelitem_value' => 'configsysval_val'])
			->whereLike('c.configsys_name', '?')
			->whereEquals('cv.configsysval_active', '?')
			->whereLike('c.configsys_name', '?');

		if ($useUnLike) {
			$this->whereNotLike('c.configsys_name', '?');
		}

		$this->whereEquals(New Expression("left(right(c.configsys_name,{$rightPosition}),1)"), 'right(c2.configsys_name,1)')
			->limit(1);

	}
} 