<?php
namespace NP\user;

/**
 * Entity class for MobInfo
 *
 * @author 
 */
class MobInfoEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'mobinfo_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'mobinfo_phone'	 => array(
			'validation' => array(
				'stringLength' => array('min'=>10, 'max'=>10)
			)
		),
		'mobinfo_pin'	 => array(
			'validation' => array(
				'stringLength' => array('min'=>4, 'max'=>4)
			)
		),
		'userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'mobinfo_activated_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'mobinfo_deactivated_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'mobinfo_status'	 => array(
			'defaultValue' => 'active',
			'validation' => array(
				'inArray' => array(
   					'haystack' => array('active','inactive')
   				)
			)
		)
	);

}
?>