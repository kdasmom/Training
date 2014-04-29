<?php

use Phinx\Migration\AbstractMigration;

class AddRegionIdField extends AbstractMigration
{
	/**
	 * Migrate Up.
	 */
	public function up()
	{
		$this->table('WFRULE')
			->addColumn('region_id', 'int', array('null'=>true))
			->update();
	}

	/**
	 * Migrate Down.
	 */
	public function down()
	{
		$this->getAdapter()->dropColumn('WFRULE', 'region_id');
	}
}