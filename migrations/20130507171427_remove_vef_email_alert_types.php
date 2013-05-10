<?php

use Phinx\Migration\AbstractMigration;

class RemoveVefEmailAlertTypes extends AbstractMigration
{
    /**
     * Migrate Up.
     */
    public function up()
    {
        $this->execute("DELETE FROM emailalerttype WHERE emailalerttype_category = 'vef'");
    }

    /**
     * Migrate Down.
     */
    public function down()
    {
        $recs = array(
            array('name'=>'Vendor Estimate Approval: First Time Only', 'function'=>2, 'id'=>15),
            array('name'=>'Vendor Estimate Approval', 'function'=>2, 'id'=>16),
            array('name'=>'Vendor Estimate Approval: Final Approval Only', 'function'=>2, 'id'=>17),
            array('name'=>'Vendor Estimate Rejection', 'function'=>2, 'id'=>18),
            array('name'=>'Vendor Estimate In Revision', 'function'=>2, 'id'=>19),
            array('name'=>'My Vendor Estimates Pending Approval (Sends to Originator)', 'function'=>2, 'id'=>27),
            array('name'=>'Vendor Estimate Pending Approval', 'function'=>2, 'id'=>30),
            array('name'=>'Vendor Estimate Approval', 'function'=>1, 'id'=>7),
        );
        foreach ($recs as $rec) {
            $this->execute("INSERT INTO emailalerttype ( emailalerttype_name, emailalerttype_function, emailalerttype_category, emailalerttype_module_id_list, emailalerttype_id_alt ) VALUES ('{$rec['name']}', {$rec['function']}, 'vef', '2090', {$rec['id']})");
        }
    }
}