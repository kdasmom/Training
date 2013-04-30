<?php
namespace NP\catalog;

/**
 * Entity class for a Vendor Catalog
 *
 * @author 
 */
class VcEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'vc_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vc_vendorname'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>250)
			)
		),
		'vc_catalogname'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'vc_createdt'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d\TH:i:s')
			)
		),
		'vc_createdby'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vc_lastupdatedt'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d\TH:i:s')
			)
		),
		'vc_lastupdateby'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vc_totalItems'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vc_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50),
				'inArray' => array(
					'haystack' => array('-2','-1','0','1')
				)
			)
		),
		'vc_unique_id'	 => array(),
		'vc_catalogtype'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>10),
				'inArray' => array(
					'haystack' => array('excel','pdf','url','punchout')
				)
			)
		),
		'vc_url'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>4000)
			)
		),
		'vc_logo_filename'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'vc_punchout_url'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'vc_punchout_username'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vc_punchout_pwd'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vc_punchout_from_duns'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vc_punchout_to_duns'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vc_posubmit_url'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'vc_posubmit_username'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vc_posubmit_pwd'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vc_posubmit_from_duns'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vc_posubmit_to_duns'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		)
	);

}
?>