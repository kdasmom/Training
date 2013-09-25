<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/25/13
 * Time: 2:44 AM
 */

namespace NP\contact;


use NP\core\AbstractService;
use NP\core\validation\EntityValidator;

class PhoneService extends AbstractService {
    protected $phoneGateway;

    public function __construct(PhoneGateway $phoneGateway) {
        $this->phoneGateway = $phoneGateway;
    }

    public function savePhone($data) {
        $phone = new PhoneEntity($data['phone']);

        $validator = new EntityValidator();
        $validator->validate($phone);
        $errors = $validator->getErrors();

        if (count($errors) == 0) {
            try {
                $this->phoneGateway->save($phone);

                $this->phoneGateway->commit();
            } catch (\Exception $exception) {
                $this->phoneGateway->rollback();
                $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($exception), 'extra'=>null);
            }
        }

        return array(
            'success'    => (count($errors)) ? false : true,
            'errors'     => $errors,
        );
    }

    public function findByUtilityId($utility_id) {
        return $this->phoneGateway->findByTableNameAndKey('utility', $utility_id);
    }
} 