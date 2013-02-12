<?php
namespace NP\core\validation;

/**
 * A validator that ensures a string is not greater or less than a certain length
 *
 * This class extends the existing Zend\Validator\StringLength class to allow for a friendly field name based on an
 * entity displayName definition.
 * 
 * @author Thomas Messier
 */
class StringLength extends \Zend\Validator\StringLength {
    
    /**
     * @param array $options Associative array of options for the class
     */
    public function __construct($options = null) {
        $this->messageTemplates[self::INVALID  ] = 'Invalid type given for field "%fieldName%". String expected';
        $this->messageTemplates[self::TOO_SHORT] = 'The field "%fieldName%" must be more than %min% characters long';
        $this->messageTemplates[self::TOO_LONG ] = 'The field "%fieldName%" must be less than %max% characters long';

        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
