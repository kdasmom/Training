<?php
namespace NP\core\validation;

/**
 * A validator for dates
 *
 * This class extends the existing Zend\Validator\Date class to allow for a friendly field name based on an
 * entity displayName definition. It also sets a default format.
 * 
 * @author Thomas Messier
 */
class Date extends \Zend\Validator\Date {
    /**
     * @var string Optional format defaulted to m/d/Y
     */
    protected $format = 'm/d/Y';

    /**
     * @var array Stores class options
     */
    protected $options = array();

    /**
     * @param array $options Associative array of options for the class
     */
    public function __construct($options = null) {
        $this->messageTemplates[self::INVALID_DATE] = 'The field "%fieldName%" is not a valid date or is not in the proper "%format%" format';
        $this->messageTemplates[self::INVALID] = $this->messageTemplates[self::INVALID_DATE];
        $this->messageTemplates[self::FALSEFORMAT] = 'The field "%fieldName%" does not fit the date format "%format%"';
        
        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
