<?php

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\Config;
use NP\core\db\Adapter;
use NP\system\IntegrationPackageGateway;
use NP\system\PnCustomFieldsGateway;
use NP\system\PnUniversalFieldGateway;
use NP\contact\StateGateway;

class PropertyImportEntityValidator extends AbstractContactImportEntityValidator {

    protected $integrationPackageGateway, $pnCustomFieldsGateway, $pnUniversalFieldGateway;

    public function __construct(LocalizationService $localizationService,
                                Adapter $adapter,
                                Config $config,
                                IntegrationPackageGateway $integrationPackageGateway,
                                StateGateway $stateGateway,
                                PnCustomFieldsGateway $pnCustomFieldsGateway,
                                PnUniversalFieldGateway $pnUniversalFieldGateway) {
        // Initialize the class
        parent::__construct($localizationService, $adapter, $config, $stateGateway);

        $this->integrationPackageGateway = $integrationPackageGateway;
        $this->pnCustomFieldsGateway     = $pnCustomFieldsGateway;
        $this->pnUniversalFieldGateway   = $pnUniversalFieldGateway;
    }

    public function validate(\NP\core\AbstractEntity $entity) {
        $errors = parent::validate($entity);

        // Validate custom fields
        for ($i=1; $i<=4; $i++) {
            $field = "customfielddata_value{$i}";
            $rec = $this->pnCustomFieldsGateway->find(
                array('customfield_name'=>'?', 'customfield_pn_type'=>'?'),
                array("propertyCustom{$i}", 'property')
            );
            $rec = $rec[0];

            if ($rec['customfield_required'] == 1 && $entity->$field == '') {
                $this->addError($errors, $field, 'requiredFieldError');
            }

            if ($entity->$field != '') {
                if (is_int($rec['customfield_max_length']) && strlen($entity->$field) > $rec['customfield_max_length']) {
                    $this->addError(
                        $errors,
                        $field,
                        "{$this->localizationService->getMessage('importFieldLengthError')} {$rec['customfield_max_length']}"
                    );
                }
                if ($rec['customfield_type'] == 'select') {
                    $isOption = $this->pnUniversalFieldGateway->isValueValid(
                        'property',
                        $rec['universal_field_number'],
                        $entity->$field
                    );
                    if (!$isOption) {
                        $this->addError(
                            $errors,
                            $field,
                            "{$this->localizationService->getMessage('importFieldOptionError')}: {$entity->$field}"
                        );
                    }
                }
            }
        }

        return $errors;
    }
}
