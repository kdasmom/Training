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

        $this->validate($row, $errors);
    }
    /**
     * @param $field string
     * @param $message string
     * @param null $extra
     * @throws \Exception
     */
    protected function addLocalizedErrorMessage($field, $message, $extra = null)
    {
        if(is_null($this->errors)) {
            throw new \Exception('Please do $this->setErrors($errors) at the begining of validate method body');
        }

        $this->errors->append(array(
            'field' => $field,
            'msg'   => $this->localizationService->getMessage($message),
            'extra' => $extra
        ));
    }

    /**
     * @param $field string
     * @param $message string
     * @param null $extra
     * @throws \Exception
     */
    protected function addErrorMessage($field, $message, $extra = null)
    {
        if(is_null($this->errors)) {
            throw new \Exception('Please do $this->setErrors($errors) at the beginning of validate method body');
        }

        $this->errors->append(array(
            'field' => $field,
            'msg'   => $message,
            'extra' => $extra
        ));
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
