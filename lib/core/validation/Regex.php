<?php
namespace NP\core\validation;

/**
 * A validator that ensures a value matches a certain regular expression
 *
 * This class extends the existing Zend\Validator\Regex class to allow for a friendly field name based on an
 * entity displayName definition.
 * 
 * @author Thomas Messier
 */
class Regex extends \Zend\Validator\Regex {
    /**
     * @var array Stores class options
     */
    protected $options = array();

    /**
     * @param array $options Associative array of options for the class; "pattern" is a required option
     */
    public function __construct($options = null) {
        $this->messageTemplates[self::INVALID  ] = 'Invalid type given for field "%fieldName%". String, integer or float expected';
        $this->messageTemplates[self::NOT_MATCH] = 'The field "%fieldName%" does not match against pattern "%pattern%"';
        $this->messageTemplates[self::ERROROUS ] = 'There was an internal error while using the pattern "%pattern%" on field "%fieldName%"';
        
        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
