<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 3/3/14
 * Time: 12:53 PM
 */

namespace NP\integration;


use NP\core\AbstractService;
use NP\core\Exception;

class PnScheduleService extends AbstractService {

	/**
	 * Retrieve available transfer
	 *
	 * @param int $page
	 * @param null $pageSize
	 * @param string $order
	 * @return mixed
	 */
	public function getAllAvailabletransfer($page = 1, $limit = null, $order = 'schedulecode') {
		return $this->pnScheduleGateway->getAllAvailabletransfer($page, $limit, $order);
	}

	/**
	 * Retrieve history
	 *
	 * @param int $page
	 * @param null $limit
	 * @param string $order
	 * @return mixed
	 */
	public function getSynchHistory($page = 1, $limit = null, $order = 'transferred_datetm') {
		return $this->pnScheduleGateway->getSynchHistory($page, $limit, $order);
	}

	/**
	 * Retrieve outstanding sync tasks
	 *
	 * @param int $page
	 * @param null $limit
	 * @param string $order
	 * @return mixed
	 */
	public function getOutstandingSync($page = 1, $limit = null, $order = 'schedulename') {
		return $this->pnScheduleGateway->getOutstandingSync($page, $limit, $order);
	}

	/**
	 * Get on Demand transfer
	 *
	 * @param $page
	 * @param $limit
	 * @param string $order
	 * @return mixed
	 */
	public function getOnDemandTransfer($page = 1, $limit = null, $order = 'schedulename'){
		return $this->pnScheduleGateway->getOnDemandTransfer($page, $limit, $order);
	}

	/**
	 * Return schedule by history id
	 *
	 * @param null $history_id
	 * @return bool
	 */
	public function getByHistoryId($history_id = null) {
		if (!$history_id) {
			return false;
		}

		return $this->pnScheduleGateway->getByHistoryId($history_id);
	}

	/**
	 * Get failed synch history
	 *
	 * @param $history_id
	 * @return mixed
	 */
	public function getFailedSynchHistory($history_id = null) {
		if (!$history_id) {
			return [];
		}

		return $this->pnScheduleGateway->getFailedSynchHistory($history_id);
	}

	/**
	 * Import on demand integration
	 *
	 * @param null $userprofile_id
	 * @param $data
	 * @return bool
	 */
	public function importOnDemandIntegration($userprofile_id = null, $schedules = []) {
		if (!$userprofile_id) {
			return false;
		}

		if (count($schedules) > 0) {
			if (!$this->pnScheduleGateway->importOnDemandIntegration($userprofile_id, $schedules)) {
				throw new Exception('Cannot import!');
			};
		}

		return true;
	}
} 