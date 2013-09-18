<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/18/13
 * Time: 12:47 PM
 */

namespace NP\budget;


use NP\core\AbstractService;

class BudgetOverageService extends AbstractService {

    protected $budgetOverageGateway;

    public function __construct(BudgetOverageGateway $budgetOverageGateway) {
        $this->$budgetOverageGateway = $budgetOverageGateway;
    }

    public function budgetOverageGet() {

    }

    public function budgetOverageList() {

    }

} 