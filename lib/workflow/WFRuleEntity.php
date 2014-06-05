<?php
namespace NP\workflow;

class WFRuleEntity extends \NP\core\AbstractEntity {
    protected $scope;

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
        'wfrule_lastupdatedby' => [],
        'region_id' => []
    ];

    public function getScope() {
        if ($this->scope === null) {
            throw new \NP\core\Exception('The scope for this rule was never set. You must first set a scope by calling setScope()');
        }

        return $this->scope;
    }

    public function setScope($scope) {
        if (!is_array($scope)) {
            throw new \NP\core\Exception('The scope must be an associative array');
        }

        $this->scope = $scope;
    }
}
