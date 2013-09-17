<?php
namespace NP\actual;

/**
 * Entity class for Budget
 *
 * @author Aliaksandr Zubik
 */
class ActualEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'budget_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'glaccount_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'budget_period'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'budget_status'	 => array(
                        'defaultValue' => 'active',
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'budget_createddatetime' => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'budget_amount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'budget_allocated'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'budget_invoiced'	 => array(
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
			'validation' => array(
				'digits' => array()
			)
		),
		'oracle_period_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'oracle_actual'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		)
	);

}
?>