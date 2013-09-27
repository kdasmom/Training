<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/25/13
 * Time: 2:44 AM
 */

namespace NP\contact;


use NP\core\AbstractService;
use NP\core\db\Select;
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

    public function deleteByUtilityId($id) {
        $this->phoneGateway->beginTransaction();
        $success = false;

        try {
            $this->phoneGateway->delete(array('tablekey_id'=>'?', 'table_name' => '?'), [$id, 'utility']);

            $this->phoneGateway->commit();
            $success = true;
        } catch (Exception $e) {
            $this->phoneGateway->rollback();
            throw $e;
        }

        return $success;
    }
} 