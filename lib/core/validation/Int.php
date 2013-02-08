<?php
namespace NP\core\validation;

use Zend\Validator\AbstractValidator;

class Int extends AbstractValidator
{
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
     * Returns true if and only if $value only contains digit characters
     *
     * @param  string $value
     * @return bool
     */
    public function isValid($value)
    {
        $this->setValue($value);

        if (!is_int($value)) {
            $this->error(self::NOT_INT);
            return false;
        }

        return true;
    }
}
