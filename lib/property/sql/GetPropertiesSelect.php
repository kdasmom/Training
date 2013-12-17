<?php
namespace NP\property\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class GetPropertiesSelect extends Select {
    public function __construct($properties, $asp_client_id) {
        parent::__construct();

        $this
            ->columns([
                'property_id',
                'property_name'
            ])
            ->from(['PROPERTY'])
                ->join(new join\PropertyIntPkgJoin([], Select::JOIN_INNER, 'ip', 'PROPERTY'))
                ->join(new join\PropertyRegionJoin(['region_name'], Select::JOIN_LEFT, 'REGION', 'PROPERTY'))
            ->order('REGION.region_name, PROPERTY.property_name')
        ;

        $where = Where::get()
            ->nest('OR')
                ->equals('PROPERTY.property_status', 1)
                ->equals('PROPERTY.property_status', -1)
            ->unnest()
            ->equals('ip.asp_client_id', $asp_client_id)
            ->in('PROPERTY.property_id', implode(',', $properties))
        ;
        $this->where($where);
    }
}
/*
        SELECT
            PROPERTY.property_id, 
            PROPERTY.property_name, 
            CASE 
                WHEN Region.region_name IS NULL THEN 'None' 
                ELSE Region.region_name 
            END AS Region_Name
        FROM PROPERTY 
            INNER JOIN INTEGRATIONPACKAGE ip ON PROPERTY.integration_package_id = ip.integration_package_id 
            LEFT OUTER JOIN REGION ON PROPERTY.region_id = REGION.region_id
	WHERE (
            PROPERTY.property_status = 1 OR 
            PROPERTY.property_status = - 1
        ) AND (
            ip.asp_client_id = <cfqueryparam value="#client.asp_client_id#" cfsqltype="CF_SQL_INTEGER">
        )
	ORDER BY 
            Region.region_name, 
            PROPERTY.property_name			
*/