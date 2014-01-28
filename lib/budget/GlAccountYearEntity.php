<?php
namespace NP\budget;

/**
 * Entity class for GlAccountYear
 *
 * @author Thomas Messier
 */
class GlAccountYearEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'glaccountyear_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'glaccountyear_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>15)
			)
		),
		'glaccountyear_year'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'glaccountyear_amount'	 => array(
			'defaultValue' => 0,
			'validation' => array(
				'numeric' => array()
			)
		),
		'glaccountyear_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			),
			'inArray' => array(
				'haystack' => array('active','inactive')
			)
		),
		'glaccount_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'property_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'glaccountyear_totalallocated'	 => array(
			'defaultValue' => 0,
			'validation' => array(
				'numeric' => array()
			)
		)
	);

}
?>