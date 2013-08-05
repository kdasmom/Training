<?php
namespace NP\gl;

class GLAccountEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
                'glaccount_id'  => array (
                        'validation' => array(
				'digits' => array()
			)
                ),
		'glaccount_name' => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'glaccount_number' => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'glaccounttype_id' => array(
                        'validation' => array(
                                'digits' => array()
                        )
		),
		'integration_package_id' => array(
			'validation' => array(
				'digits' => array()				
			)
		),
	);
        
        
}
?>