<?php
namespace NP\shared;

use NP\core\AbstractGateway;

class AudittypeGateway extends AbstractGateway {
    /**
     * 
     */
    public function findIdByType($audittype) {
        return $this->findValue(
            ['audittype'=>'?'],
            [$audittype],
            'audittype_id'
        );
    }

    public function getIdByTableref($tableref) {
        if (!isset($tableref) || is_null($tableref)) {
            $tableref = 1;
        }

        $result = $this->adapter->query('
            SELECT audittype_id
            FROM AUDITTYPE
            WHERE audittype = (
                SELECT REPLACE(image_tableref_name, \' \', \'\')
                    FROM IMAGE_TABLEREF
                    WHERE image_tableref_id = '.$tableref.'
            )
        ');

        if (!empty($result) && !empty($result[0])) {
            return $result[0]['audittype_id'];
        }
        return 0;
    }
}