<?php
namespace NP\system;

/**
 * Entity class for DfSplitItem
 *
 * @author Thomas Messier
 */
class DfSplitItemEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'dfsplititem_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'dfsplit_id'	 => array(
			'required'   => true,
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
		'dfsplititem_percent'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'universal_field1'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field2'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field3'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field4'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field5'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field6'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'unit_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'universal_field7'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field8'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		)
	);

}
?>