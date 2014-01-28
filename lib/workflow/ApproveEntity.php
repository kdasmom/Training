<?php
namespace NP\workflow;

/**
 * Entity class for Approve
 *
 * @author Thomas Messier
 */
class ApproveEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'approve_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'tablekey_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'approve_status'	 => array(
			'required' => true,
			'defaultValue' => 'active',
			'validation' => array(
				'stringLength' => array('max'=>50),
				'inArray' => array(
   					'haystack' => array('active','inactive','recalled','post approved','recall')
   				)
			)
		),
		'approve_message'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'approve_datetm'	 => array(
			'timestamp' => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'budget_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'budget_variance'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'approvetype_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'approve_itemid'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'wfrule_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'forwardto_tablename'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'forwardto_tablekeyid'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'wfaction_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'glaccount_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'transaction_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'auto_approve'	 => array(
			'required' => true,
			'defaultValue' => 0,
			'validation' => array(
				'digits' => array()
			)
		),
		'wftarget_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'approve_mobile_flag'	 => array(
			'required' => true,
			'defaultValue' => 0
		),
		'unit_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'delegation_to_userprofile_id'	 => array(
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