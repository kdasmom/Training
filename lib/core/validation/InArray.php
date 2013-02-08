<?php
namespace NP\core\validation;

class InArray extends \Zend\Validator\InArray {
    protected $options = array();
    protected $messageVariables = array('fieldName' => array("options" => "fieldName"));

    public function __construct($options = null) {
        $this->messageTemplates[self::NOT_IN_ARRAY] = 'The value of field "%fieldName%", which is "%value%", is not valid. Valid values are "' . implode('","', $options['haystack']) . '"';

        parent::__construct($options);
    }
}
