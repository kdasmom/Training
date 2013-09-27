<?php

namespace NP\contact;

use NP\core\AbstractGateway;
use NP\core\db\Update;

/**
 * Gateway for the PERSON table
 *
 * @author Thomas Messier
 */
class PersonGateway extends AbstractGateway {

    public function updateForUtility($data, $person_id) {
        $update = new Update();

        $update->table('person')
            ->values(['person_firstname' => '?', 'person_middlename' => '?', 'person_lastname' => '?'])
            ->where(['person_id' => '?']);

        return $this->adapter->query($update, [$data['person_firstname'], $data['person_middlename'], $data['person_lastname'], $person_id]);
    }
}

?>