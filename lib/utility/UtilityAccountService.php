<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/26/13
 * Time: 12:42 AM
 */

namespace NP\utility;


use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
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

    public function save($data) {

        $utilityAccount = new UtilityAccountEntity($data['utilityaccount']);
        if ($utilityAccount->utilityaccount_id == null) {
            $utilityAccount->Utility_Id = $data['utility_id'];
        }

        $validator = new EntityValidator();
        $validator->validate($utilityAccount);
        $errors = $validator->getErrors();

        if (count($errors) == 0) {
            $this->utilityAccountGateway->beginTransaction();

            try {
                $this->utilityAccountGateway->save($utilityAccount);
                $this->utilityAccountGateway->commit();
            } catch(\Exception $e) {
                // If there was an error, rollback the transaction
                $this->utilityAccountGateway->rollback();
                // Add a global error to the error array
                $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
            }
        }


        return array(
            'success'    => (count($errors)) ? false : true,
            'errors'     => $errors,
        );
    }

    public function getAll($vendorid = null, $propertyid = null, $utilitytypeid = null, $glaccountid = null, $pageSize = null, $page = null, $order = 'vendor_name') {
        $result = $this->utilityAccountGateway->getAll($vendorid, $propertyid, $utilitytypeid, $glaccountid, $pageSize, $page, $order);

        return $result;
    }
} 