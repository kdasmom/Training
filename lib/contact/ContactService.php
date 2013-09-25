<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 5:42 PM
 */

namespace NP\contact;


use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\system\ConfigService;

class ContactService extends AbstractService {

    protected $contactGateway;
    protected $configService;

    public function __construct(ContactGateway $contactGateway, ConfigService $configService) {
        $this->contactGateway = $contactGateway;
        $this->configService = $configService;
    }

    public function saveContact($data) {
        $contact = new ContactEntity($data['contact']);

        $validator = new EntityValidator();
        $validator->validate($contact);
        $errors = $validator->getErrors();

        if (count($errors) == 0) {
            try {
                $this->contactGateway->save($contact);

                $this->contactGateway->commit();
            } catch (\Exception $exception) {
                $this->contactGateway->rollback();
                $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($exception), 'extra'=>null);
            }
        }

        return array(
            'success'    => (count($errors)) ? false : true,
            'errors'     => $errors,
        );
    }

    public function findByTableNameAndKey($tablename, $key) {
        return $this->contactGateway->findByTableNameAndKey($tablename, $key);
    }

} 