<?php
namespace NP\core\validation;

class GreaterThan extends \Zend\Validator\GreaterThan {
    protected $options = array();

    public function __construct($options = null) {
        $this->messageTemplates[self::NOT_GREATER          ] = 'The field "%fieldName%" is not greater than "%min%"';
        $this->messageTemplates[self::NOT_GREATER_INCLUSIVE] = 'The field "%fieldName%" is not greater or equal than "%min%"';

        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
