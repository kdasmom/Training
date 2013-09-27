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
    protected $utilityGateway;

    public function __construct(UtilityAccountGateway $utilityAccountGateway, UnitGateway $unitGateway, UtilityGateway $utilityGateway) {
        $this->utilityAccountGateway = $utilityAccountGateway;
        $this->unitGateway = $unitGateway;
        $this->utilityGateway = $utilityGateway;
    }

    public function get($id) {
        return $this->utilityAccountGateway->findById($id);
    }

    public function getUnits($property_id) {
        return $this->unitGateway->findUnitsByPropertyId($property_id);
    }

    public function save($data) {

        $utilityAccount = new UtilityAccountEntity($data['utilityaccount']);

        $utilityAccount->utilityaccount_id = $data['utilityaccount']['UtilityAccount_Id'];

        $utility = $this->utilityGateway->findByVendorsiteIDAndType($data['vendorsite_id'], $data['type']);
        $utilityAccount->Utility_Id = $utility['Utility_Id'];

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

    public function getAll($vendor_id = null, $property_id = null, $utilitytype_id = null, $glaccount_id = null, $pageSize = null, $page = null, $order = 'vendor_name') {

        $result = $this->utilityAccountGateway->getAll($vendor_id, $property_id, $utilitytype_id, $glaccount_id, $pageSize, $page, $order);
        return $result;
    }

    public function deleteUtilityAccount($accounts) {

        $accounts = explode(',',$accounts);
        $this->utilityAccountGateway->beginTransaction();

        $success = true;
        try {
            foreach ($accounts as $item) {
                $this->utilityAccountGateway->delete('utilityaccount_id = ?', [$item]);
            }

            $this->utilityAccountGateway->commit();
        } catch(\Exception $e) {
            // If there was an error, rollback the transaction
            $this->utilityAccountGateway->rollback();
            // Add a global error to the error array
            $success = false;
        }

        return $success;
    }
} 