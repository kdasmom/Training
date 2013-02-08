<?php
namespace NP\core\validation;

class LessThan extends \Zend\Validator\LessThan {
    protected $options = array();

    public function __construct($options = null) {
        $this->messageTemplates[self::NOT_LESS          ] = 'The field "%fieldName%" is not less than "%max%"';
        $this->messageTemplates[self::NOT_LESS_INCLUSIVE] = 'The field "%fieldName%" is not less or equal than "%max%"';

        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
