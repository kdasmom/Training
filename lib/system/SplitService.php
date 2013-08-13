<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\core\db\Where;
use NP\core\db\Expression;
use NP\core\validation\EntityValidator;
use NP\vendor\VendorGateway;

/**
 * All operations that are closely related to splits belong in this service
 *
 * @author Thomas Messier
 */
class SplitService extends AbstractService {
	
	protected $securityService, $dfSplitGateway, $dfSplitItemsGateway, $propertySplitGateway;
	
	public function __construct(DfSplitGateway $dfSplitGateway, DfSplitItemsGateway $dfSplitItemsGateway,
								PropertySplitGateway $propertySplitGateway, VendorGateway $vendorGateway) {
		$this->dfSplitGateway       = $dfSplitGateway;
		$this->dfSplitItemsGateway  = $dfSplitItemsGateway;
		$this->propertySplitGateway = $propertySplitGateway;
		$this->vendorGateway = $vendorGateway;
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
	 * @param  int $property_id
	 * @param  int $glaccount_id
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
	 * @param  int    $dfsplit_id
	 * @param  string $dfsplit_name
	 */
	public function copySplit($dfsplit_id, $dfsplit_name) {
		$this->dfSplitGateway->beginTransaction();
		$error = null;
		$new_dfsplit_id = null;

		try {
			$new_dfsplit_id = $this->dfSplitGateway->copySplit($dfsplit_id, $dfsplit_name);
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
	 */
	public function saveSplit($data) {
		$this->dfSplitGateway->beginTransaction();
		$errors = array();

		try {
			$dfSplit = new \NP\system\DfSplitEntity($data['dfsplit']);
			
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
			$validator = new EntityValidator();
			$validator->validate($dfSplit);
			$errors    = $validator->getErrors();

			// If there are no errors, save the split record and line items
			if (!count($errors)) {
				$this->dfSplitGateway->save($dfSplit);

				// Loop through the lines and save each one
				foreach ($data['dfSplitItems'] as $dfSplitItem) {
					$dfSplitItem['dfsplit_id'] = $dfSplit->dfsplit_id;
					$saveItemResult = $this->saveSplitLine($dfSplitItem);
					if (!$saveItemResult['success']) {
						$errors = array_merge($errors, $saveItemResult['errors']);
						break;
					}
				}

				// Remove deleted lines if any
				if ( count($data['removedDfSplitItems']) ) {
					$removeItemsResult = $this->deleteSplitLines($data['removedDfSplitItems']);
					if (!$removeItemsResult['success']) {
						$errors = array_merge($errors, array('field'=>'global', 'msg'=>$removeItemsResult['error']));
					}
				}
			}
		} catch(\Exception $e) {
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e));
		}

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
	 * 
	 */
	public function saveSplitLine($data) {
		$this->dfSplitItemsGateway->beginTransaction();
		$errors = array();

		try {
			$dfSplitItem = new \NP\system\DfSplitItemEntity($data);

			$validator = new EntityValidator();
			$validator->validate($dfSplitItem);
			$errors    = $validator->getErrors();

			if (!count($errors)) {
				$this->dfSplitItemsGateway->save($dfSplitItem);
			}
		} catch(\Exception $e) {
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e));
		}

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
}

?>