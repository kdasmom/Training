<?php
namespace NP\shared;

/**
 * Entity class for Note
 *
 * @author Thomas Messier
 */
class NoteEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'note_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
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
		'objecttype_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'reason_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'userprofile_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'note_createddatetm'	 => array(
			'timestamp' => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'objtype_id_alt'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>