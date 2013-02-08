<?php
namespace NP\core\validation;

class Date extends \Zend\Validator\Date {
    /**
     * Optional format
     *
     * @var string|null
     */
    protected $format = 'm/d/Y';

    protected $options = array();

    public function __construct($options = null) {
        $this->messageTemplates[self::INVALID_DATE] = 'The field "%fieldName%" is not a valid date or is not in the proper "%format%" format';
        $this->messageTemplates[self::INVALID] = $this->messageTemplates[self::INVALID_DATE];
        $this->messageTemplates[self::FALSEFORMAT] = 'The field "%fieldName%" does not fit the date format "%format%"';
        
        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
