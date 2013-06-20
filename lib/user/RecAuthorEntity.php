<?php
namespace NP\user;

/**
 * Entity class for RecAuthor
 *
 * @author 
 */
class RecAuthorEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'recauthor_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'tablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'recauthor_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'delegation_to_userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>