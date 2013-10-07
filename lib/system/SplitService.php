<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\core\db\Where;
use NP\core\db\Expression;
use NP\core\validation\EntityValidator;
use NP\property\PropertyGateway;
use NP\vendor\VendorGateway;
use NP\property\UnitGateway;
use NP\system\IntegrationPackageGateway;
use NP\gl\GLAccountGateway;

/**
 * All operations that are closely related to splits belong in this service
 *
 * @author Thomas Messier
 */
class SplitService extends AbstractService {
	
	protected $securityService, $dfSplitGateway, $dfSplitItemsGateway, $propertyGateway,
			$integrationPackageGateway, $glAccountGateway;
	
	public function __construct(DfSplitGateway $dfSplitGateway, DfSplitItemsGateway $dfSplitItemsGateway,
								PropertyGateway $propertyGateway, VendorGateway $vendorGateway,
								UnitGateway $unitGateway, IntegrationPackageGateway $integrationPackageGateway,
								GLAccountGateway $glAccountGateway) {
		$this->dfSplitGateway            = $dfSplitGateway;
		$this->dfSplitItemsGateway       = $dfSplitItemsGateway;
		$this->propertyGateway           = $propertyGateway;
		$this->vendorGateway             = $vendorGateway;
		$this->unitGateway               = $unitGateway;
		$this->integrationPackageGateway = $integrationPackageGateway;
		$this->glAccountGateway          = $glAccountGateway;
	}
	
	/**
	 * Setter function required by DI to set the config service via setter injection
	 * @param \NP\system\ConfigService $configService
	 */
	public function setSecurityService(\NP\security\SecurityService $securityService) {
		$this->securityService = $securityService;
	}

	/**
	 * Returns a split
	 *
	 * @param  int   $dfsplit_id
	 * @return array
	 */
	public function get($dfsplit_id) {
		return $this->dfSplitGateway->findById($dfsplit_id);
	}

	/**
	 * Returns line items for a split
	 *
	 * @param  int   $dfsplit_id
	 * @return array
	 */
	public function getSplitItems($dfsplit_id) {
		return $this->dfSplitItemsGateway->find(
			'dfsplit_id = ?',
			array($dfsplit_id),
			null,
			array(
				'dfsplititem_id',
				'dfsplit_id',
				'property_id'  => new Expression('CASE WHEN property_id = 0 THEN NULL ELSE property_id END'),
				'glaccount_id' => new Expression('CASE WHEN glaccount_id = 0 THEN NULL ELSE glaccount_id END'),
				'unit_id'      => new Expression('CASE WHEN unit_id = 0 THEN NULL ELSE unit_id END'),
				'dfsplititem_percent',
				'universal_field1',
				'universal_field2',
				'universal_field3',
				'universal_field4',
				'universal_field5',
				'universal_field6',
				'universal_field7',
				'universal_field8'
			)
		);
	}

	/**
	 * Get all splits in the application
	 *
	 * @param  int    $property_id
	 * @param  int    $glaccount_id
	 * @param  int    $pageSize     The number of records per page; if null, all records are returned
	 * @param  int    $page         The page for which to return records
	 * @param  string $sort         Field(s) by which to sort the result; defaults to dfsplit_name
	 * @return array
	 */
	public function getByFilter($property_id=null, $glaccount_id=null, $pageSize=null, $page=1, $sort='dfsplit_name') {
		return $this->dfSplitGateway->findByFilter($property_id, $glaccount_id, $pageSize, $page, $sort);
	}

	/**
	 * Deletes one or more splits
	 *
	 * @param  int|array $dfsplit_id
	 * @return array
	 */
	public function deleteSplit($dfsplit_id) {
		// If a single value is passed as an int, convert to array
		if (!is_array($dfsplit_id)) {
			$dfsplit_id = array($dfsplit_id);
		}

		$this->dfSplitGateway->beginTransaction();
		$error = null;

		try {
			$where = Where::get()->in('dfsplit_id', $this->dfSplitGateway->createPlaceholders($dfsplit_id));

			$this->dfSplitGateway->update(
				array('dfsplit_status'=>'inactive'),
				$where,
				$dfsplit_id
			);
		} catch(\Exception $e) {
			$error = $this->handleUnexpectedError($e);
		}

		if ($error === null) {
			$this->dfSplitGateway->commit();
		} else {
			$this->dfSplitGateway->rollback();
		}

		return array(
			'success' => ($error === null) ? true : false,
			'error'   => $error
		);
	}

	/**
	 * Makes a copy of a split
	 *
	 * @param  int    $dfsplit_id   Id of the split to copy
	 * @param  string $dfsplit_name Name of the split to copy
	 */
	public function copySplit($dfsplit_id) {
		$this->dfSplitGateway->beginTransaction();
		$error = null;
		$new_dfsplit_id = null;

		try {
			$new_dfsplit_id = $this->dfSplitGateway->copySplit($dfsplit_id);
		} catch(\Exception $e) {
			$error = $this->handleUnexpectedError($e);
		}

		if ($error === null) {
			$this->dfSplitGateway->commit();
		} else {
			$this->dfSplitGateway->rollback();
		}

		return array(
			'success'    => ($error === null) ? true : false,
			'error'      => $error,
			'dfsplit_id' => $new_dfsplit_id
		);
	}

	/**
	 * Saves a split
	 *
	 * @param  array $data Data for the save operation
	 * @return array
	 */
	public function saveSplit($data) {
		$this->dfSplitGateway->beginTransaction();
		$errors = array();

		try {
			// Create the entity
			$dfSplit = new \NP\system\DfSplitEntity($data['dfsplit']);
			
			// If split is not new, assign an updated by user value
			if ($dfSplit->dfsplit_id !== null) {
				$dfSplit->dfsplit_update_userprofile = $this->securityService->getUserId();
			}

			// If a vendor was picked, get the vendorsite_id and add it to the split record
			if ($data['vendor_id'] !== null) {
				$vendor = $this->vendorGateway->findById($data['vendor_id']);
				$dfSplit->vendorsite_id = $vendor['vendorsite_id'];
			} else {
				$dfSplit->vendorsite_id = null;
			}

			// Validate the split record
			$errors = $this->entityValidator->validate($dfSplit);

			// If there are no errors, save the split record and line items
			if (!count($errors)) {
				$this->dfSplitGateway->save($dfSplit);

				// Loop through the lines and save each one
				foreach ($data['dfSplitItems'] as $dfSplitItem) {
					// Assign the dfsplit_id for the line
					$dfSplitItem['dfsplit_id'] = $dfSplit->dfsplit_id;
					// Save the line
					$saveItemResult = $this->saveSplitLine($dfSplitItem);
					// If there was an error saving a line, capture the error and abort other line saves
					if (!$saveItemResult['success']) {
						$errors = array_merge($errors, $saveItemResult['errors']);
						break;
					}
				}

				// Remove deleted lines if any
				if ( count($data['removedDfSplitItems']) ) {
					// Delete the line items
					$removeItemsResult = $this->deleteSplitLines($data['removedDfSplitItems']);
					// If there was an error deleting lines, capture the error
					if (!$removeItemsResult['success']) {
						$errors = array_merge($errors, array('field'=>'global', 'msg'=>$removeItemsResult['error']));
					}
				}
			}
		} catch(\Exception $e) {
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e));
		}

		// Commit if no errors
		if (!count($errors)) {
			$this->dfSplitGateway->commit();
		} else {
			$this->dfSplitGateway->rollback();
		}

		return array(
			'success' => count($errors) ? false : true,
			'errors'  => $errors
		);
	}

	/**
	 * Saves a split line item
	 *
	 * @param  array $data Data for the save operation
	 * @return array
	 */
	public function saveSplitLine($data) {
		$this->dfSplitItemsGateway->beginTransaction();
		$errors = array();

		try {
			// Create the entity for the split line
			$dfSplitItem = new \NP\system\DfSplitItemEntity($data);

			// Validate the split line
			$errors = $this->entityValidator->validate($dfSplitItem);

			// If there were no errors, save the line item
			if (!count($errors)) {
				$this->dfSplitItemsGateway->save($dfSplitItem);
			}
		} catch(\Exception $e) {
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e));
		}

		// If no errors, commit transaction
		if (!count($errors)) {
			$this->dfSplitItemsGateway->commit();
		} else {
			$this->dfSplitItemsGateway->rollback();
		}

		return array(
			'success' => (count($errors)) ? false : true,
			'errors'  => $errors
		);
	}

	/**
	 * Deletes one or more split line items
	 *
	 * @param  int|array Id(s) for the line items to delete
	 * @return array
	 */
	public function deleteSplitLines($dfsplititem_id) {
		$error = null;

		try {
			if (!is_array($dfsplititem_id)) {
				$dfsplititem_id = array($dfsplititem_id);
				$where = Where::get()->equals('dfsplititem_id', '?');
			} else {
				$where = Where::get()->in('dfsplititem_id', $this->dfSplitItemsGateway->createPlaceholders($dfsplititem_id));
			}
			$this->dfSplitItemsGateway->delete($where, $dfsplititem_id);
		} catch(\Exception $e) {
			$error = $this->handleUnexpectedError($e);
		}

		return array(
			'success' => ($error === null) ? true : false,
			'error'   => $error
		);
	}

	/**
	 * Save Split from import
	 */
	public function saveSplitFromImport($data) {
		// Use this to store integration package IDs
		$intPkgs      = array();
		$errors       = array();
		$dfSplitItems = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
        	// If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $integration_package_id = $intPkgs[$row['integration_package_name']];

        	// Get property ID
            $rec = $this->propertyGateway->find(
            	array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
            	array($row['property_id_alt'], $integration_package_id)
            );
            $row['property_id'] = $rec[0]['property_id'];

            // Get unit ID
            if ($row['unit_id_alt'] != '') {
                $rec = $this->unitGateway->find(
                    array('u.unit_id_alt' => '?', 'u.property_id' => '?'),
                    array($row['unit_id_alt'], $row['property_id'])
                );
                $row['unit_id'] = $rec[0]['unit_id'];
            } else {
                $row['unit_id'] = null;
            }

            // Get GL Account ID
            $rec = $this->glAccountGateway->find(
            	array('glaccount_number'=>'?', 'integration_package_id'=>'?'),
            	array($row['glaccount_number'], $integration_package_id)
            );
            $row['glaccount_id'] = $rec[0]['glaccount_id'];

            $dfSplitItems[] = $row;

            // Only save once you've picked up one split group
            if (($idx+1) === count($data) || $data[$idx+1]['dfsplit_name'] != $row['dfsplit_name']) {
            	// Get vendor ID
            	if ($row['vendor_id_alt'] != '') {
	            	$vendor = $this->vendorGateway->find(
	            		array('vendor_id_alt'=>'?', 'integration_package_id'=>'?'),
	            		array($row['vendor_id_alt'], $integration_package_id)
	            	);
	            	$vendor_id = $vendor[0]['vendor_id'];
	            } else {
	            	$vendor_id = null;
	            }

        		$row['integration_package_id'] = $integration_package_id;

            	$dfSplitData = array(
					'dfsplit'             => $row,
					'dfSplitItems'        => $dfSplitItems,
					'vendor_id'           => $vendor_id,
					'removedDfSplitItems' => array()
	            );
	            
	            // Save the row
	            $result = $this->saveSplit($dfSplitData);

	            // Clear the array of items for the next split
	            $dfSplitItems = array();

	            // Set errors
	            if (!$result['success']) {
	                $rowNum = $idx + 1;
	                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
	                $errors[] = $errorMsg;

	                $this->loggingService->log('error', 'Error importing split', $result['errors']);
	            }
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
	}
}

?>