<?php
namespace NP\security;

/**
 * Entity class for ModulePriv
 *
 * @author Thomas Messier
 */
class ModulePrivEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'modulepriv_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'tablekey_id'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'module_id'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'modulepriv_dategranted'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'modulepriv_effectivedate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'modulepriv_expirationdate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'modulepriv_status'	 => array(
			'required'   => true,
			'defaultValue' => 'active',
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		)
	);

}
?>