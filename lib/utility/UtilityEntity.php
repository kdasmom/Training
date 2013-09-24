<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 11:52 AM
 */

namespace NP\utility;


class UtilityEntity extends \NP\core\AbstractEntity {

    protected $fields = array(
        'Utility_Id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'UtilityType_Id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'Property_Id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'Vendorsite_Id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'periodic_billing_flag'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'period_billing_cycle'	 => array(
            'validation' => array(
                'digits' => array()
            )
        )
    );



}
?>