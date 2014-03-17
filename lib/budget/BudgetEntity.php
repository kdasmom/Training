<?php
namespace NP\budget;

/**
 * Entity class for Budget
 *
 * @author Aliaksandr Zubik
 */
class BudgetEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'budget_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'glaccount_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'budget_period'	 => array(
			'required' => true,
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'budget_status'	 => array(
			'required' => true,
            'defaultValue' => 'active',
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'budget_createddatetime' => array(
			'timestamp' => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'budget_amount'	 => array(
			'required' => true,
			'defaultValue' => 0,
			'validation' => array(
				'numeric' => array()
			)
		),
		'budget_allocated'	 => array(
			'required' => true,
			'defaultValue' => 0,
			'validation' => array(
				'numeric' => array()
			)
		),
		'budget_invoiced'	 => array(
			'required' => true,
			'defaultValue' => 0,
			'validation' => array(
				'numeric' => array()
			)
		),
		'budget_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'glaccountyear_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'oracle_period_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'oracle_actual'	 => array(
			'required' => true,
			'defaultValue' => 0,
			'validation' => array(
				'numeric' => array()
			)
		)
	);

}
?>