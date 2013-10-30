<?php
namespace NP\jobcosting;

/**
 * Entity class for JbJobAssociation
 *
 * @author Thomas Messier
 */
class JbJobAssociationEntity extends \NP\core\AbstractEntity {
	protected $auditable = true;

	protected $fields = array(
		'jbjobassociation_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>20)
			)
		),
		'jbjobcode_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'jbjobcode',
				'displayField' => 'jbjobcode_name',
				'displayName'  => 'Job Costing Job Code'
			]
		),
		'jbcontract_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'jbcontract',
				'displayField' => 'jbcontract_name',
				'displayName'  => 'Job Costing Contract'
			]
		),
		'tablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'jbcostcode_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'jbcostcode',
				'displayField' => 'jbcostcode_name',
				'displayName'  => 'Job Costing Cost Code'
			]
		),
		'jbassociation_retamt'	 => array(
			'validation' => array(
				'numeric' => array()
			),
			'auditable' => [
				'displayName'  => 'Job Costing Retention'
			]
		),
		'jbassociation_retglaccount'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'jbchangeorder_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'jbchangeorder',
				'displayField' => 'jbchangeorder_name',
				'displayName'  => 'Job Costing Change Order'
			]
		),
		'jbphasecode_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'jbphasecode',
				'displayField' => 'jbphasecode_name',
				'displayName'  => 'Job Costing Phase Code'
			]
		)
	);

}
?>