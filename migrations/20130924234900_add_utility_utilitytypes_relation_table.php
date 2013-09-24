<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 11:49 PM
 */

use Phinx\Migration\AbstractMigration;

class AddUtilityUtilityTypesRelationTalbe extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        $table = $this->table('UTILITYTYPES', array('id'=>false));
        $table->addColumn('Utility_Id', 'integer')
            ->addColumn('UtilityType_Id', 'integer')
            ->addForeignKey('Utility_Id', 'UTILITY', 'Utility_Id')
            ->addForeignKey('UtilityType_Id', 'UTILITYTYPE', 'UtilityType_Id')
            ->create();
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->dropTable('UTILITYTYPES');
    }
}