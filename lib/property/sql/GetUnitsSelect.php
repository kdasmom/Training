<?php
namespace NP\property\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class GetUnitsSelect extends Select {
	protected $configService;

    public function __construct($unitid = null, $propertyid = null) {
        parent::__construct();

        $this->columns(['building_id_alt'])
           	->from(['b' => 'BUILDING'])
                ->join(['u' => 'UNIT'], 'b.building_id = u.building_id', ['unit_id','unit_number','unittype_id','property_id','unit_id_alt'], Select::JOIN_INNER)
                ->join(['p' => 'property'], 'u.property_id = p.property_id', ['property_name'], Select::JOIN_INNER);

        $where = Where::get()->equals('u.unit_status', "'active'");

        if (!empty($propertyid)) {
            if (is_array($propertyid)) {
                $where->in('u.property_id', implode(',', $propertyid));
            } else {
                $where->equals('u.property_id', $propertyid);
            }
        }

        if (!empty($unitid)) {
            if (is_array($unitid)) {
                $where->in('u.unit_id', implode(',', $unitid));
            } else {
                $where->equals('u.unit_id', $unitid);
            }
        }

        $this->where($where);
    }
}