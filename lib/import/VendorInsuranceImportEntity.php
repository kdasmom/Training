<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 11:23 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\import;

use NP\core\AbstractEntity;

class VendorInsuranceImportEntity extends AbstractEntity {

    protected $fields = array(
        'integration_package_name'   => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            ),
            'tableConstraint' => array(
                'table' => 'integrationpackage',
                'field' => 'integration_package_name'
            )
        ),
        'vendor_id_alt'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
        'insurancetype_name' => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>250)
            ),
            'tableConstraint' => array(
                'table' => 'insurancetype',
                'field' => 'insurancetype_name'
            )
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
        'insurance_policy_effective_datetm' => array(
            'validation' => array(
                'date' => array('format'=>'mdY')
            )
        ),
        'insurance_expdatetm' => array(
            'validation' => array(
                'date' => array('format'=>'mdY')
            )
        ),
        'insurance_policy_limit' => array(
            'validation' => array(
                'numeric' => array()
            )
        ),
        'insurance_additional_insured_listed' => array(
            'validation' => array(
                'stringLength' => array('max'=> 100)
            )
        ),
        'property_id_alt'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
    );

}
