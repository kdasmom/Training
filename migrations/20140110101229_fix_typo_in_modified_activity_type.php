<?php

use Phinx\Migration\AbstractMigration;

class FixTypoInModifiedActivityType extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        $this->execute("UPDATE auditactivity SET auditactivity = 'Modified' WHERE auditactivity = 'Modifed'");
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->execute("UPDATE auditactivity SET auditactivity = 'Modifed' WHERE auditactivity = 'Modified'");
    }
}