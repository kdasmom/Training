<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 11:53 AM
 */

namespace NP\vendor;


use NP\core\AbstractService;
use NP\system\ConfigService;
use NP\util\Util;

class UtilityService extends AbstractService {
    protected $configService;

    public function setConfigService(ConfigService $configService) {
        $this->configService = $configService;
    }

    /**
     * Retirve utility record by vendorid
     *
     * @param $vendor_id
     * @return mixed
     */
    public function getByVendorId($vendor_id) {
        $utility = $this->utilityGateway->findByVendorId($vendor_id);
        $utility['utilitytypes'] = Util::valueList(
            $this->utilityGateway->findAssignedUtilityTypes($utility['Vendorsite_Id']),
            'utilitytype_id'
        );

        return $utility;
    }

    /**
     * Retrive vendors list marked as utility vendors
     *
     * @param null $pageSize
     * @param null $page
     * @param string $order
     * @return array|bool
     */
    public function getUtilVendors($pageSize=null, $page=null, $sort='vendor_name') {
        return $this->utilityGateway->findUtilVendors($pageSize, $page, $sort);
    }

    public function getAllUtilityTypes($pageSize = null, $page = null, $sort = "UtilityType") {
        return $this->utilityTypeGateway->find(null, [], $sort, ['UtilityType_Id', 'UtilityType'], $pageSize, $page);
    }

    public function getUtilityAccount($id) {
        return $this->utilityAccountGateway->findById($id);
    }

    public function getAccountsByVendorsite($vendorsite_id, $property_id = null, $utilitytype_id = null, $glaccount_id = null, $sort = 'vendor_name') {
        return $this->utilityAccountGateway->findByVendor($vendorsite_id, $property_id, $utilitytype_id, $glaccount_id, $sort);
    }

    /**
     * Returns all usage types for a certain utility type
     */
    public function getUsageTypesByUtilityType($UtilityType_Id) {
        return $this->utilityColumnUsageTypeGateway->find(
            ['UtilityType_Id'=>'?'],
            [$UtilityType_Id],
            'UtilityColumn_UsageType_Name',
            ['UtilityColumn_UsageType_Id','UtilityColumn_UsageType_Name','UtilityType_Id']
        );
    }

    /**
     * Retrieve utilitytypes list by vendorsite id
     *
     * @param $vendorsite_id
     * @return array|bool
     */
    public function getUtilTypesByVendorsiteId($vendorsite_id) {
        return $this->utilityTypeGateway->findByVendorsite_id($vendorsite_id);
    }

    /**
     * Get list of account numbers.
     * 
     * @param int $userprofile_id User id.
     * @param int $delegation_to_userprofile_id Delegate id.
     * @return [] List of the account numbers.
     */
    public function getAccountNumbersByUser($userprofile_id, $delegation_to_userprofile_id) {
        return $this->utilityAccountGateway->getAccountNumbersByUser($userprofile_id, $delegation_to_userprofile_id);
    }

    /**
     * Get list of account numbers.
     * 
     * @param int $userprofile_id User id.
     * @param int $delegation_to_userprofile_id Delegate id.
     * @return [] List of the account numbers.
     */
    public function getAccountsByUser($userprofile_id, $delegation_to_userprofile_id,
                                        $UtilityAccount_AccountNumber=null, $UtilityAccount_MeterSize=null) {
        return $this->utilityAccountGateway->getAccountsByUser(
            $userprofile_id,
            $delegation_to_userprofile_id,
            $UtilityAccount_AccountNumber,
            $UtilityAccount_MeterSize
        );
    }

    /**
     * Get list of meter numbers.
     * 
     * @param int $UtilityAccount_AccountNumber
     * @return [] List of the meter sizes.
     */
    public function getMeterSizesByAccount($userprofile_id, $delegation_to_userprofile_id,
                                        $UtilityAccount_AccountNumber) {
        return $this->utilityAccountGateway->getMeterSizesByAccount(
            $userprofile_id,
            $delegation_to_userprofile_id,
            $UtilityAccount_AccountNumber
        );
    }

    /**
     * Save utility
     *
     * @param $data
     * @return array
     */
    public function saveUtility($data) {
        $currentUtils = $this->utilityGateway->findByVendorsiteId($data['vendorsite_id']);
        $errors = array();

        // First, make sure we're not trying to save a new utility when utilities already exist for vendor
        if ($data['isNew'] == 1 && count($currentUtils)) {
            $this->entityValidator->addError($errors, 'global', 'utilityExists');
        } else {
            $this->utilityGateway->beginTransaction();

            try {
                // Delete any utility for this vendor who's utility type was not selected
                foreach ($currentUtils as $utility) {
                    if (!in_array($utility['UtilityType_Id'], $data['utilitytypes'])) {
                        $this->deleteUtility($utility['Utility_Id']);
                    }
                }

                // Save a utility record for each utility type selected
                foreach ($data['utilitytypes'] as $utilitytype_id) {
                    $utility = $this->utilityGateway->findByVendorsiteIDAndType($data['vendorsite_id'], $utilitytype_id);
                    $data['utility']['Utility_Id'] = ($utility === null) ? null : $utility['Utility_Id'];
                    $data['utility']['UtilityType_Id'] = $utilitytype_id;
                    $res = $this->_saveSingleUtility($data);

                    // If a single save fails, interrupt the whole process
                    if (!$res['success']) {
                        $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError(new \Exception('Error saving utility')));
                        foreach ($res['errors'] as $error) {
                            $this->loggingService->log('error', $error['field'] . ': ' . $error['msg']);
                        }
                        break;
                    }
                }
            } catch (Exception $e) {
                $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e));
            }

            if (count($errors)) {
                $this->utilityGateway->rollback();
            } else {
                $this->utilityGateway->commit();
            }
        }

        $vendor = $this->vendorGateway->find('vs.vendorsite_id = ?', array($data['vendorsite_id']));

        return [
            'success'   => (count($errors)) ? false : true,
            'errors'    => $errors,
            'vendor_id' => $vendor[0]['vendor_id']
        ];
    }


    /**
     * Save single utility record in multisaving case
     *
     * @param $data
     * @return array
     */
    private function _saveSingleUtility($data) {
        $utility = new UtilityEntity($data['utility']);

        $errors = $this->entityValidator->validate($utility);

        if (count($errors) == 0) {
            $this->utilityGateway->beginTransaction();

            try {
                $this->utilityGateway->save($utility);

                if (array_key_exists('person', $data)) {
                    // Check for existing contact record
                    $contactRec = $this->contactGateway->find(
                        array('tablekey_id'=>'?', 'table_name'=>'?'),
                        array($utility->Utility_Id, 'utility')
                    );

                    // Save person
                    $person = new \NP\contact\PersonEntity($data['person']);
                    $person->asp_client_id = $this->configService->getClientId();
                    $person->person_id = (count($contactRec)) ? $contactRec[0]['person_id'] : null;

                    $errors = $this->entityValidator->validate($person);
                    if (!count($errors)) {
                        $this->personGateway->save($person);
                    }

                    // save contact
                    $contact = new \NP\contact\ContactEntity([
                        'contact_id'     => (count($contactRec)) ? $contactRec[0]['contact_id'] : null,
                        'person_id'      => $person->person_id,
                        'contacttype_id' => 8,
                        'table_name'     => 'utility',
                        'tablekey_id'    => $utility->Utility_Id
                    ]);

                    $errors = array_merge($errors, $this->entityValidator->validate($contact));

                    if (!count($errors)) {
                        $this->contactGateway->save($contact);
                    }
                }
                
                if (array_key_exists('phone', $data)) {
                    // Check for existing phone record
                    $phoneRec = $this->phoneGateway->find(
                        array('tablekey_id'=>'?', 'table_name'=>'?'),
                        array($utility->Utility_Id, 'utility')
                    );

                    // save phone
                    $phone = new \NP\contact\PhoneEntity($data['phone']);
                    $phone->table_name   = 'utility';
                    $phone->tablekey_id  = $utility->Utility_Id;
                    $phone->phonetype_id = 6;
                    $phone->phone_id = (count($phoneRec)) ? $phoneRec[0]['phone_id'] : null;

                    $errors = array_merge($errors, $this->entityValidator->validate($phone));

                    if (!count($errors)) {
                        $this->phoneGateway->save($phone);
                    }
                }
            } catch(\Exception $exception) {
                $this->entityValidator->addError($errors, 'global', $this->handleUnexpectedError($exception));
            }
        }

        if (count($errors)) {
            $this->utilityGateway->rollback();
        } else {
            $this->utilityGateway->commit();
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors,
            'id'      => $utility->Utility_Id
        );
    }

    /**
     * Delete utility
     *
     * @param $utility_id
     * @return bool
     * @throws \Exception
     * @throws Exception
     */
    public function deleteUtility($utility_id) {
        $this->utilityGateway->beginTransaction();
        $success = false;

        try {
            // Get contact to retrieve person_id
            $contact = $this->contactGateway->find(
                array('table_name'=>'?', 'tablekey_id'=>'?'),
                array('utility', $utility_id),
                null,
                array('person_id')
            );
            // Delete person
            $this->personGateway->delete('person_id = ?', array($contact[0]['person_id']));

            // Delete contact
            $this->contactGateway->delete(
                array('table_name'=>'?', 'tablekey_id'=>'?'),
                array('utility', $utility_id)
            );

            // Delete phone
            $this->phoneGateway->delete(
                array('table_name'=>'?', 'tablekey_id'=>'?'),
                array('utility', $utility_id)
            );

            // Delete utility accounts
            $this->utilityAccountGateway->delete('utility_id = ?', array($utility_id));

            // Delete utility
            $this->utilityGateway->delete('utility_id = ?', array($utility_id));

            $this->utilityGateway->commit();
            $success = true;
        } catch (Exception $e) {
            $this->utilityGateway->rollback();
            
            throw $e;
        }

        return $success;
    }

    public function saveUtilityAccount($data) {
        $utilityAccount = new UtilityAccountEntity($data['utilityaccount']);

        if ($utilityAccount->Utility_Id === null) {
            $utility = $this->utilityGateway->findByVendorsiteIDAndType($data['vendorsite_id'], $data['UtilityType_Id']);
            $utilityAccount->Utility_Id = $utility['Utility_Id'];
        }

        $errors = $this->entityValidator->validate($utilityAccount);

        if (!count($errors)) {
            try {
                $this->utilityAccountGateway->save($utilityAccount);
            } catch(\Exception $e) {
                // Add a global error to the error array
                $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
            }
        }

        return array(
            'success'    => (count($errors)) ? false : true,
            'errors'     => $errors,
        );
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

    /**
     * Save utility account imported using import tool 
     */
    public function saveVendorUtilityFromImport($data) {
        // Use this to store integration package IDs
        $errors  = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
            // Get vendorsite ID
            $rec = $this->vendorGateway->find('v.vendor_id_alt = ?', array($row['vendor_id_alt']));
            $row['Vendorsite_Id'] = $rec[0]['vendorsite_id'];

            // Get utility type ID
            $rec = $this->utilityTypeGateway->find('UtilityType = ?', array($row['UtilityType']));
            $row['UtilityType_Id'] = $rec[0]['UtilityType_Id'];

            // Get property ID
            $rec = $this->propertyGateway->find('property_id_alt = ?', array($row['property_id_alt']));
            $row['property_id'] = $rec[0]['property_id'];

            // Get unit ID
            if ($row['unit_id_alt'] != '') {
                $rec = $this->unitGateway->find(
                    array('u.unit_id_alt' => '?', 'u.property_id' => '?'),
                    array($row['unit_id_alt'], $row['property_id'])
                );
                $row['unit_id'] = $rec[0]['unit_id'];
            } else {
                $row['unit_id'] = null;
            }

            // Get GL Account ID
            if ($row['glaccount_number'] != '') {
                $rec = $this->glAccountGateway->find('glaccount_number = ?', array($row['glaccount_number']));
                $row['glaccount_id'] = $rec[0]['glaccount_id'];
            } else {
                $row['glaccount_id'] = null;
            }

            // Get existing utility if any
            $util = $this->utilityGateway->find(
                array('Vendorsite_Id'=>'?', 'UtilityType_id'=>'?'),
                array($row['Vendorsite_Id'], $row['UtilityType_Id'])
            );
            $utilData = (count($util)) ? $util[0] : array();
            $utilData = array_merge($utilData, $row);

            // Get existing utility account
            if (count($util)) {
                $utilAccount = $this->utilityAccountGateway->find(
                    array(
                        'Utility_Id'                   => '?',
                        'property_id'                  => '?',
                        'UtilityAccount_AccountNumber' => '?',
                        'UtilityAccount_MeterSize'     => '?'
                    ),
                    array(
                        $util[0]['Utility_Id'],
                        $row['property_id'],
                        $row['UtilityAccount_AccountNumber'],
                        $row['UtilityAccount_MeterSize']
                    )
                );
                $utilAccountData = (count($utilAccount)) ? $utilAccount[0] : array();
            } else {
                $utilAccountData = array();
            }
            $utilAccountData = array_merge($utilAccountData, $row);
            
            // Save the row
            $this->utilityGateway->beginTransaction();

            $result = $this->_saveSingleUtility(['utility'=>$utilData]);
            
            if ($result['success']) {
                $utilAccountData['Utility_Id'] = $result['id'];
                $result = $this->saveUtilityAccount(['utilityaccount'=>$utilAccountData]);
            }
            
            // Set errors
            if (!$result['success']) {
                $this->utilityGateway->rollback();

                $rowNum = $idx + 1;
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
                $errors[] = $errorMsg;

                $this->loggingService->log('error', 'Error importing vendor utility', $result['errors']);
            } else {
                $this->utilityGateway->commit();
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
    }
} 