<?php
namespace NP\core\validation;

/**
 * A validator to ensure a value belongs to a specific set
 *
 * This class extends the existing Zend\Validator\InArray class to allow for a friendly field name based on an
 * entity displayName definition.
 * 
 * @author Thomas Messier
 */
class InArray extends \Zend\Validator\InArray {
    /**
     * @var array Stores class options
     */
    protected $options = array();

    /**
     * @var array Variables available in the message templates
     */
    protected $messageVariables = array('fieldName' => array("options" => "fieldName"));

    /**
     * @param array $options Associative array of options for the class; "haystack" is a required option
     */
    public function __construct($options = null) {
        $this->messageTemplates[self::NOT_IN_ARRAY] = 'The value of field "%fieldName%", which is "%value%", is not valid. Valid values are "' . implode('","', $options['haystack']) . '"';

        parent::__construct($options);
    }
}
