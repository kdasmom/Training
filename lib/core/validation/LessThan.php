<?php
namespace NP\core\validation;

/**
 * A validator that ensures a number is less than a certain value
 *
 * This class extends the existing Zend\Validator\LessThan class to allow for a friendly field name based on an
 * entity displayName definition.
 * 
 * @author Thomas Messier
 */
class LessThan extends \Zend\Validator\LessThan {
    /**
     * @var array Stores class options
     */
    protected $options = array();

    /**
     * @param array $options Associative array of options for the class; "max" is a required option
     */
    public function __construct($options = null) {
        $this->messageTemplates[self::NOT_LESS          ] = 'The field "%fieldName%" is not less than "%max%"';
        $this->messageTemplates[self::NOT_LESS_INCLUSIVE] = 'The field "%fieldName%" is not less or equal than "%max%"';

        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
