<?php

use Phinx\Migration\AbstractMigration;

class ModifyDateFormatSetting extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        $this->execute("UPDATE CONFIGSYSLKPVAL SET configsyslkpval_name = 'm/d/Y', configsyslkpval_val = 'm/d/Y' WHERE configsyslkpval_val = 'mm/dd/yyyy'");
        $this->execute("UPDATE CONFIGSYSLKPVAL SET configsyslkpval_name = 'd/m/Y', configsyslkpval_val = 'd/m/Y' WHERE configsyslkpval_val = 'dd/mm/yyyy'");
        $this->execute("
            UPDATE cv SET
            cv.configsysval_val = CASE
                                    WHEN cv.configsysval_val = 'dd/mm/yyyy' THEN 'd/m/Y'
                                    ELSE 'm/d/Y'
                                END
            FROM configsysval cv 
                INNER JOIN configsys c ON c.configsys_id = cv.configsys_id
            WHERE c.configsys_name = 'PN.Intl.DateFormat'
        ");
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->execute("UPDATE CONFIGSYSLKPVAL SET configsyslkpval_name = 'mm/dd/yyyy', configsyslkpval_val = 'mm/dd/yyyy' WHERE configsyslkpval_val = 'm/d/Y'");
        $this->execute("UPDATE CONFIGSYSLKPVAL SET configsyslkpval_name = 'dd/mm/yyyy', configsyslkpval_val = 'dd/mm/yyyy' WHERE configsyslkpval_val = 'd/m/Y'");
        $this->execute("
            UPDATE cv SET
            cv.configsysval_val = CASE
                                    WHEN cv.configsysval_val = 'd/m/Y' THEN 'dd/mm/yyyy'
                                    ELSE 'mm/dd/yyyy'
                                END
            FROM configsysval cv 
                INNER JOIN configsys c ON c.configsys_id = cv.configsys_id
            WHERE c.configsys_name = 'PN.Intl.DateFormat'
        ");
    }
}