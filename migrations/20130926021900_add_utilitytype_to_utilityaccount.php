<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/26/13
 * Time: 2:19 AM
 */

use Phinx\Migration\AbstractMigration;

class AddUtilityTypeToUtilityAccount extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        $this->table('UTILITYACCOUNT')
            ->addColumn('UtilityType_Id', 'int', array('null'=>true))
            ->addForeignKey('UtilityType_id', 'UTILITYTYPE', 'UtilityType_Id')
            ->update();
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->getAdapter()->dropColumn('UTILITYACCOUNT', 'UtilityType_Id');
    }
}