<?php
namespace NP\exim;

class EximGLAccountEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'exim_glaccountName' => array(
			'validation' => array(
				'stringLength' => array('max'=>500)
			)
		),
		'exim_glaccountNumber' => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'exim_accountType' => array(
			'validation' => array(
				'stringLength' => array('max'=>100),
			)
		),
		'exim_categoryName' => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		
		'exim_integrationPackage' => array(
			'validation' => array(
				'stringLength' => array('max'=>50)				
			)
		),
	);

}
?>