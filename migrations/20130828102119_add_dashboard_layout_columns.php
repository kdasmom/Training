<?php

use Phinx\Migration\AbstractMigration;

class AddDashboardLayoutColumns extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        $this->table('USERPROFILE')
             ->addColumn('userprofile_dashboard_layout', 'text', array('null'=>true))
             ->update();

        $this->table('ROLE')
             ->addColumn('role_dashboard_layout', 'text', array('null'=>true))
             ->update();
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->getAdapter()->dropColumn('USERPROFILE', 'userprofile_dashboard_layout');
        $this->getAdapter()->dropColumn('ROLE', 'role_dashboard_layout');
    }
}