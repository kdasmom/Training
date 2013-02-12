<?php
namespace NP\core\validation;

use Zend\Validator\AbstractValidator;

/**
 * A validator to ensure a value is numeric
 * 
 * @author Thomas Messier
 */
class Numeric extends AbstractValidator {
    const NOT_NUMERIC   = 'notNumeric';

    /**
     * Validation failure message template definitions
     *
     * @var array
     */
    protected $messageTemplates = array(
        self::NOT_NUMERIC   => 'The field "%fieldName%", whose current value is "%value%", must be a number.',
    );

    /**
     * Additional variables available for validation failure messages
     *
     * @var array
     */
    protected $messageVariables = array(
        'fieldName' => array('options' => 'fieldName'),
    );

    /**
     * Options for the Int validator
     *
     * @var array
     */
    protected $options = array();

    /**
     * Returns true if and only if $value only contains digit characters
     *
     * @param  string $value
     * @return bool
     */
    public function isValid($value)
    {
        $this->setValue($value);

        if (!is_numeric($value)) {
            $this->error(self::NOT_NUMERIC);
            return false;
        }

        return true;
    }
}
