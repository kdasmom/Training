<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the PROPERTYGLACCOUNT table
 *
 * @author Thomas Messier
 */
class PropertyGlAccountGateway extends AbstractGateway {
	protected $tableAlias = 'pg';

	/**
	 * Override getSelect() to include some joins
	 */
	public function getSelect() {
		$select = new Select();
		$select->from(array('pg'=>'propertyglaccount'))
				->join(array('p'=>'property'),
						'pg.property_id = p.property_id',
						array('property_id_alt','property_name'))
				->join(array('g'=>'glaccount'),
						'pg.glaccount_id = g.glaccount_id',
						array('glaccount_number','glaccount_name'));
		return $select;
	}
}

?>