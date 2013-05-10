<?php

use Phinx\Migration\AbstractMigration;

class AddEmailAlertTypeCol extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        $this->table('EMAILALERTTYPE')
             ->addColumn('emailalerttype_showdays', 'boolean', array('null'=>true))
             ->update();

        $this->execute("UPDATE EMAILALERTTYPE SET emailalerttype_showdays = 0");
        $this->execute("UPDATE EMAILALERTTYPE SET emailalerttype_showdays = 1 WHERE emailalerttype_id_alt IN (25,26,27,28,29,30,34,35,38)");
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->getAdapter()->dropColumn('EMAILALERTTYPE', 'emailalerttype_showdays');
    }
}