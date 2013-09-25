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

    public function findVendors($pageSize = null, $page = null, $order = 'vendor_name') {
        return $this->utilityGateway->findVendors($pageSize, $page, $order);
    }

    public function saveUtility($data) {

        $utility = new UtilityEntity($data['utility']);
        if ($utility->utility_id == null) {
            $utility->periodic_billing_flag = null;
            $utility->period_billing_cycle = null;
            $utility->Property_Id = null;
            $utility->UtilityType_Id = null;
        }

        $utility->Vendorsite_Id = $data['utility']['Vendorsite_Id'];

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

        $validator = new EntityValidator();
        $validator->validate($utility);
        $errors = $validator->getErrors();

        if (count($errors) == 0) {
            $this->utilityGateway->beginTransaction();

            try {
                $utilityid = $this->utilityGateway->save($utility);

                $this->utilityGateway->saveUtilityTypesRelations($utilityid, $utilitytypes);

                if ($data['utility']['Utility_Id'] == null) {
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
                    $phone['tablekey_id'] = $utilityid;
                    $phonesaves = $this->phoneService->savePhone(['phone' => $phone]);
                } else {
                    $phonesaved = $this->phoneService->findByUtilityId($data['utility']['Utility_Id']);
                    $phone['phone_id'] = $phonesaved['phone_id'];
                    $phone['tablekey_id'] = $data['utility']['Utility_Id'];
                    $phone['table_name'] = 'utility';
                    $res = $this->phoneService->savePhone(['phone' => $phone]);
                    if (!$res['success']) {
                        throw new \Exception($res['msg']);
                    }

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

    /*public function saveUtility__($data) {

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
        foreach ($utilitytypes as $type) {
            $res = $this->_saveSingleUtility($data['utility'], $type, $person, $phone);
            if (!$res['success']) {
                return $res;
            }
        }

        return $res;
    }*/

    public function findByVendorId($vendor_id) {
        $utility = $this->utilityGateway->findByVendorId($vendor_id);
        $utility['utilitytypes'] = Util::valueList($this->utilityGateway->findAssignedUtilityTypes($utility['Utility_Id']), 'utilitytype_id');

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

    private function _saveSingleUtility($utilitydata, $type, $person, $phone) {

        $utility = new UtilityEntity($utilitydata);
        if ($utility->utility_id == null) {
            $utility->periodic_billing_flag = null;
            $utility->period_billing_cycle = null;
            $utility->Property_Id = null;
        }

        $utility->UtilityType_Id = $type;
        $utility->Vendorsite_Id = $utilitydata['Vendorsite_Id'];

        $validator = new EntityValidator();
        $validator->validate($utility);
        $errors = $validator->getErrors();

        if (count($errors) == 0) {
            $this->utilityGateway->beginTransaction();

            try {
                $utilityid = $this->utilityGateway->save($utility);

                if ($utilitydata['Utility_Id'] == null) {
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
} 