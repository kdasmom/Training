<?php
namespace NP\core\validation;

/**
 * A validator to ensure a number falls in a certain range
 *
 * This class extends the existing Zend\Validator\Between class to allow for a friendly field name based on an
 * entity displayName definition.
 * 
 * @author Thomas Messier
 */
class Between extends \Zend\Validator\Between {

	/**
	 * @param array $options Associative array of options for the class
	 */
    public function __construct($options = null) {
        $this->messageTemplates[self::NOT_BETWEEN] = 'The field "%fieldName%" is not between "%min%" and "%max%", inclusively';
        $this->messageTemplates[self::NOT_BETWEEN_STRICT] = 'The field "%fieldName%" is not strictly between "%min%" and "%max%"';
        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }
}
