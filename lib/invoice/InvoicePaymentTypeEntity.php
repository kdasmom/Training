<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/22/13
 * Time: 1:12 PM
 */

namespace NP\invoice;


class InvoicePaymentTypeEntity extends \NP\core\AbstractEntity {

	protected $fields = array(
		'invoicepayment_type_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoicepayment_type'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'active'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoicepayment_type_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'universal_field_status'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}