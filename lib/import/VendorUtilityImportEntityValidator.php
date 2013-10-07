<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 3:19 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\db\Adapter;
use NP\property\PropertyGateway;
use NP\property\UnitGateway;

class VendorUtilityImportEntityValidator extends AbstractImportEntityValidator {

    protected $propertyGateway, $unitGateway;

    public function __construct(LocalizationService $localizationService, Adapter $adapter,
                                PropertyGateway $propertyGateway, UnitGateway $unitGateway) {
        parent::__construct($localizationService, $adapter);

		$this->propertyGateway = $propertyGateway;
		$this->unitGateway     = $unitGateway;
    }

    public function validate(\NP\core\AbstractEntity $entity) {
        $errors = parent::validate($entity);

        // Validate property
        $prop = $this->propertyGateway->find('property_id_alt = ?', array($entity->property_id_alt));

        // Check if record already exists
        if ($entity->unit_id_alt != '' && !empty($prop)) {
            $rec = $this->unitGateway->find(
            	array('u.property_id'=>'?', 'unit_id_alt'=>'?'),
            	array($prop[0]['property_id'], $entity->unit_id_alt)
            );

            if (empty($rec)) {
            	$this->addError($errors, 'unit_id_alt', 'importFieldUnitError');
            }
        }

        return $errors;
    }
}
