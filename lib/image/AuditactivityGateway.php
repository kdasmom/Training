<?php
namespace NP\image;

use NP\core\AbstractGateway;
use NP\core\db\Where;

class AuditactivityGateway extends AbstractGateway {
    protected $table = 'auditactivity';

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