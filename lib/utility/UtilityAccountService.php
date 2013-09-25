<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/26/13
 * Time: 12:42 AM
 */

namespace NP\utility;


use NP\core\AbstractService;

class UtilityAccountService extends AbstractService {
    protected $utilityAccountGateway;

    public function __construct(UtilityAccountGateway $utilityAccountGateway) {
        $this->utilityAccountGateway = $utilityAccountGateway;
    }

    public function get($id) {
        return $this->utilityAccountGateway->findById($id);
    }
} 