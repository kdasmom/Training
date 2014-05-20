<?php

use Phinx\Migration\AbstractMigration;

class AddRegionIdCol extends AbstractMigration
{
	/**
	 * Migrate Up.
	 */
	public function up()
	{
		$this->table('WFRULE')
			->addColumn('region_id', 'integer', array('null'=>true))
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