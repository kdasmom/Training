<?php

namespace NP\vendor;


class VendorFavoriteEntity extends \NP\core\AbstractEntity {

    protected $fields = array(

        'vendorfavorite_id'	 => array(
            'required' => true,
            'validation' => array(
                'digits' => array()
            )
        ),

        'vendorsite_id' 	 => array(
            'required' => true,
            'validation' => array(
                'digits' => array()
            )
        ),

        'property_id'	 => array(
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        )
    );

}
