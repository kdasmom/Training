<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 12/2/13
 * Time: 11:13 AM
 */

namespace NP\catalog;


class VcOrderEntity extends \NP\core\AbstractEntity {

	protected $fields = array(
		'vcorder_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'vcitem_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vcorder_qty'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'vcitem_number'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'vcitem_price'	 => array(),
		'vcitem_desc'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>250)
			)
		),
		'vcitem_uom'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vcitem_manufacturer'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vcitem_mft_partnumber'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'UNSPSC_Commodity_Commodity'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vc_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vcorder_aux_part_id'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		)
	);

}