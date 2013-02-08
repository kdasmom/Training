<?php
namespace NP\core\validation;

class StringLength extends \Zend\Validator\StringLength {
    
    public function __construct($options = null) {
        $this->messageTemplates[self::INVALID  ] = 'Invalid type given for field "%fieldName%". String expected';
        $this->messageTemplates[self::TOO_SHORT] = 'The field "%fieldName%" must be more than %min% characters long';
        $this->messageTemplates[self::TOO_LONG ] = 'The field "%fieldName%" must be less than %max% characters long';

        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
