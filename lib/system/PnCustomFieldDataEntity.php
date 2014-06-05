<?php
namespace NP\system;

/**
 * Entity class for PnCustomFieldData
 *
 * @author Thomas Messier
 */
class PnCustomFieldDataEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'customfielddata_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'customfield_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'customfielddata_table_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'customfielddata_value'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'customfielddata_createdt'	 => array(
			'timestamp' => 'created',
			'required' => true,
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'customfielddata_createdby'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'customfielddata_lastupdatedt'	 => array(
			'timestamp' => 'updated',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'customfielddata_lastupdateby'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>