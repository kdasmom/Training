<?php

namespace NP\user;

use NP\user\UserprofileGateway;
use NP\property\PropertyGateway;
use NP\system\BaseImportService;

class UserPropertyService extends BaseImportService {

    /**
     * @var UserPropertyGateway
     */
    protected $gateway;

    /**
     * @var UserPropertyEntityValidator
     */
    protected $validator;

    /**
     * @var PropertyGateway
     */
    protected $propertyGateway;

    /**
     * @var UserprofileGateway
     */
    protected $userprofileGateway;

    public function __construct
    (
        UserPropertyGateway $gateway,
        UserPropertyEntityValidator $validator,
        UserprofileGateway $userprofileGateway,
        PropertyGateway $propertyGateway
    )
    {
        $this->gateway = $gateway;
        $this->validator = $validator;
        $this->userprofileGateway = $userprofileGateway;
        $this->propertyGateway = $propertyGateway;
    }

    /**
     * @param $data array Row array for entity defined in next param
     * @param $entityClass string Entity class to map data
     */
    public function save(\ArrayObject $data, $entityClass)
    {
        $username = $data['Username'];
        $propertyCode = $data['PropertyCode'];

        $property = $this->propertyGateway->findByAltId($propertyCode);
        $propertyId = $property['id'];
        $userprofileId = $this->userprofileGateway->getUserprofileIdByUsername($username);
       
        $entityData = array(
            'property_id' => $propertyId,
            'userprofile_id' => $userprofileId
        );
        $entity = new $entityClass($entityData);
        $errors = $this->validate($entity);

        // If the data is valid, save it
        if (count($errors) == 0) {
            // Begin transaction
            $this->gateway->beginTransaction();

            try {
                // Save the glaccount record
                $this->gateway->save($entity);
            } catch(\Exception $e) {
                // Add a global error to the error array
                $errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e), 'extra'=>null);
            }
        }

        if (count($errors)) {
            $this->gateway->rollback();
        } else {
            $this->gateway->commit();
        }
    }
}
