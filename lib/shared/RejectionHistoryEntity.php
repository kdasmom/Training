<?php
namespace NP\shared;

/**
 * Entity class for RejectionHistory
 *
 * @author Thomas Messier
 */
class RejectionHistoryEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'rejectionhistory_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'rejectionnote_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'tablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'rejection_datetm'	 => array(
			'timestamp' => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'rejectionhistory_user_list'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>250)
			)
		)
	);

}
?>