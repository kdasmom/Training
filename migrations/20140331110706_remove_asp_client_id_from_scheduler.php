<?php

use Phinx\Migration\AbstractMigration;

class RemoveAspClientIdFromScheduler extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        $this->getAdapter()->dropColumn('SCHEDULEDTASKS', 'asp_client_id');
        $this->getAdapter()->dropColumn('RECURRINGSCHEDULER', 'asp_client_id');
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->table('SCHEDULEDTASKS')
             ->addColumn('asp_client_id', 'integer', array('null'=>true))
             ->update();

        $this->execute("UPDATE SCHEDULEDTASKS SET asp_client_id = (SELECT TOP 1 asp_client_id FROM client)");
        
        $this->table('RECURRINGSCHEDULER')
             ->addColumn('asp_client_id', 'integer', array('null'=>true))
             ->update();

        $this->execute("UPDATE RECURRINGSCHEDULER SET asp_client_id = (SELECT TOP 1 asp_client_id FROM client)");
    }
}