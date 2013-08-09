<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * All operations that are closely related to splits belong in this service
 *
 * @author Thomas Messier
 */
class SplitService extends AbstractService {
	
	protected $dfSplitGateway, $dfSplitItemsGateway, $propertySplitGateway;
	
	public function __construct(DfSplitGateway $dfSplitGateway, DfSplitItemsGateway $dfSplitItemsGateway,
								PropertySplitGateway $propertySplitGateway) {
		$this->dfSplitGateway       = $dfSplitGateway;
		$this->dfSplitItemsGateway  = $dfSplitItemsGateway;
		$this->propertySplitGateway = $propertySplitGateway;
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
			$params = $dfsplit_id;

			$where = Where::get()->in('dfsplit_id', '?');

			$this->dfSplitItemsGateway->delete($where, $params);
			$this->propertySplitGateway->delete($where, $params);
			$this->dfSplitGateway->delete($where, $params);
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

		try {
			$this->dfSplitGateway->copySplit($dfsplit_id, $dfsplit_name);
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
}

?>