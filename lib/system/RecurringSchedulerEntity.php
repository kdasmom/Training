<?php
namespace NP\system;

/**
 * Entity class for RecurringScheduler
 *
 * @author Thomas Messier
 */
class RecurringSchedulerEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'recurring_scheduler_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'tablekey_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'schedule_start_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'schedule_end_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'schedule_timestamps'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'schedule_recurrence_type'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'schedule_recurrence_number_week'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'schedule_week_days'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'schedule_recurrence_number_month'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'schedule_month_day'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'schedule_day'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'schedule_month'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'schedule_execution_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>5000)
			)
		),
		'schedule_execution_template'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'schedule_status'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'schedule_emailoption'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'schedule_routeoption'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>