<?php

use Phinx\Migration\AbstractMigration;

class AddClientLogoPathField extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        $this->table('CLIENT')
             ->addColumn('logo_file', 'string', array('null'=>true))
             ->update();
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->getAdapter()->dropColumn('CLIENT', 'logo_file');
    }
}