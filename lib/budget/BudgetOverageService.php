<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/18/13
 * Time: 12:47 PM
 */

namespace NP\budget;


use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\util\Util;

class BudgetOverageService extends AbstractService {

    protected $budgetOverageGateway;

    public function __construct(BudgetOverageGateway $budgetOverageGateway) {
        $this->budgetOverageGateway = $budgetOverageGateway;
    }

    /**
     * Retrieve budget overage by id
     * @param $id
     * @return array
     */
    public function getBudgetOverage($id) {
        return $this->budgetOverageGateway->findById($id);
    }

    /**
     * Retrieve list of budget overage
     *
     * @param $property_id
     * @return array
     */
    public function budgetOverageList($property_id = null, $sort = 'property_name') {
        $result = $this->budgetOverageGateway->findByPropertyId($property_id, $sort);

        return $result;
    }

    /**
     * save budget overage
     *
     * @param $data
     * @return array
     */
    public function saveBudgetOverage($data) {
        $budgetoverage = new BudgetOverageEntity($data['budgetoverage']);

        $now = \NP\util\Util::formatDateForDB();

        if ($budgetoverage->budgetoverage_id == null) {
            $budgetoverage->userprofile_id = $data['userprofile_id'];
            $budgetoverage->role_id = $data['role_id'];
            $budgetoverage->budgetoverage_created = $now;
        }
        $budgetoverage->budgetoverage_period = Util::formatDateForDB(new \DateTime($budgetoverage->budgetoverage_period));

        $validator = new EntityValidator();

        $validator->validate($budgetoverage);
        $errors = $validator->getErrors();

        if (count($errors) == 0) {
            $this->budgetOverageGateway->beginTransaction();

            try {
                $this->budgetOverageGateway->save($budgetoverage);
                $this->budgetOverageGateway->commit();
            } catch(\Exception $e) {
                // If there was an error, rollback the transaction
                $this->budgetOverageGateway->rollback();
                // Add a global error to the error array
                $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
            }
        }


        return array(
            'success'    => (count($errors)) ? false : true,
            'errors'     => $errors,
        );
    }

} 