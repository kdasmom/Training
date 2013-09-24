<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 12:31 PM
 */

namespace NP\utility;


class UtilityTypeEntity extends \NP\core\AbstractEntity {

    protected $fields = array(
        'utilitytype_id'	 => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'UtilityType'	 => array(
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
        'asp_client_id'	 => array(
            'required' => true,
            'validation' => array(
                'digits' => array()
            )
        ),
        'universal_field_status'	 => array(
            'validation' => array(
                'digits' => array()
            )
        )
    );

}
?>