<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 1/13/14
 * Time: 1:45 PM
 */

use Phinx\Migration\AbstractMigration;

class ChangeModuleName extends AbstractMigration
{
	/**
	 * Migrate Up.
	 */
	public function up()
	{
		$this->execute("
			UPDATE module SET
			module_name = REPLACE(module_name, 'Vendor Portal', 'VendorConnect')
			WHERE module_name LIKE '%Vendor Portal%'
		");
	}

	/**
	 * Migrate Down.
	 */
	public function down()
	{
		$this->execute("
			UPDATE module SET
			module_name = REPLACE(module_name, 'VendorConnect', 'Vendor Portal')
			WHERE module_name LIKE '%VendorConnect%'
		");
	}
}