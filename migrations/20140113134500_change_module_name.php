<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 1/13/14
 * Time: 1:45 PM
 */

use Phinx\Migration\AbstractMigration;

class ModifyModuleName extends AbstractMigration
{
	/**
	 * Migrate Up.
	 */
	public function up()
	{
		$select = new \NP\core\db\Select();
		$parentSelect = new \NP\core\db\Select();

		$select->from(['m' => 'module'])
				->column('module_id')
				->where(['module_name', '?']);

		$module_id = $this->adapter->query($select, ['Vendor Portal']);

		$parentSelect->from(['t' => 'tree'])
					->column('tree_id')
					->where(['table_name' => 'module', 'tablekey_id' => '?']);

		$parent_id = $this->adapter->query($parentSelect, [$module_id]);

		$this->execute("UPDATE module set module_name = 'VendorConnect' where module_id = {$module_id}");
		$this->execute("update module set module_name = REPLACE(module_name, 'Vendor Portal', 'VendorConnect') where module_id in (select tablekey_id from tree t where t.tree_parent = {$parent_id})");
	}

	/**
	 * Migrate Down.
	 */
	public function down()
	{
		$select = new \NP\core\db\Select();
		$parentSelect = new \NP\core\db\Select();

		$select->from(['m' => 'module'])
			->column('module_id')
			->where(['module_name', '?']);

		$module_id = $this->adapter->query($select, ['VendorConnect']);

		$parentSelect->from(['t' => 'tree'])
			->column('tree_id')
			->where(['table_name' => 'module', 'tablekey_id' => '?']);

		$parent_id = $this->adapter->query($parentSelect, [$module_id]);

		$this->execute("UPDATE module set module_name = 'VendorConnect' where module_id = {$module_id}");
		$this->execute("update module set module_name = REPLACE(module_name, 'VendorConnect', 'Vendor Portal') where module_id in (select tablekey_id from tree t where t.tree_parent = {$parent_id})");
	}
}