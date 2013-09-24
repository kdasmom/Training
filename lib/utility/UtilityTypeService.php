<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 2:19 PM
 */

namespace NP\utility;


use NP\contact\PersonGateway;
use NP\contact\PhoneGateway;
use NP\core\AbstractService;
use NP\system\ConfigService;
use NP\vendor\VendorGateway;

class UtilityTypeService extends AbstractService {

    protected $utilitytypeGateway;
    protected $vendorGateway;
    protected $contactGateway;
    protected $personGateway;
    protected $phoneGateway;
    protected $configService;

    public function __construct(UtilityTypeGateway $utilitytypeGateway) {
        $this->utilitytypeGateway = $utilitytypeGateway;
    }

    public function findAll($pageSize = null, $page = null, $order = "UtilityType") {
        return $this->utilitytypeGateway->find(null, [], $order, ['UtilityType_Id', 'UtilityType'], $pageSize, $page);
    }


} 