<?php

use Phinx\Migration\AbstractMigration;

class AddNoCountToPropertyTriggers extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        $this->execute("
ALTER TRIGGER [dbo].[AuditTracker_Property] ON [dbo].[PROPERTY] 
FOR INSERT, UPDATE, DELETE 
AS
DECLARE @exclude_fields varchar(8000),
    @field int ,
    @maxfield int ,
    @fieldname varchar(128) ,
    @TableName varchar(128) ,
    @sql varchar(2000), 
    @UpdateDate varchar(21) ,
    @UserName varchar(128),
    @the_userprofile_id varchar(120),
    @activity_id varchar(1),
    @start_id int,
    @audittype_id varchar(1),
    @run_audit varchar(255)

SET IMPLICIT_TRANSACTIONS OFF
SET NOCOUNT ON

SELECT @run_audit = cv.configsysval_val
FROM configsys c
    INNER JOIN configsysval cv ON c.configsys_id = cv.configsys_id
WHERE c.configsys_name = 'CP.AUDITPROPERTY'
IF (@run_audit = '1')
BEGIN

SET @tablename = 'property';
SET @audittype_id = '9';


SELECT @the_userprofile_id =  Convert(varchar(50),context_info) 
FROM master.dbo.sysprocesses
WHERE SPID = @@SPID
SET @the_userprofile_id = RTRIM(LTRIM(@the_userprofile_id));
SET @start_id = CHARINDEX ('|',@the_userprofile_id);

IF (@start_id > 0)
BEGIN
    
    declare @localcount int;
    select @localcount = count(*) from inserted;
    IF @localcount = 1
    BEGIN
        IF ((SELECT property_id FROM deleted) is not NULL AND (SELECT property_id FROM inserted) is NULL)
            SET @activity_id = '3';
        ELSE IF ((SELECT property_id FROM deleted) is NULL)
            SET @activity_id = '1';
        ELSE
            SET @activity_id = '2';
    
        SET @start_id = @start_id - 1;
        SET @the_userprofile_id = LEFT(@the_userprofile_id,@start_id);
    
        DECLARE @property_id int;

        IF (@activity_id = '3')
        BEGIN
            DECLARE @property_id_alt varchar(100)
            SELECT @property_id = property_id, @property_id_alt = property_id_alt FROM deleted
        
            INSERT INTO AuditLog (field_old_value,tablekey_id, auditactivity_id, audittype_id,userprofile_id)
            VALUES (@property_id_alt,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
        END
        ELSE
        BEGIN
            Declare @my_var varchar(1000);
            Declare @my_var_old varchar(1000);
            SELECT @property_id = property_id from inserted         

            IF UPDATE(property_id_alt)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_id_alt AS varchar(1000)), 255) FROM inserted;              
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_id_alt AS varchar(1000)), 255) FROM deleted;        
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_id_alt',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_id_alt_ap)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_id_alt_ap AS varchar(1000)), 255) FROM inserted;               
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_id_alt_ap AS varchar(1000)), 255) FROM deleted;     
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_id_alt_ap',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_department_code)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_department_code AS varchar(1000)), 255) FROM inserted;             
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_department_code AS varchar(1000)), 255) FROM deleted;       
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_department_code',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_name)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_name AS varchar(1000)), 255) FROM inserted;                
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_name AS varchar(1000)), 255) FROM deleted;      
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_name',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_salestax)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_salestax AS varchar(1000)), 255) FROM inserted;                
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_salestax AS varchar(1000)), 255) FROM deleted;      
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_salestax',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_no_units)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_no_units AS varchar(1000)), 255) FROM inserted;                
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_no_units AS varchar(1000)), 255) FROM deleted;      
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_no_units',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(fixedasset_account)
            BEGIN
                select @my_var = LEFT(CAST(inserted.fixedasset_account AS varchar(1000)), 255) FROM inserted;               
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.fixedasset_account AS varchar(1000)), 255) FROM deleted;     
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('fixedasset_account',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(matching_threshold)
            BEGIN
                select @my_var = LEFT(CAST(inserted.matching_threshold AS varchar(1000)), 255) FROM inserted;               
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.matching_threshold AS varchar(1000)), 255) FROM deleted;     
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('matching_threshold',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_status)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_status AS varchar(1000)), 255) FROM inserted;              
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_status AS varchar(1000)), 255) FROM deleted;        
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_status',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(region_id)
            BEGIN
                select @my_var = LEFT(CAST(inserted.region_id AS varchar(1000)), 255) FROM inserted;                
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.region_id AS varchar(1000)), 255) FROM deleted;      
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('region_id',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(integration_package_id)
            BEGIN
                select @my_var = LEFT(CAST(inserted.integration_package_id AS varchar(1000)), 255) FROM inserted;               
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.integration_package_id AS varchar(1000)), 255) FROM deleted;     
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('integration_package_id',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(sync)
            BEGIN
                select @my_var = LEFT(CAST(inserted.sync AS varchar(1000)), 255) FROM inserted;             
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.sync AS varchar(1000)), 255) FROM deleted;       
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('sync',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(fiscaldisplaytype_value)
            BEGIN
                select @my_var = LEFT(CAST(inserted.fiscaldisplaytype_value AS varchar(1000)), 255) FROM inserted;              
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.fiscaldisplaytype_value AS varchar(1000)), 255) FROM deleted;        
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('fiscaldisplaytype_value',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END
        END
    END

END


END
SET IMPLICIT_TRANSACTIONS ON
        ");
        
        $this->execute("
ALTER TRIGGER [dbo].[LastUpdated_Property] ON [dbo].[PROPERTY] 
FOR INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON

    UPDATE property SET
    last_updated_datetm = getDate()
    WHERE property_id IN (
        SELECT property_id
        FROM inserted
    );
END
SET IMPLICIT_TRANSACTIONS ON
        ");
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $this->execute("
ALTER TRIGGER [dbo].[AuditTracker_Property] ON [dbo].[PROPERTY] 
FOR INSERT, UPDATE, DELETE 
AS
DECLARE @exclude_fields varchar(8000),
    @field int ,
    @maxfield int ,
    @fieldname varchar(128) ,
    @TableName varchar(128) ,
    @sql varchar(2000), 
    @UpdateDate varchar(21) ,
    @UserName varchar(128),
    @the_userprofile_id varchar(120),
    @activity_id varchar(1),
    @start_id int,
    @audittype_id varchar(1),
    @run_audit varchar(255)

SET IMPLICIT_TRANSACTIONS OFF

SELECT @run_audit = cv.configsysval_val
FROM configsys c
    INNER JOIN configsysval cv ON c.configsys_id = cv.configsys_id
WHERE c.configsys_name = 'CP.AUDITPROPERTY'
IF (@run_audit = '1')
BEGIN

SET @tablename = 'property';
SET @audittype_id = '9';


SELECT @the_userprofile_id =  Convert(varchar(50),context_info) 
FROM master.dbo.sysprocesses
WHERE SPID = @@SPID
SET @the_userprofile_id = RTRIM(LTRIM(@the_userprofile_id));
SET @start_id = CHARINDEX ('|',@the_userprofile_id);

IF (@start_id > 0)
BEGIN
    
    declare @localcount int;
    select @localcount = count(*) from inserted;
    IF @localcount = 1
    BEGIN
        IF ((SELECT property_id FROM deleted) is not NULL AND (SELECT property_id FROM inserted) is NULL)
            SET @activity_id = '3';
        ELSE IF ((SELECT property_id FROM deleted) is NULL)
            SET @activity_id = '1';
        ELSE
            SET @activity_id = '2';
    
        SET @start_id = @start_id - 1;
        SET @the_userprofile_id = LEFT(@the_userprofile_id,@start_id);
    
        DECLARE @property_id int;

        IF (@activity_id = '3')
        BEGIN
            DECLARE @property_id_alt varchar(100)
            SELECT @property_id = property_id, @property_id_alt = property_id_alt FROM deleted
        
            INSERT INTO AuditLog (field_old_value,tablekey_id, auditactivity_id, audittype_id,userprofile_id)
            VALUES (@property_id_alt,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
        END
        ELSE
        BEGIN
            Declare @my_var varchar(1000);
            Declare @my_var_old varchar(1000);
            SELECT @property_id = property_id from inserted         

            IF UPDATE(property_id_alt)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_id_alt AS varchar(1000)), 255) FROM inserted;              
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_id_alt AS varchar(1000)), 255) FROM deleted;        
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_id_alt',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_id_alt_ap)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_id_alt_ap AS varchar(1000)), 255) FROM inserted;               
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_id_alt_ap AS varchar(1000)), 255) FROM deleted;     
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_id_alt_ap',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_department_code)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_department_code AS varchar(1000)), 255) FROM inserted;             
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_department_code AS varchar(1000)), 255) FROM deleted;       
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_department_code',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_name)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_name AS varchar(1000)), 255) FROM inserted;                
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_name AS varchar(1000)), 255) FROM deleted;      
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_name',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_salestax)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_salestax AS varchar(1000)), 255) FROM inserted;                
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_salestax AS varchar(1000)), 255) FROM deleted;      
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_salestax',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_no_units)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_no_units AS varchar(1000)), 255) FROM inserted;                
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_no_units AS varchar(1000)), 255) FROM deleted;      
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_no_units',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(fixedasset_account)
            BEGIN
                select @my_var = LEFT(CAST(inserted.fixedasset_account AS varchar(1000)), 255) FROM inserted;               
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.fixedasset_account AS varchar(1000)), 255) FROM deleted;     
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('fixedasset_account',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(matching_threshold)
            BEGIN
                select @my_var = LEFT(CAST(inserted.matching_threshold AS varchar(1000)), 255) FROM inserted;               
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.matching_threshold AS varchar(1000)), 255) FROM deleted;     
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('matching_threshold',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(property_status)
            BEGIN
                select @my_var = LEFT(CAST(inserted.property_status AS varchar(1000)), 255) FROM inserted;              
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.property_status AS varchar(1000)), 255) FROM deleted;        
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('property_status',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(region_id)
            BEGIN
                select @my_var = LEFT(CAST(inserted.region_id AS varchar(1000)), 255) FROM inserted;                
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.region_id AS varchar(1000)), 255) FROM deleted;      
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('region_id',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(integration_package_id)
            BEGIN
                select @my_var = LEFT(CAST(inserted.integration_package_id AS varchar(1000)), 255) FROM inserted;               
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.integration_package_id AS varchar(1000)), 255) FROM deleted;     
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('integration_package_id',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(sync)
            BEGIN
                select @my_var = LEFT(CAST(inserted.sync AS varchar(1000)), 255) FROM inserted;             
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.sync AS varchar(1000)), 255) FROM deleted;       
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('sync',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END

            IF UPDATE(fiscaldisplaytype_value)
            BEGIN
                select @my_var = LEFT(CAST(inserted.fiscaldisplaytype_value AS varchar(1000)), 255) FROM inserted;              
                IF (@activity_id = 2)
                    BEGIN
                        select @my_var_old = LEFT(CAST(deleted.fiscaldisplaytype_value AS varchar(1000)), 255) FROM deleted;        
                    END
                INSERT INTO AuditLog (field_name, field_new_value, field_old_value, tablekey_id, auditactivity_id, audittype_id,userprofile_id)
                VALUES ('fiscaldisplaytype_value',@my_var,@my_var_old,@property_id,@activity_id,@audittype_id,@the_userprofile_id)
            END
        END
    END

END


END
SET IMPLICIT_TRANSACTIONS ON
        ");
        
        $this->execute("
ALTER TRIGGER [dbo].[LastUpdated_Property] ON [dbo].[PROPERTY] 
FOR INSERT, UPDATE
AS
BEGIN
    UPDATE property SET
    last_updated_datetm = getDate()
    WHERE property_id IN (
        SELECT property_id
        FROM inserted
    );
END
SET IMPLICIT_TRANSACTIONS ON
        ");
    }
}