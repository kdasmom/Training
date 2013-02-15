<?php
namespace NP\core\validation;

/**
 * A validator to ensure a value is an integer
 *
 * This class is used to replace the Zend\Validator\Digits class which didn't really suit our needs
 * 
 * @author Thomas Messier
 */
class Int extends \Zend\Validator\AbstractValidator {
    const NOT_INT   = 'notInt';

    /**
     * Validation failure message template definitions
     *
     * @var array
     */
    protected $messageTemplates = array(
        self::NOT_INT   => 'The field "%fieldName%", whose current value is "%value%", must contain only digits.',
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
     * Returns true if and only if $value is an integer
     *
     * @param  string $value
     * @return bool
     */
    public function isValid($value)
    {
        $this->setValue($value);

        if (!is_numeric($value)) {
            $this->error(self::NOT_INT);
            return false;
        } else {
            $value += 0;
            if (!is_int($value)) {
                $this->error(self::NOT_INT);
                return false;
            }
        }

        return true;
    }
}
