<?php

namespace NP\po;

use NP\core\AbstractGateway;
use NP\core\db\Update;

use NP\property\PropertyContext;
use NP\property\sql\PropertyFilterSelect;
use NP\user\RoleGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * Gateway for the PURCHASEORDER table
 *
 * @author Thomas Messier
 */
class PurchaseOrderGateway extends AbstractGateway {

	protected $roleGateway, $configService;

	public function __construct(Adapter $adapter, RoleGateway $roleGateway) {
		$this->roleGateway = $roleGateway;
		
		parent::__construct($adapter);
	}

	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

	public function findPosToApprove($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$role = $this->roleGateway->findByUser($userprofile_id);
		$isAdmin = ($role['is_admin_role'] == 1) ? true : false;

		$select->distinct();
		$where = new Where();

		$where->equals('p.purchaseorder_status', "'forapproval'")
			->equals('a.approvetype_id', 1)
			->equals('a.approve_status', "'active'")
			->nest('OR')
			->isNull('a.wftarget_id')
			->in(
				Select::get()->from(array('wft'=>'WFRULETARGET'))
							->column('tablekey_id')
							->where("
								wft.wfruletarget_id = a.wftarget_id 
								AND wft.table_name = 'property'
							"),
				$propertyFilterSelect)
			->unnest();

		if ($isAdmin) {
			$where->nest('OR')
				->exists(Select::get()->from(array('pi'=>'poitem'))
									->column(new Expression('1'))
									->whereEquals('pi.purchaseorder_id', 'p.purchaseorder_id')
									->whereIn('pi.property_id', $propertyFilterSelect->toString()))
				->in('p.property_id', $propertyFilterSelect);
		} else {
			$where->nest('OR')
				->nest()
				->equals('a.forwardto_tablekeyid', $role['role_id'])
				->equals('a.forwardto_tablename', "'role'")
				->unnest()
				->nest()
				->in('a.forwardto_tablekeyid', $role['userprofilerole_id'])
				->equals('a.forwardto_tablename', "'userprofilerole'");
		}

		$select->join(new sql\join\PoApproveJoin())
				->where($where);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'purchaseorder_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findPosReleased($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
		
		$receiving = $this->configService->get('CP.RECEIVING_DEFAULT', '1');

		$select->whereEquals('p.purchaseorder_status', "'saved'")
			->whereNest('OR')
			->whereEquals('p.purchaseorder_rct_canReceive', 0)
			->whereIsNull('p.purchaseorder_rct_canReceive')
			->whereUnnest();

		if ($receiving === '1') {
			$select->whereEquals('p.purchaseorder_rct_req', 1);
		}

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'purchaseorder_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findPosByUser($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		if ($countOnly != 'true') {
			$select->columnRejectedBy()
					->columnRejectedDate();
		}

		$select->join(new sql\join\PoRecauthorJoin())
			->join(new \NP\property\sql\join\PropertyFiscalcalJoin())
			->join(new \NP\property\sql\join\FiscalcalFiscalcalMonthJoin())
			// Where
			->whereEquals('ra.userprofile_id', '?')
			->whereNotEquals('p.purchaseorder_status', "'draft'")
			->whereMerge(new sql\criteria\PoPeriodCriteria());

		$params = array($userprofile_id);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, $params, $pageSize, $page, 'purchaseorder_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select, $params);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	public function findPosRejected($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		if ($countOnly != 'true') {
			$select->columnRejectedBy()
					->columnRejectedDate();
		}

		$select->whereEquals('p.purchaseorder_status', "'rejected'");

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'purchaseorder_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	protected function getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort) {
		$select = new sql\PoSelect();
		
		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs')
					->column('purchaseorder_id');
		} else {
			$select->allColumns()
					->columnAmount()
					->columnPendingDays()
					->columnPendingApprovalDays()
					->columnCreatedBy()
					->columnLastApprovedBy()
					->columnLastApprovedDate()
					->columnSentToVendor()
					->order($sort);
		}

		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$select->join(new sql\join\PoPropertyJoin())
			->join(new sql\join\PoVendorsiteJoin())
			->join(new sql\join\PoPriorityFlagJoin())
			->join(new \NP\vendor\sql\join\VendorsiteVendorJoin())
			->whereIn('p.property_id', $propertyFilterSelect);

		return $select;
	}

	public function rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod) {
		$update = new Update();

		$newAccountingPeriod = \NP\util\Util::formatDateForDB($newAccountingPeriod);
		$oldAccountingPeriod = \NP\util\Util::formatDateForDB($oldAccountingPeriod);

		$update->table('purchaseorder')
				->values(array('purchaseorder_period'=>'?'))
				->whereEquals('purchaseorder_period', '?')
				->whereEquals('property_id', '?')
				->whereNotEquals('purchaseorder_status', '?');

		$params = array($newAccountingPeriod, $oldAccountingPeriod, $property_id, 'closed');

		$this->adapter->query($update, $params);
	}
}

?>