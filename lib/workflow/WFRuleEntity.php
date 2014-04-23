<?php
namespace NP\workflow;

class WFRuleEntity extends \NP\core\AbstractEntity {
    protected $fields = [
        'wfrule_id'         => [],
        'wfrule_name'       => [
            'required' => true
        ],
        'wfrule_operand'    => [],
        'wfrule_number'     => [],
        'wfrule_string'     => [],
        'wfrule_status'     => [
            'defaultValue'  => '\'deactive\''
        ],
        'wfruletype_id'     => [
            'required' => true
        ],
        'wfrule_datetm'     => [],
        'asp_client_id'     => [],
        'DTS'               => [],
        'wfrule_number_end' => [],
        'isAllPropertiesWF' => [],
        'wfrule_lastupdatedby' => []
    ];
}
