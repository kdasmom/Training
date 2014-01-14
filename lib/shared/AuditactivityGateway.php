<?php
namespace NP\shared;

use NP\core\AbstractGateway;
use NP\core\db\Where;

class AuditactivityGateway extends AbstractGateway {
    /**
     * Finds an auditactivity_id based on auditactivity value
     * @param  string $auditactivity
     * @return int
     */
    public function findIdByType($auditactivity) {
        return $this->findValue(
            ['auditactivity'=>'?'],
            [$auditactivity],
            'auditactivity_id'
        );
    }

    public function getIdByNames($names) {
        $result = $this->find(
            Where::get()->in(
                'auditactivity',
                '\''.implode('\',\'', $names).'\''
            ),
            [],
            null,
            ['auditactivity_id', 'auditactivity']
        );        

        if (!empty($result)) {
            $data = [];
            foreach($result as $key => $value) {
                $data[$value['auditactivity']] = $value['auditactivity_id'];
            }
            return $data;
        }
        return null;
    }
}