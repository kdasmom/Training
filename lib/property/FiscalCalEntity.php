<?php
namespace NP\property;

/**
 * Entity class for FiscalCal
 *
 * @author Thomas Messier
 */
class FiscalCalEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'fiscalcal_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'fiscalcal_year'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'fiscalcal_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'fiscalcal_description'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'fiscalcal_type'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'asp_client_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>