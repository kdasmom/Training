<?php

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\db\Adapter;
use NP\system\IntegrationPackageGateway;
use NP\property\PropertyGateway;
use NP\property\UnitGateway;
use NP\property\UnitTypeGateway;

class UnitImportEntityValidator extends AbstractImportEntityValidator {
	protected $propertyGateway, $unitGateway, $unitTypeGateway;

	public function __construct(LocalizationService $localizationService, Adapter $adapter,
								IntegrationPackageGateway $integrationPackageGateway,
                                PropertyGateway $propertyGateway, UnitGateway $unitGateway,
								UnitTypeGateway $unitTypeGateway) {
		parent::__construct($localizationService, $adapter);

		$this->integrationPackageGateway = $integrationPackageGateway;
		$this->propertyGateway           = $propertyGateway;
		$this->unitGateway               = $unitGateway;
		$this->unitTypeGateway           = $unitTypeGateway;
	}

	public function validate(\NP\core\AbstractEntity $entity) {
		$errors = parent::validate($entity);

		// Make sure the category is valid for this integration package
        $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($entity->integration_package_name)
        );

        if (!empty($intPkg)) {
            // Validate property
            $prop = $this->propertyGateway->find(
                array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($entity->property_id_alt, $intPkg[0]['integration_package_id'])
            );
            
            if (empty($prop)) {
                $this->addError($errors, 'property_id_alt', 'importFieldPropertyCodeError');
            }

            if (!empty($prop)) {
            	// Validate unit type
                $rec = $this->unitTypeGateway->find(
                    array('ut.property_id' => '?', 'ut.unittype_name'=> '?'),
                    array($prop[0]['property_id'], $entity->unittype_name)
                );

                if (empty($rec)) {
                    $this->addError($errors, 'unittype_name', 'importFieldUnitTypeError');
                }

                // Make sure unit doesn't already exist
                $rec = $this->unitGateway->find(
                    array('u.property_id' => '?', 'u.unit_number'=> '?', 'u.unit_id_alt'=> '?'),
                    array($prop[0]['property_id'], $entity->unit_number, $entity->unit_id_alt)
                );

                if (!empty($rec)) {
                    $this->addError($errors, 'global', 'importFieldUnitExistsError');
                }
            }
        } else {
            $this->addError($errors, 'property_id_alt', 'importFieldDependentIntPkgError');
            $this->addError($errors, 'unittype_name', 'importFieldDependentIntPkgError');
        }

		return $errors;
	}
}