<?php
namespace NP\core\validation;

use Zend\Validator\AbstractValidator;

/**
 * US Phone validator
 */
class UsPhone extends AbstractValidator {
    const INVALID   = 'phoneInvalid';

    /**
     * @var array
     */
    protected $messageTemplates = array(
        self::INVALID   => "The input is not a US phone number",
    );

    public function isValid($value) {
        if (!is_string($value)) {
            if (!is_int($value)) {
                $value = (string)$value;
            } else {
                $this->error(self::INVALID);
                return false;    
            }
        }

        $this->setValue($value);

        $value = preg_replace('/[^0-9]/', '', $value);
        if (strlen($value) !== 10) {
            $this->error(self::INVALID);
            return false;
        }

        $value = '(' . substr($value, 0, 3) . ') ' . substr($value, 3, 3) . '-' . substr($value, 6, 4);

        $this->setValue($value);

        return true;
    }
}
?>