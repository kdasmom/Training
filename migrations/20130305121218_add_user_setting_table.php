<?php

use Phinx\Migration\AbstractMigration;

class AddUserSettingTable extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        $table = $this->table('USERSETTING', array('id'=>false, 'primary_key'=>array('usersetting_id')));
        $table->addColumn('usersetting_id', 'integer', array('identity'=>true))
              ->addColumn('userprofile_id', 'integer')
              ->addColumn('usersetting_name', 'string')
              ->addColumn('usersetting_value', 'text')
              ->addForeignKey('userprofile_id', 'USERPROFILE', 'userprofile_id')
              ->create();
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->dropTable('USERSETTING');
    }
}