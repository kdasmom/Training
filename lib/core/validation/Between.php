<?php
namespace NP\core\validation;

class Between extends \Zend\Validator\Between {

    public function __construct($options = null)
    {
        $this->messageTemplates[self::NOT_BETWEEN] = 'The field "%fieldName%" is not between "%min%" and "%max%", inclusively';
        $this->messageTemplates[self::NOT_BETWEEN_STRICT] = 'The field "%fieldName%" is not strictly between "%min%" and "%max%"';
        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
