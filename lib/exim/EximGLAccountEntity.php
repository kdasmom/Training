<?php
namespace NP\exim;

class EximGLAccountEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
                'exim_glaccount_id'  => array (),
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
                                'inArray' => array(
                                            'haystack' => array('Asset','Capital','Income','Liability',
                                                'Expenditure','Header','Major','Owners Equity',
                                                'Unassigned','WIP','Dummy')
                                    )
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