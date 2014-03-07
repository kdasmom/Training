<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 3/3/14
 * Time: 12:22 PM
 */

namespace NP\integration;


use NP\core\AbstractGateway;
use NP\core\db\Expression;
use NP\core\db\Insert;
use NP\core\db\Select;
use Symfony\Component\Config\Definition\Exception\Exception;

class PnScheduleGateway extends AbstractGateway {

	const MAXWINDOW = 15;

	protected $table = 'webservices_pn_scheduler';
	protected $pk = 'schedule_id';

	/**
	 * Retrieve available transfer
	 *
	 * @param int $page
	 * @param null $pageSize
	 * @param string $order
	 * @return array|bool
	 */
	public function getAllAvailabletransfer($page = 1, $pageSize = null, $order = 'schedulecode') {
		$select = new Select();

		$select->from(['wsc' => 'webservices_pn_scheduler'])
			->distinct()
			->columns(
				[
					'schedulecode',
					'schedulename',
					'integration_id',
					'LastRun_datetm'			=> new Expression("MAX(ISNULL(wsc.lastrun_datetm, '1900-01-01'))"),
					'ShouldAllow'				=> new Expression("CASE WHEN wsc.schedulecode + '~' + CAST(wsc.integration_id AS VARCHAR) IN (SELECT schedulecode + '~' + CAST(integration_id AS VARCHAR) FROM WEBSERVICES_PN_SCHEDULER_HISTORY INNER JOIN WEBSERVICES_PN_SCHEDULER ON WEBSERVICES_PN_SCHEDULER_HISTORY.schedule_id = WEBSERVICES_PN_SCHEDULER.schedule_id WHERE STATUS IN ('Waiting','Running') AND DATEDIFF(minute, request_datetm, GETDATE()) < " . self::MAXWINDOW . ") THEN 0 ELSE 1 END"),
					'Next_Scheduled_Run_Time'	=> new Expression("MIN(DATEADD(minute, ((DATEDIFF(minute, wsc.seed_datetm, GETDATE())/ runeveryxminutes) * runeveryxminutes) + runeveryxminutes, wsc.seed_datetm))")
				]
			)
			->join(['wscf' => 'webservices_pn_scheduler_frequency'], 'wsc.schedulecode  = wscf.schedulecode', ['run_frequency'])
			->join(['ip' => 'integrationpackage'], 'ip.integration_package_id = wsc.integration_id', ['integration_package_name'])
			->group(['wsc.schedulecode', 'wsc.schedulename', 'wsc.integration_id', 'wscf.run_frequency', 'ip.integration_package_name'])
			->limit($pageSize)
			->offset($pageSize * ($page - 1))
			->order($order);

		return $this->adapter->query($select);
	}


	/**
	 * Retrieve synch history
	 *
	 * @param $page
	 * @param $pageSize
	 * @param $order
	 * @return array|bool
	 */
	public function getSynchHistory($page, $pageSize, $order) {
		$select = new Select();
		$requestersSelect = new Select();

		$requestersSelect->from(['u2' => 'userprofile'])
			->columns(['userprofile_id'])
			->join(['w' => 'webservices_pn_scheduler_history'], 'w.userprofile_id = u2.userprofile_id', [])
			->join(['ur' => 'userprofilerole'], 'u2.userprofile_id = ur.userprofile_id', [])
			->join(['s' => 'staff'], 'ur.tablekey_id = s.staff_id', [])
			->join(['p'	=> 'person'], 's.person_id = p.person_id', ['person_firstname', 'person_lastname'])
			->union(Select::get()->columns([new Expression("null"), new Expression("null"), new Expression("'SYSTEM'")]));


		$select->from(['ws' => 'webservices_pn_scheduler'])
			->distinct()
			->columns(
				[
					'schedulename',
					'schedulecode',
					'status'	=> new Expression("
						CASE WHEN wsh.status ='Completed' AND (wsh.errorcode IS NULL OR wsh.errorcode=0)THEN 'Completed'
            				WHEN wsh.status ='Completed' AND wsh.errorcode = 1 THEN 'Completed with Exceptions'
            				WHEN wsh.errorcode is not null AND (wsh.resultcount IS NULL OR wsh.resultcount =0) THEN 'Failed'
           				ELSE wsh.status
       					END"),
					'Details'	=> new Expression("CASE WHEN wsh.status ='Completed' AND (wsh.errorcode IS NULL OR wsh.errorcode=0) THEN NULL
                                           WHEN wsh.status ='Completed' AND wsh.errorcode = 1 THEN 'error'
                                           WHEN wsh.errorcode is not null AND (wsh.resultcount IS NULL OR wsh.resultcount =0) THEN 'error'
                                           ELSE NULL
                                      END"),
					'Num_Of_Invoices'	=> new Expression("CASE WHEN ws.schedulecode = 'ImportInvoices' THEN wsh.resultcount ELSE null END")
				]
			)
			->join(['wsh' => 'webservices_pn_scheduler_history'], 'ws.schedule_id =wsh.schedule_id', ['userprofile_id', 'transferred_datetm', 'resultcount', 'history_id'])
			->join(['Requesters' => $requestersSelect], 'ISNULL(Requesters.userprofile_id,0) = ISNULL(wsh.userprofile_id,0)', ['person_firstname', 'person_lastname'])
			->whereNest('OR')
			->whereEquals('wsh.status', '?')
			->whereNest('AND')
			->whereIsNotNull('wsh.errorcode')
			->whereNest('OR')
			->whereIsNull('wsh.resultcount')
			->whereEquals('wsh.resultcount', '?')
			->whereUnnest()
			->whereUnnest()
			->whereUnnest()
			->order($order)
			->limit($pageSize)
			->offset($pageSize * ($page - 1));

		return $this->adapter->query($select, ['Completed', 0]);
	}

	/**
	 * Retrieve outstanding sync tasks
	 *
	 * @return array|bool
	 */
	public function getOutstandingSync($page, $pageSize, $order = 'schedulename') {
		$select = new Select();
		$subSelect = new Select();

		$subSelect->from(['u2' => 'userprofile'])
			->columns(['userprofile_id'])
			->join(['w' => 'webservices_pn_scheduler_history'], 'w.userprofile_id = u2.userprofile_id', [])
			->join(['ur' => 'userprofilerole'], 'u2.userprofile_id = ur.userprofile_id', [])
			->join(['s' => 'staff'], 'ur.tablekey_id = s.staff_id', [])
			->join(['p' => 'person'], 's.person_id = p.person_id', ['person_firstname', 'person_lastname']);

		$select->from(['ws' => 'webservices_pn_scheduler'])
			->distinct()
			->columns([
				'schedulename', 'schedulecode'
			])
			->join(['wsh' => 'webservices_pn_scheduler_history'], 'ws.schedule_id =wsh.schedule_id', ['request_datetm', 'status'])
			->join(['Requesters' => $subSelect], 'Requesters.userprofile_id = wsh.userprofile_id', ['person_firstname',  'person_lastname'])
			->whereIn('wsh.status', '?')
			->order($order)
			->limit($pageSize)
			->offset($pageSize * ($page - 1));

		return $this->adapter->query($select, [implode(',', ['Waiting', 'Running'])]);
	}

	/**
	 * Get on Demand transfer
	 *
	 * @param $page
	 * @param $pageSize
	 * @param $order
	 * @return array|bool
	 */
	public function getOnDemandTransfer($page, $pageSize, $order) {
		$select = new Select();

		$select->from(['wsc' => 'webservices_pn_scheduler'])
			->columns([
				'schedulecode',
				'schedulename',
				'integration_id',
				'LastRun_datetm'			=> new Expression("MAX(ISNULL(wsc.lastrun_datetm, '1900-01-01'))"),
				'ShouldAllow'				=> new Expression("CASE WHEN wsc.schedulecode + '~' + CAST(wsc.integration_id AS VARCHAR) IN (SELECT schedulecode + '~' + CAST(integration_id AS VARCHAR) FROM WEBSERVICES_PN_SCHEDULER_HISTORY INNER JOIN WEBSERVICES_PN_SCHEDULER ON WEBSERVICES_PN_SCHEDULER_HISTORY.schedule_id = WEBSERVICES_PN_SCHEDULER.schedule_id WHERE STATUS IN ('Waiting','Running') AND DATEDIFF(minute, request_datetm, GETDATE()) < " . self::MAXWINDOW . ") THEN 0 ELSE 1 END"),
				'Next_Scheduled_Run_Time'	=> new Expression("MIN(DATEADD(minute, ((DATEDIFF(minute, wsc.seed_datetm, GETDATE()) / runeveryxminutes) * runeveryxminutes) + runeveryxminutes, wsc.seed_datetm))")
			])
			->join(['wscf' => 'webservices_pn_scheduler_frequency'], 'wsc.schedulecode  = wscf.schedulecode', ['run_frequency'])
			->join(['ip' => 'integrationpackage'], 'ip.integration_package_id = wsc.integration_id', ['integration_package_name'])
			->where([
				'wsc.isactive' => '?',
				'wsc.isondemand' => '?',
			])
			->group(['wsc.schedulecode', 'wsc.schedulename', 'wsc.integration_id', 'wscf.run_frequency', 'ip.integration_package_name'])
			->limit($pageSize)
			->offset($pageSize * ($page - 1));

		return $this->adapter->query($select, [1, 1]);
	}

	/**
	 * Return schedule by history id
	 *
	 * @param $history_id
	 * @return array|bool
	 */
	public function getByHistoryId($history_id) {
		$select = new Select();

		$select->from(['wsh' => 'webservices_pn_scheduler_history'])
			->columns(['transferred_datetm'])
			->join(['ws' => 'webservices_pn_scheduler'], 'wsh.schedule_id = ws.schedule_id', ['schedulename', 'schedulecode'])
			->where([
				'wsh.history_id'	=> '?'
			]);

		return $this->adapter->query($select, [$history_id]);
	}

	public function importOnDemandIntegration($userprofile_id, $schedules) {
		$selectActive = new Select();

		$selectActive->from(['wsc' => 'webservices_pn_scheduler'])
			->columns(['schedulename', 'integration_id'])
			->where([
				'isondemand'	=> '?',
				'isactive'		=> '?'
			]);

		$result = $this->adapter->query($selectActive, [1, 1]);
		foreach ($result as $record) {
			if (in_array($result['schedulecode'], $schedules)) {
				$insert = new Insert();
				$select = new Select();

				$select->from(['w' => 'webservices_pn_scheduler'])
					->columns(
						[
							'schedule_id'			=> new Expression("min(schedule_id)"),
							'userprofile_id'		=> new Expression('?'),
							'request_datetm'		=> new Expression("getdate()"),
							'rollback_datetm'		=> new Expression("null"),
							'transferred_datetm'	=> new Expression("null"),
							'status'				=> new Expression('?'),
							'resultcount'			=> new Expression("null"),
							'errorcode'				=> new Expression("null"),
							'errormessage'			=> new Expression("null")
						]
					)
					->where([
						'schedulecode'		=> '?',
						'integration_id'	=> '?',
						'isOndemand'		=> '?'
					]);

				$insert->into('webservices_pn_scheduler_history')
					->columns(
						[
							'schedule_id',
							'userprofile_id',
							'request_datetm',
							'rollback_datetm',
							'transferred_datetm',
							'status', 'resultcount',
							'errorcode',
							'errormessage'
						]
					)
					->values($select);

				return $this->adapter->query($insert, [$userprofile_id, 'Waiting', $record['schedulecode'], $record['integration_id'], 1]);
			}
		}
	}

	/**
	 * Get failed synch history
	 *
	 * @param $history_id
	 * @return array|bool
	 */
	public function getFailedSynchHistory($history_id) {
		$select = new Select();

		$select->from(['i' => 'invoice'])
			->columns(['invoice_ref'])
			->join(['vs' => 'vendorsite'], 'i.paytablekey_id = vs.vendorsite_id', [])
			->join(['v' => 'vendor'], 'v.vendor_id = vs.vendor_id', ['vendor_name'])
			->join(['p' => 'property'], 'p.property_id = i.property_id', ['property_name'])
			->join(['wdth' => 'webservices_pn_data_transfer_history'], 'wdth.tablekey_id = i.invoice_id', ['errormessage' => 'WSDataTransferHistory_errormessage'])
			->join(['wsh' => 'webservices_pn_scheduler_history'], 'wsh.history_id = wdth.history_id', ['transferred_datetm', 'errorcode'])
			->join(['ws' => 'webservices_pn_scheduler'], 'wsh.schedule_id = ws.schedule_id', ['schedulename'])
			->where([
				'wdth.table_name'	=> '?',
				'wdth.history'		=> '?'
			]);

		return $this->adapter->query($select, ['invoice', $history_id]);
	}
} 