<?php

use Phinx\Migration\AbstractMigration;

class AddUnitRequiredSetting extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up() {
        $this->execute("
DECLARE @configsysclient_id int, @configsys_id int, @configsystype_id int, @configsys_order int, @configsyslkp_id int, @configsyscat_id int;

SELECT TOP 1 @configsysclient_id = configsysclient_id FROM configsysclient;

SELECT @configsyscat_id = configsyscat_id
FROM configsyscat
WHERE configsyscat_name = 'Invoice';

IF NOT EXISTS (SELECT * FROM configsys WHERE configsys_name = 'PN.InvoiceOptions.unitFieldReq')
BEGIN
    SELECT @configsystype_id = configsystype_id
    FROM configsystype
    WHERE configsystype_name = 'Yes/No';
    
    SELECT @configsys_order = MAX(configsys_order) + 1 
    FROM configsys 
    WHERE configsyscat_id = @configsyscat_id;
    
    INSERT INTO configsys (
        configsyscat_id,
        configsystype_id,
        configsys_displayname,
        configsys_shortname,
        configsys_name,
        configsys_required,
        configsys_default_val,
        configsys_default_show,
        configsys_default_load,
        configsys_order,
        configsys_created_datetm
    ) VALUES (
        @configsyscat_id,
        @configsystype_id,
        'Do you want the unit/department field to be required (applies to both invoices and POs)?',
        'Unit Required',
        'PN.InvoiceOptions.unitFieldReq',
        1,
        '0',
        1,
        1,
        @configsys_order,
        getDate()
    );
    
    SET @configsys_id = @@IDENTITY; 
    
    INSERT INTO configsysval (
        configsys_id,
        configsysclient_id,
        configsysval_val,
        configsysval_load,
        configsysval_show,
        configsysval_active,
        configsysval_created_datetm,
        configsysval_created_by,
        configsysval_updated_datetm,
        configsysval_updated_by
    ) VALUES (
        @configsys_id,
        @configsysclient_id,
        '0',
        1,
        1,
        1,
        getDate(),
        NULL,
        getDate(),
        NULL
    );
END
        ");
    }

    /**
     * Migrate Down.
     */
    public function down() {
        $this->execute("
DECLARE @configsys_id int;

SELECT @configsys_id = configsys_id FROM configsys WHERE configsys_name = 'PN.InvoiceOptions.unitFieldReq';

IF (@configsys_id IS NOT NULL)
BEGIN
    DELETE FROM configsysval WHERE configsys_id = @configsys_id;
    DELETE FROM configsys WHERE configsys_id = @configsys_id;
END
        ");
    }
}