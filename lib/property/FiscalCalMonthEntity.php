<?php
namespace NP\property;

/**
 * Entity class for FiscalCalMonth
 *
 * @author Thomas Messier
 */
class FiscalCalMonthEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'fiscalcalmonth_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'fiscalcal_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'fiscalcalmonth_num'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'fiscalcalmonth_cutoff'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>