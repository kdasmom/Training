<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/26/13
 * Time: 12:41 AM
 */

namespace NP\utility;


class UtilityAccountEntity extends \NP\core\AbstractEntity {

    protected $fields = array(
        'utilityaccount_id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'Utility_Id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'UtilityAccount_Building'	 => array(
            'validation' => array(
                'stringLength' => array('max'=>64)
            )
        ),
        'UtilityAccount_Units'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'UtilityAccount_Bedrooms'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'UtilityAccount_MeterSize'	 => array(
            'validation' => array(
                'stringLength' => array('max'=>64)
            )
        ),
        'UtilityAccount_AccountNumber'	 => array(
            'validation' => array(
                'stringLength' => array('max'=>64)
            )
        ),
        'property_id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'utilityaccount_active'	 => array(),
        'glaccount_id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'unit_id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        )
    );

}