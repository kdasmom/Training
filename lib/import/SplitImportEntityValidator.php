<?php
namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\db\Adapter;
use NP\system\IntegrationPackageGateway;
use NP\vendor\VendorGateway;
use NP\property\PropertyGateway;
use NP\property\UnitGateway;
use NP\gl\GLAccountGateway;
use NP\system\DfSplitGateway;
use NP\system\PnUniversalFieldGateway;
use NP\system\ConfigService;

/**
 * Entity class for importing splits
 *
 * @author Thomas Messier
 */
class SplitImportEntityValidator extends AbstractImportEntityValidator {

    protected $configService, $integrationPackageGateway, $vendorGateway, $propertyGateway, $glAccountGateway,
            $dfSplitGateway, $pnUniversalFieldGateway;

    public function __construct(LocalizationService $localizationService,
                                Adapter $adapter, IntegrationPackageGateway $integrationPackageGateway,
                                VendorGateway $vendorGateway, PropertyGateway $propertyGateway, UnitGateway $unitGateway,
                                GLAccountGateway $glAccountGateway, DfSplitGateway $dfSplitGateway,
                                PnUniversalFieldGateway $pnUniversalFieldGateway, ConfigService $configService) {
        // Initialize the class
        parent::__construct($localizationService, $adapter);

        $this->integrationPackageGateway = $integrationPackageGateway;
        $this->vendorGateway             = $vendorGateway;
        $this->propertyGateway           = $propertyGateway;
        $this->unitGateway               = $unitGateway;
        $this->glAccountGateway          = $glAccountGateway;
        $this->dfSplitGateway            = $dfSplitGateway;
        $this->pnUniversalFieldGateway   = $pnUniversalFieldGateway;
        $this->configService             = $configService;
    }

    public function validate(\NP\core\AbstractEntity $entity) {
        $errors = parent::validate($entity);
        
        // Make sure the integration package is valid
        $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($entity->integration_package_name)
        );
        
        // Validate certain fields that depend on the integration package
        if (!empty($intPkg)) {
            // Validate vendor
            $vendor = $this->vendorGateway->find(
                array('vendor_id_alt'=>'?', 'vendor_status'=>'?', 'integration_package_id'=>'?'),
                array($entity->vendor_id_alt, 'active', $intPkg[0]['integration_package_id'])
            );
            
            if (empty($vendor)) {
                $this->addError($errors, 'vendor_id_alt', 'importFieldVendorCodeError');
            }

            // Validate property
            $prop = $this->propertyGateway->find(
                array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($entity->property_id_alt, $intPkg[0]['integration_package_id'])
            );
            
            if (empty($prop)) {
                $this->addError($errors, 'property_id_alt', 'importFieldPropertyCodeError');
            } else if ($entity->unit_id_alt != '') {
                $rec = $this->unitGateway->find(
                    array('u.unit_id_alt'=>'?', 'u.property_id'=>'?'),
                    array($entity->unit_id_alt, $prop[0]['property_id'])
                );
                if (empty($rec)) {
                    $this->addError($errors, 'unit_id_alt', 'importFieldUnitError');
                }
            }

            // Validate the default glaccount if not blank
            $rec = $this->glAccountGateway->find(
                array('glaccount_number' => '?', 'integration_package_id' => '?'),
                array($entity->glaccount_number, $intPkg[0]['integration_package_id'])
            );

            if (empty($rec)) {
                $this->addError($errors, 'glaccount_number', 'importFieldGLAccountNameError');
            }

            // Make sure the split is new
            $rec = $this->dfSplitGateway->find('dfsplit_name = ?', array($entity->dfsplit_name));
            if (!empty($rec)) {
                $this->addError($errors, 'dfsplit_name', 'importFieldSplitExistsError');
            }

            // Validate custom fields
            $cFields = $this->configService->getInvoicePoCustomFields();
            $cFields = $cFields['line']['fields'];
            for ($i=1; $i<=6; $i++) {
                $field = "universal_field{$i}";
                
                if ($cFields[$i]['invRequired'] == '1' && $entity->$field == '') {
                    $this->addError($errors, $field, 'requiredFieldError');
                }

                if ($entity->$field != '') {
                    $isOption = $this->pnUniversalFieldGateway->isValueValid(
                        'customInvoicePO',
                        $i,
                        $entity->$field
                    );
                    if (!$isOption) {
                        $this->addError(
                            $errors,
                            $field,
                            $this->localizationService->getMessage('importFieldOptionError')
                        );
                    }
                }
            }
        } else {
            $this->addError($errors, 'vendor_id_alt', 'importFieldDependentIntPkgError');
            $this->addError($errors, 'property_id_alt', 'importFieldDependentIntPkgError');
            $this->addError($errors, 'glaccount_number', 'importFieldDependentIntPkgError');
        }

        return $errors;
    }
    
    public function validateCollection(&$data) {
        $items = array();
        foreach ($data as $idx=>$row) {
            $row['idx'] = $idx;
            $items[] = $row;
            if ($idx+1 == count($data) || $row['dfsplit_name'] != $data[$idx+1]['dfsplit_name']) {
                // Verify that all items are in the same integration package and vendor
                $prevIntPkg = null;
                $prevVendor = null;
                $error = null;
                foreach ($items as $item) {
                    if ($prevIntPkg != null && $item['integration_package_name'] != $prevIntPkg) {
                        $error = 'importFieldSplitIntPkgError';
                        break;
                    }

                    if ($prevVendor != null && $item['vendor_id_alt'] != $prevVendor) {
                        $error = 'importFieldSplitVendorError';
                        break;
                    }

                    $prevIntPkg = $item['integration_package_name'];
                    $prevVendor = $item['vendor_id_alt'];
                }
                if ($error !== null) {
                    $this->addRowError($data, $items, $error);
                }
                
                // Verify if the percentages add up to 100%
                $total = array_reduce($items, function($result, $item) {
                    return $result += $item['dfsplititem_percent'];
                }, 0);

                if ($total != 100) {
                    $this->addRowError($data, $items, 'importFieldSplitPercentError');
                }
            }
        }
    }

    protected function addRowError(&$data, $items, $errorMsg) {
        foreach ($items as $item) {
            $data[$item['idx']]['validation_status'] = 'invalid';
            $data[$item['idx']]['validation_errors']['global'] = $this->localizationService->getMessage($errorMsg);
        }
    }
}
