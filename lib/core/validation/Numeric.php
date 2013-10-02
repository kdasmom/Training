<?php
namespace NP\core\validation;

/**
 * Numeric validator; basically wraps the Zend Float validator, forcing a en_US locale to ensure 
 * float formatting comes through OK (commas for grouping and periods for decimal point)
 */
class Numeric extends \Zend\I18n\Validator\Float {
    protected $messageTemplates = array(
        self::INVALID   => "Invalid type given. String, integer or number expected",
        self::NOT_FLOAT => "The input does not appear to be a number",
    );

	/**
     * Constructor for the numeric validator
     *
     * @param array|Traversable $options
     */
    public function __construct($options=array()) {
        if ($options instanceof Traversable) {
            $options = ArrayUtils::iteratorToArray($options);
        }

        $options['locale'] = 'en_US';

        parent::__construct($options);
    }
}
?>