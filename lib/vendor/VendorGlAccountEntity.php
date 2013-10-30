<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 3:20 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;

use NP\core\AbstractEntity;

class VendorGlAccountEntity extends AbstractEntity {

    protected $fields = array(
        'glaccount_vendor_id' => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'glaccount_id' => array(
            'required' => true,
            'validation' => array(
                'digits' => array()
            ),
            'tableConstraint' => array()
        ),
        'vendor_id' => array(
            'required'   => true,
            'validation' => array(
                'digits' => array()
            ),
            'tableConstraint' => array()
        ),
        'vendor_alt_id' => array(),
        'vendorglaccounts_status' => array()
    );
}
