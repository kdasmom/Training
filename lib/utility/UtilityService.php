<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 11:53 AM
 */

namespace NP\utility;


use NP\contact\ContactService;
use NP\contact\PersonService;
use NP\contact\PhoneService;
use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\system\ConfigService;
use NP\vendor\VendorGateway;

use NP\util\Util;

class UtilityService extends AbstractService {
    protected $utilityGateway;
    protected $vendorGateway;

    protected $contactService;
    protected $phoneService;
    protected $configService;
    protected $personService;

    public function __construct(UtilityGateway $utilityGateway, VendorGateway $vendorGateway, PersonService $personService, PhoneService $phoneService, ConfigService $configService, ContactService $contactService) {
        $this->utilityGateway = $utilityGateway;
        $this->vendorGateway = $vendorGateway;
        $this->phoneService = $phoneService;

        $this->personService = $personService;
        $this->configService = $configService;
        $this->contactService = $contactService;
    }

    /**
     * Retrive vendors list marked as utility vendors
     *
     * @param null $pageSize
     * @param null $page
     * @param string $order
     * @return array|bool
     */
    public function findVendors($pageSize = null, $page = null, $order = 'vendor_name') {
        return $this->utilityGateway->findVendors($pageSize, $page, $order);
    }

    /**
     * Save utility
     *
     * @param $data
     * @return array
     */
    public function saveUtility($data) {

        $person = [
            'person_firstname'      => $data['person_firstname'],
            'person_middlename'      => $data['person_middlename'],
            'person_lastname'      => $data['person_lastname'],
        ];
        $phone = [
            'phone_number'      => $data['phone_number'],
            'phone_ext'         => $data['phone_ext'],
            'table_name'        => 'utility',
            'phonetype_id'      => 6,
            'phone_countrycode' => null
        ];

        $utilitytypes = explode(',', $data['utilitytypes']);

        $res = [];
        if (!$data['utility']['Utility_Id']) {
            foreach ($utilitytypes as $type) {
                $res = $this->_saveSingleUtility($data['utility'], $type, $person, $phone);
                if (!$res['success']) {
                    return $res;
                }
            }
        } else {
            $previousSavedUtilitites = [];
            $savedTypes = [];
            foreach ($this->utilityGateway->findByVendorsiteId($data['utility']['Vendorsite_Id']) as $item) {
                if (!in_array($item['UtilityType_Id'], $utilitytypes)) {
                    $this->deleteUtility($item['Utility_Id']);
                    $this->phoneService->deleteByUtilityId($item['Utility_Id']);
                } else {
                    $previousSavedUtilitites[] = $item;
                    $savedTypes[] = $item['UtilityType_Id'];
                }

            }
            foreach ($previousSavedUtilitites as $item) {
                $res = $this->_saveSingleUtility($item, $item['UtilityType_Id'], $person, $phone, false);
            }

            foreach (array_diff($utilitytypes, $savedTypes) as $type) {
                $res = $this->_saveSingleUtility($data['utility'], $type, $person, $phone);
                if (!$res['success']) {
                    return $res;
                }
            }
        }

        return $res;
    }

    /**
     * Retirve utility record by vendorid
     *
     * @param $vendor_id
     * @return mixed
     */
    public function findByVendorId($vendor_id) {
        $utility = $this->utilityGateway->findByVendorId($vendor_id);
        $utility['utilitytypes'] = Util::valueList($this->utilityGateway->findAssignedUtilityTypes($utility['Vendorsite_Id']), 'utilitytype_id');

        $vendor = $this->utilityGateway->findAssignedVendor($utility['Utility_Id']);

        $phone = $this->phoneService->findByUtilityId($utility['Utility_Id']);
        $contact = $this->contactService->findByTableNameAndKey('utility', $utility['Utility_Id']);
        $person = $this->personService->get($contact['person_id']);

        $utility['phone_number'] = $phone['phone_number'];
        $utility['phone_ext'] = $phone['phone_ext'];
        $utility['person_firstname'] = $person['person_firstname'];
        $utility['person_middlename'] = $person['person_middlename'];
        $utility['person_lastname'] = $person['person_lastname'];
        $utility['vendor_id'] = $utility['Vendorsite_Id'];
        $utility['vendor'] = $vendor;

        return $utility;
    }

    /**
     * Retreive utility record by ID
     *
     * @param int $id
     * @return array
     */
    public function get($id) {
        $utility = $this->utilityGateway->findById($id);
        $vendor = $this->utilityGateway->findAssignedVendor($utility['Utility_Id']);

        $utility['vendor_name'] = $vendor['vendor_name'];

        return $utility;
    }


    /**
     * Save single utility record in multisaving case
     *
     * @param $utilitydata
     * @param $type
     * @param $person
     * @param $phone
     * @param bool $isnew
     * @return array
     */
    private function _saveSingleUtility($utilitydata, $type, $person, $phone, $isnew = true) {

        $utility = new UtilityEntity($utilitydata);
        if ($isnew) {
            $utility->periodic_billing_flag = null;
            $utility->period_billing_cycle = null;
            $utility->Property_Id = null;
        }

        $utility->UtilityType_Id = $type;
        if (!$isnew) {
            $utility->utility_id = $utilitydata['Utility_Id'];
        }

        $validator = new EntityValidator();
        $validator->validate($utility);
        $errors = $validator->getErrors();

        if (count($errors) == 0) {
            $this->utilityGateway->beginTransaction();

            try {
                $utilityid = $this->utilityGateway->save($utility);

                if ($isnew) {
//                    save person
                    $personsaves = $this->personService->savePersonForUtility($person);
                    $contact = [
                        'contact' => [
                            'person_id' => $personsaves['person_id'],
                            'contacttype_id'    => 8,
                            'table_name'        => 'utility',
                            'tablekey_id'       => $utilityid,
                            'contact_relation'  => 'Yes'
                        ]
                    ];
                    $contactsaves = $this->contactService->saveContact($contact);
//                    save phone
                    $phone['tablekey_id'] = $utilityid;
                    $phonesaves = $this->phoneService->savePhone(['phone' => $phone]);
                } else {
                    $phonesaved = $this->phoneService->findByUtilityId($utilitydata['Utility_Id']);

                    $phone['phone_id'] = $phonesaved['phone_id'];
                    $phone['tablekey_id'] = $utilitydata['Utility_Id'];
                    $phone['table_name'] = 'utility';
                    $res = $this->phoneService->savePhone(['phone' => $phone]);
                    if (!$res['success']) {
                        throw new \Exception($res['msg']);
                    }

                    $contactsaved = $this->contactService->findByTableNameAndKey('utility', $utilitydata['Utility_Id']);
                    $this->personService->updateForUtility($person, $contactsaved['person_id']);

                }

                $this->utilityGateway->commit();
            } catch(\Exception $exception) {
                $this->utilityGateway->rollback();
                $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($exception), 'extra'=>null);
            }
        }


        return array(
            'success'    => (count($errors)) ? false : true,
            'errors'     => $errors,
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
            $this->utilityGateway->delete(array('utility_id'=>$utility_id));

            $this->utilityGateway->commit();
            $success = true;
        } catch (Exception $e) {
            $this->utilityGateway->rollback();
            throw $e;
        }

        return $success;
    }

    /**
     * Retreive vendor record by vendorsite id
     *
     * @param int $vendorsite_id
     * @return array
     */
    public function findByVendorsiteId($vendorsite_id) {
        return $this->vendorGateway->findByVendorsite($vendorsite_id);
    }

    public function findTypesByVendorsiteId($vendorsite_id) {
        return $this->utilityGateway->findAssignedUtilityTypes($vendorsite_id);
    }


} 