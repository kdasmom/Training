<?php

use Phinx\Migration\AbstractMigration;

class RemoveEmailAlertHourCol extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up() {
        $this->getAdapter()->dropColumn('EMAILALERTHOUR', 'emailalert_id');
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->table('EMAILALERTHOUR')
             ->addColumn('emailalert_id', 'int', array('null'=>true))
             ->update();
    }
}