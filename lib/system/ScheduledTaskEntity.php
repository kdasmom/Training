<?php
namespace NP\system;

/**
 * Entity class for ScheduledTask
 *
 * @author Thomas Messier
 */
class ScheduledTaskEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'schedule_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'recurring_scheduler_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'schedule_date'	 => array(
			'required' => true,
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'schedule_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		)
	);

}
?>