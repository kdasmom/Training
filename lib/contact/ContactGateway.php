<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 5:41 PM
 */

namespace NP\contact;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;

class ContactGateway extends AbstractGateway {

    public function __construct(Adapter $adapter) {
        return parent::__construct($adapter);
    }

    public function findByTableNameAndKey($tablename, $key) {
        $select = new Select();

        $select->from(['c' => 'contact'])
            ->where('c.table_name = ? and c.tablekey_id = ?');

        $contact = $this->adapter->query($select, [$tablename, $key]);
        return $contact[0];
    }
}