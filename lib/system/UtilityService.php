<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 11:53 AM
 */

namespace NP\system;


use NP\core\AbstractService;

class UtilityService extends AbstractService {
    protected $utilityGateway;

    public function __construct(UtilityGateway $utilityGateway) {
        $this->utilityGateway = $utilityGateway;
    }

    public function findVendors($pageSize = null, $page = null, $order = 'vendor_name') {
        return $this->utilityGateway->findVendors($pageSize, $page, $order);
    }
} 