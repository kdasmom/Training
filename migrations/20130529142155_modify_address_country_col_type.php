<?php

use Phinx\Migration\AbstractMigration;

class ModifyAddressCountryColType extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        // Change fields that are set to a blank string to NULL
        $this->execute("UPDATE address SET address_country = NULL WHERE address_country = ''");
        // Change the column type to smallint, since it should have never been a varchar in the first place
        $this->execute("ALTER TABLE address ALTER COLUMN address_country smallint");
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->execute("UPDATE address SET address_country = '' WHERE address_country IS NULL");
        $this->execute("ALTER TABLE address ALTER COLUMN address_country varchar(100)");
    }
}