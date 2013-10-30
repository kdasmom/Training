<?php
namespace NP\import;

class InvoicePaymentImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'property_id_alt'	 => array(
            'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vendor_id_alt'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
		'invoice_ref'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>100)
            )
        ),
		'invoice_datetm'	 => array(
            'required'   => true,
			'validation' => array(
				'date' => array('format'=>'m/d/Y')
			)
		),
		'invoice_period'	 => array(
            'required'   => true,
			'validation' => array(
				'date' => array('format'=>'m/d/Y')
			)
		),
		'invoicepayment_id_alt'	 => array(
            'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>74)
			)
		),
		'invoicepayment_datetm'	 => array(
            'required'   => true,
			'validation' => array(
				'date' => array('format'=>'m/d/Y')
			)
		),
		'invoicepayment_checknum'	 => array(
            'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'invoicepayment_amount'	 => array(
            'required'   => true,
			'validation' => array(
				'numeric' => array()
			)
		),
		'invoicepayment_status'	 => array(
            'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50),
				'inArray' => array(
					'haystack' => array('Paid','Void','paid','void','nsf','PAID','VOID','NSF')
				)
			)
		),
		'integration_package_name'	 => array(
			'required'   => true,
			'validation' => array(
                'stringLength' => array('max'=>50)
            ),
			'tableConstraint' => array(
				'table'    => 'integrationpackage',
				'field'    => 'integration_package_name',
				'errorMsg' => 'importFieldIntegrationPackageNameError'
            )
		)
	);

}
?>