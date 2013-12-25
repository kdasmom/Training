<?php
namespace NP\property\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class GetPropertiesCountSelect extends Select {
    public function __construct($asp_client_id) {
        parent::__construct();

        $this
            ->count()
            ->columns([
                'property_id'
            ])
            ->from('PROPERTY')
                ->join(new join\PropertyIntPkgJoin([], Select::JOIN_INNER, 'ip', 'PROPERTY'))
                ->join(new join\PropertyRegionJoin(['region_name'], Select::JOIN_LEFT, 'REGION', 'PROPERTY'))
        ;

        $where = Where::get()
            ->nest('OR')
                ->equals('PROPERTY.property_status', 1)
                ->equals('PROPERTY.property_status', -1)
            ->unnest()
            ->equals('ip.asp_client_id', $asp_client_id)
        ;
        $this->where($where);
    }
}