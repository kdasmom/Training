<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/26/13
 * Time: 3:07 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


class VendorUtilityEntity extends \NP\core\AbstractEntity {

    protected $fields = array(
        'Vendor_ID'	 => array(
            'required' => true,
            'validation' => array(
                'digits' => array()
            )
        ),
        'utility_type'	 => array(
            'required' => true,
        ),
        'account_number'	 => array(
            'required' => true,
        ),
        'property_id'	 => array(
            'required' => true
        ),
        'unit_id'	 => array(

        ),
        'meter_number'	 => array(

        ),
        'gl_account'	 => array(

        )
    );

}
