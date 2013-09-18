<?php
namespace NP\budget;

/**
 * Entity class for BudgetOverage
 *
 * @author
 */
class BudgetOverageEntity extends \NP\core\AbstractEntity {

    protected $fields = array(
        'budgetoverage_id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'role_id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'userprofile_id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'property_id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'glaccount_id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'budgetoverage_period'	 => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'budgetoverage_amount'	 => array(
            'validation' => array(
                'numeric' => array()
            )
        ),
        'budgetoverage_note'	 => array(
            'validation' => array(
                'stringLength' => array('max'=>4000)
            )
        ),
        'budgetoverage_created'	 => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        )
    );

}
?>