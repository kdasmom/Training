<?php

namespace NP\contact;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the PHONE table
 *
 * @author Thomas Messier
 */
class PhoneGateway extends AbstractGateway {

    public function findByTableNameAndKey($tablename, $key) {
        $select = new Select();

        $select->from(['p' => 'phone'])
            ->where('p.table_name = ? and p.tablekey_id = ?');

        $phone = $this->adapter->query($select, [$tablename, $key]);

        return $phone[0];
    }
}

?>