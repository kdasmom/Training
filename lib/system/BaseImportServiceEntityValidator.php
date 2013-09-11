<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/20/13
 * Time: 10:54 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\system;


abstract class BaseImportServiceEntityValidator {

    /**
     * @var \NP\system\ConfigService The config service singleton
     */
    protected $configService;

    protected $localizationService;

    protected $errors;

    protected $row;

    /**
     * Setter function required by DI to set the config service via setter injection
     * @param \NP\system\ConfigService $configService
     */
    public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

    public function setLocalizationService(\NP\locale\LocalizationService $localizationService)
    {
        $this->localizationService = $localizationService;
    }

    /**
     * @param \ArrayObject $row
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator
     */
    abstract protected function validate(\ArrayObject $row, \ArrayObject $errors);

    public function validateRow(\ArrayObject $row, \ArrayObject $errors)
    {
        $this->setErrors($errors)
             ->setRow($row);

        $row['validation_status'] = 'valid';

        $this->validate($row, $errors);
    }

    /**
     * @param $field string
     * @param $message string
     * @param null $extra
     */
    protected function addLocalizedErrorMessageIfNull($check, $field, $message, $extra = null)
    {
        if(is_null($check)) {
            $message = $this->localizationService->getMessage($message);
            $this->addErrorMessage($field, $message, $extra);
        }
    }

    /**
     * @param $field string
     * @param $message string
     * @param null $extra
     */
    protected function addLocalizedErrorMessage($field, $message, $extra = null)
    {
        $message = $this->localizationService->getMessage($message);
        $this->addErrorMessage($field, $message, $extra);
    }

    /**
     * @param $field string
     * @param $message string
     * @param null $extra
     */
    protected function addErrorMessage($field, $message, $extra = null)
    {
        $this->errors->append(array(
            'field' => $field,
            'msg'   => $message,
            'extra' => $extra
        ));

        $this->row[$field] = $this->row[$field] . ';' . $message;

        $this->row['validation_status'] = 'invalid';
        $this->row['validation_errors'] = $this->errors;
    }

    /**
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator
     */
    protected function setErrors(\ArrayObject $errors)
    {
        $this->errors = $errors;

        return $this;
    }

    /**
     * @param \ArrayObject $row
     * @return BaseImportServiceEntityValidator
     */
    protected function setRow(\ArrayObject $row)
    {
        $this->row = $row;

        return $this;
    }

    /**
     * Useful stub to translate strings
     *
     * @param $message string
     * @return string
     */
    protected function translate($message)
    {
        return $this->localizationService->getMessage($message);
    }
}
