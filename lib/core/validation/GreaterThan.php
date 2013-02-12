<?php
namespace NP\core\validation;

/**
 * A validator that ensures a number is greater than a certain value
 *
 * This class extends the existing Zend\Validator\GreaterThan class to allow for a friendly field name based on an
 * entity displayName definition.
 * 
 * @author Thomas Messier
 */
class GreaterThan extends \Zend\Validator\GreaterThan {
    /**
     * @var array Stores class options
     */
    protected $options = array();

    /**
     * @param array $options Associative array of options for the class; "min" is a required option
     */
    public function __construct($options = null) {
        $this->messageTemplates[self::NOT_GREATER          ] = 'The field "%fieldName%" is not greater than "%min%"';
        $this->messageTemplates[self::NOT_GREATER_INCLUSIVE] = 'The field "%fieldName%" is not greater than or equal to "%min%"';

        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
