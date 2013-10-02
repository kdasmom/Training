<?php
namespace NP\system;

/**
 * Entity class for DfSplit
 *
 * @author Thomas Messier
 */
class DfSplitEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'dfsplit_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'dfsplit_name'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>200)
			)
		),
		'dfsplit_status'	 => array(
			'required'   => true,
			'defaultValue' => 'active',
			'validation' => array(
				'inArray' => array(
					'haystack' => array('active','Active','inactive','Inactive')
				)
			)
		),
		'vendorsite_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'dfsplit_datetm'	 => array(
			'timestamp'  => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'integration_package_id'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'integrationpackage',
				'field' => 'integration_package_id'
			)
		),
		'dfsplit_update_datetm'	 => array(
			'timestamp'  => 'updated',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'dfsplit_update_userprofile'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'userprofile',
				'field' => 'userprofile_id'
			)
		)
	);

}
?>