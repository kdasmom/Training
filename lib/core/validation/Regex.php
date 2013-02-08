<?php
namespace NP\core\validation;

class Date extends \Zend\Validator\Date {
    protected $options = array();

    public function __construct($options = null) {
        $this->messageTemplates[self::INVALID  ] = 'Invalid type given for field "%fieldName%". String, integer or float expected';
        $this->messageTemplates[self::NOT_MATCH] = 'The field "%fieldName%" does not match against pattern "%pattern%"';
        $this->messageTemplates[self::ERROROUS ] = 'There was an internal error while using the pattern "%pattern%" on field "%fieldName%"';
        
        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
