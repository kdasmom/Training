<?php
namespace NP\core\validation;

class Uri extends \Zend\Validator\Uri {
    protected $options = array();
    protected $messageVariables = array('fieldName' => array("options" => "fieldName"));

    public function __construct($options = null) {
        $this->messageTemplates[self::INVALID] = 'Invalid type given for field "%fieldName%". String expected';
        $this->messageTemplates[self::NOT_URI] = 'The field "%fieldName%" does not appear to be a valid Uri';

        parent::__construct($options);
    }
}
