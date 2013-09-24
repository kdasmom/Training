<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 11:53 AM
 */

namespace NP\utility;


use NP\contact\ContactService;
use NP\contact\PersonEntity;
use NP\contact\PersonGateway;
use NP\contact\PersonService;
use NP\contact\PhoneGateway;
use NP\contact\PhoneService;
use NP\core\AbstractService;
use NP\core\db\Insert;
use NP\core\validation\EntityValidator;
use NP\system\ConfigService;
use NP\vendor\VendorGateway;

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

        $utilitytypes = $data['utilitytypes'];

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