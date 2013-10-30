<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 11:23 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;

use NP\core\AbstractEntity;

class InsuranceEntity extends AbstractEntity {

    protected $fields = array(
        'insurance_id' => array(
			'validation' => array(
				'digits' => array()
			)
		),
        'tablekey_id' => array(
            'required' => true,
            'validation' => array(
                'digits' => array()
            ),
            'tableConstraint' => array(
                'table' => 'vendor',
                'field' => 'vendor_id'
            )
        ),
        'table_name' => array(
            'required'   => true,
            'defaultValue' => 'vendor'
        ),
        'insurancetype_id' => array(
            'required'   => true,
            'validation' => array(
                'digits' => array()
            ),
            'tableConstraint' => array()
        ),
        'insurance_company' => array(
            'validation' => array(
                'stringLength' => array('max' => 250)
            )
        ),
        'insurance_policynum' => array(
            'validation' => array(
                'stringLength' => array('max'=> 250)
            )
        ),
        'insurance_expdatetm' => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'insurance_status' => array(),
        'insurance_policy_effective_datetm' => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'insurance_policy_limit' => array(),
        'insurance_additional_insured_listed' => array(
            'validation' => array(
                'stringLength' => array('max'=> 100)
            )
        )
    );

}
