<?php
namespace NP\core\validation;

/**
 * A validator that ensures a value is a Uri
 *
 * This class extends the existing Zend\Validator\Uri class to allow for a friendly field name based on an
 * entity displayName definition.
 * 
 * @author Thomas Messier
 */
class Uri extends \Zend\Validator\Uri {
    /**
     * @var array Stores class options
     */
    protected $options = array();
    
    /**
     * @var array Variables available in the message templates
     */
    protected $messageVariables = array('fieldName' => array("options" => "fieldName"));

    /**
     * @param array $options Associative array of options for the class; "pattern" is a required option
     */
    public function __construct($options = null) {
        $this->messageTemplates[self::INVALID] = 'Invalid type given for field "%fieldName%". String expected';
        $this->messageTemplates[self::NOT_URI] = 'The field "%fieldName%" does not appear to be a valid Uri';

        parent::__construct($options);
    }
}
