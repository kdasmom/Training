<?php
namespace NP\user;

/**
 * Entity class for Userprofile
 *
 * @author Thomas Messier
 */
class UserprofileEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'userprofile_id' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'asp_client_id' => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_username' => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'userprofile_status' => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50),
				'inArray' => array(
					'haystack' => array('active','inactive','Active','Inactive')
				)
			)
		),
		'userprofile_session' => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'oracle_authentication' => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'userprofile_startdate' => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'userprofile_enddate' => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'userprofile_password' => array(
			'validation' => array(
				'stringLength' => array('min'=>6, 'max'=>256)
			)
		),
		'userprofile_preferred_property' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_default_dashboard' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_splitscreen_size' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_splitscreen_isHorizontal' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_splitscreen_ImageOrder' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_splitscreen_LoadWithoutImage' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_preferred_region' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_updated_by' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_updated_datetm' => array(
			'timestamp' => 'updated',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'security_question1' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'security_answer1' => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'security_question2' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'security_answer2' => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'security_question3' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'security_answer3' => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'security_question4' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'security_answer4' => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'security_question5' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'security_answer5' => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'security_question6' => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'security_answer6' => array(
			'validation' => array(
				'stringLength' => array('max'=>600)
			)
		)
	);

}
?>