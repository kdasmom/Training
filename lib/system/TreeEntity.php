<?php
namespace NP\system;

/**
 * Entity class for Tree
 *
 * @author Thomas Messier
 */
class TreeEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'tree_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'tree_parent'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'tablekey_id'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'tree_order'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>