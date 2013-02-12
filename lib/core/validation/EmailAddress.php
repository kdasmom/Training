<?php
namespace NP\core\validation;

/**
 * A validator for email addresses
 *
 * This class extends the existing Zend\Validator\EmailAddress class to allow for a friendly field name based on an
 * entity displayName definition.
 * 
 * @author Thomas Messier
 */
class EmailAddress extends \Zend\Validator\EmailAddress {
    
    /**
     * @param array $options Associative array of options for the class
     */
    public function __construct($options = array()) {
        $this->messageTemplates[self::INVALID_FORMAT    ] = 'The field "%fieldName%" is not a valid email address. Use the basic format local-part@hostname';
        $this->messageTemplates[self::INVALID           ] = $this->messageTemplates[self::INVALID_FORMAT];
        $this->messageTemplates[self::INVALID_HOSTNAME  ] = '"%hostname%" in field "%fieldName%" is not a valid hostname for the email address';
        $this->messageTemplates[self::INVALID_MX_RECORD ] = '"%hostname%" in field "%fieldName%" does not appear to have any valid MX or A records for the email address';
        $this->messageTemplates[self::INVALID_SEGMENT   ] = '"%hostname%" in field "%fieldName%" is not in a routable network segment. The email address should not be resolved from public network';
        $this->messageTemplates[self::DOT_ATOM          ] = '"%localPart%" in field "%fieldName%" can not be matched against dot-atom format';
        $this->messageTemplates[self::QUOTED_STRING     ] = '"%localPart%" in field "%fieldName%" can not be matched against quoted-string format';
        $this->messageTemplates[self::INVALID_LOCAL_PART] = '"%localPart%" in field "%fieldName%" is not a valid local part for the email address';
        $this->messageTemplates[self::LENGTH_EXCEEDED   ] = 'The field "%fieldName%" exceeds the allowed length';

        $this->messageVariables["fieldName"] = array("options" => "fieldName");

        parent::__construct($options);
    }

    /**
     * Overriden from parent class so we don't get a whole bunch of different error messages for the host name
     *
     * @return boolean Returns true if the host name is valid
     */
    protected function validateHostnamePart() {
        $hostname = $this->getHostnameValidator()->setTranslator($this->getTranslator())
                         ->isValid($this->hostname);
        if (!$hostname) {
            $this->error(self::INVALID_HOSTNAME);
        } elseif ($this->options['useMxCheck']) {
            // MX check on hostname
            $hostname = $this->validateMXRecords();
        }

        return $hostname;
    }
}
