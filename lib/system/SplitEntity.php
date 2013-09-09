<?php
namespace NP\system;

/**
 * Entity class for Split
 *
 * @author Aliaksandr Zubik
 */
class SplitEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'dfsplit_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'dfsplit_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>200)
			)
		),
		'dfsplit_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'vendorsite_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'dfsplit_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'integration_package_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'dfsplit_update_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'dfsplit_update_userprofile'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>