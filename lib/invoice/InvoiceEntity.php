<?php
namespace NP\invoice;

class InvoiceEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'invoice_id'     => array(),
		'property_id'    => array(
			'required'   => true,
			'displayName'=> 'Property ID',
			'validation' => array('digits' => array())
		),
		'invoice_ref',
		'invoice_status' => array(
			'validation' => array(
				'inArray' => array(
					'haystack' => array('open','forapproval','saved','approved','rejected','sent','submitted','posted','paid','hold','draft','void')
				)
			),
		)
	);

}
?>