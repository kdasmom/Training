<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/26/13
 * Time: 12:42 AM
 */

namespace NP\utility;


use NP\core\AbstractService;
use NP\property\UnitGateway;

class UtilityAccountService extends AbstractService {
    protected $utilityAccountGateway;
    protected $unitGateway;

    public function __construct(UtilityAccountGateway $utilityAccountGateway, UnitGateway $unitGateway) {
        $this->utilityAccountGateway = $utilityAccountGateway;
        $this->unitGateway = $unitGateway;
    }

    public function get($id) {
        return $this->utilityAccountGateway->findById($id);
    }

    public function getUnits($property_id) {
        return $this->unitGateway->findUnitsByPropertyId($property_id);
    }
} 