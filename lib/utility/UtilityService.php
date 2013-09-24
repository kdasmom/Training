<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 11:53 AM
 */

namespace NP\utility;


use NP\contact\PersonGateway;
use NP\contact\PhoneGateway;
use NP\core\AbstractService;
use NP\system\ConfigService;
use NP\vendor\VendorGateway;

class UtilityService extends AbstractService {
    protected $utilityGateway;
    protected $vendorGateway;
    protected $contactGateway;
    protected $personGateway;
    protected $phoneGateway;
    protected $configService;

    public function __construct(UtilityGateway $utilityGateway, VendorGateway $vendorGateway, PersonGateway $personGateway, PhoneGateway $phoneGateway, ConfigService $configService) {
        $this->utilityGateway = $utilityGateway;

        $this->vendorGateway = $vendorGateway;
        $this->personGateway = $personGateway;
        $this->phoneGateway = $phoneGateway;
        $this->configService = $configService;
    }

    public function findVendors($pageSize = null, $page = null, $order = 'vendor_name') {
        return $this->utilityGateway->findVendors($pageSize, $page, $order);
    }

    public function saveUtility($data) {
    }
} 