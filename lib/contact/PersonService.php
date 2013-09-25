<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/25/13
 * Time: 1:53 AM
 */

namespace NP\contact;


use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\system\ConfigService;

class PersonService extends AbstractService {
    protected $personGateway;
    protected $configService;

    public function __construct(PersonGateway $personGateway, ConfigService $configService) {
        $this->personGateway = $personGateway;
        $this->configService = $configService;
    }

    public function savePersonForUtility($data) {
        $person = new PersonEntity($data);

        if ($person->person_id == null) {
            $person->asp_client_id = $this->configService->getClientId();
        }

        $validator = new EntityValidator();
        $validator->validate($person);
        $errors = $validator->getErrors();
        $personid = null;

        if (count($errors) == 0) {
            $this->personGateway->beginTransaction();

            try {
                $personid = $this->personGateway->save($person);

                $this->personGateway->commit();
            } catch(\Exception $exception) {
                $this->personGateway->rollback();
                $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($exception), 'extra'=>null);
            }
        }

        return array(
            'success'    => (count($errors)) ? false : true,
            'errors'     => $errors,
            'person_id' => $personid
        );
    }

    public function get($id) {
        return $this->personGateway->findById($id);
    }
} 