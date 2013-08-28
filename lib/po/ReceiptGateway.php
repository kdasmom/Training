<?php

namespace NP\po;

use NP\core\AbstractGateway;

use NP\property\PropertyContext;
use NP\property\sql\PropertyFilterSelect;
use NP\user\RoleGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * Gateway for the RECEIPT table
 *
 * @author Thomas Messier
 */
class ReceiptGateway extends AbstractGateway {

	protected $roleGateway, $configService;

	public function __construct(Adapter $adapter, RoleGateway $roleGateway) {
		$this->roleGateway = $roleGateway;
		
		parent::__construct($adapter);
	}

	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

	public function findReceiptsToApprove($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$role = $this->roleGateway->findByUser($userprofile_id);
		$isAdmin = ($role['is_admin_role'] == 1) ? true : false;

		$select->distinct()
				->join(new sql\join\ReceiptApproveJoin());
		
		$where = Where::get()->equals('r.receipt_status', "'forapproval'")
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
				->exists(Select::get()->from(array('ri'=>'rctitem'))
									->column(new Expression('1'))
									->whereEquals('ri.receipt_id', 'r.receipt_id')
									->whereIn('ri.property_id', $propertyFilterSelect->toString()))
				->in('r.property_id', $propertyFilterSelect);
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

		$allowPoApprover = $this->configService->get('CP.RECEIVING_ALLOW_POAPPROVER', '1');

		$params = array();
		if ($allowPoApprover != '1') {
			$where->equals(
				Select::get()->column('userprofile_id')
							->from(array('a'=>'approve'))
							->whereEquals('a.table_name', "'purchaseorder'")
							->whereEquals('a.tablekey_id', 'r.purchaseorder_id')
							->whereEquals('a.approve_status', "'active'")
							->whereEquals(
								'a.approvetype_id',
								Select::get()->column('approvetype_id')
											->from('approvetype')
											->whereEquals('approvetype_name', "'approved'")
											->limit(1)
							)
							->order('a.approve_datetm DESC')
							->limit(1),
				'?'
			);
			$params[] = $delegated_to_userprofile_id;
		}

		$select->where($where);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, $params, $pageSize, $page, 'receipt_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select, $params);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	public function findReceiptsRejected($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		if ($countOnly != 'true') {
			$select->columnRejectedBy()
					->columnRejectedDate();
		}

		$select->whereEquals('r.receipt_status', "'rejected'")
			->whereExists(
				Select::get()->from(array('a'=>'approve'))
							->join(
								array('upr'=>'userprofilerole'),
								'upr.userprofilerole_id = a.forwardto_tablekeyid',
								array(),
								Select::JOIN_LEFT
							)
							->whereEquals('a.tablekey_id', 'r.receipt_id')
							->whereEquals('a.table_name', "'receipt'")
							->whereEquals('a.approvetype_id', 3)
							->whereNest('OR')
							->whereEquals('r.userprofile_id', '?')
							->whereEquals('upr.userprofile_id', '?')
							->whereUnnest()
			);

		$params = array($userprofile_id,$userprofile_id);
		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, $params, $pageSize, $page, 'receipt_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select, $params);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	public function findReceiptsPendingPost($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$select->whereEquals('r.receipt_status', "'forpostapproval'");

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'receipt_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	protected function getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort) {
		$select = new sql\ReceiptSelect();
		
		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs')
					->column('receipt_id');
		} else {
			$select->columns(array(
								'receipt_id',
								'purchaseorder_id',
								'property_id',
								'vendor_id',
								'userprofile_id',
								'receipt_createdt',
								'receipt_approvedt',
								'receipt_lastupdatedt',
								'receipt_ref',
								'receipt_status',
								'receipt_period',
								'receipt_receivedondt',
								'transfer_dt'
							))
					->columnAmount()
					->columnPendingDays()
					->columnPendingApprovalDays()
					->columnCreatedBy()
					->columnLastApprovedBy()
					->columnLastApprovedDate()
					->order($sort);
		}

		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$select->join(new sql\join\ReceiptPropertyJoin())
			->join(new sql\join\ReceiptVendorJoin())
			->whereIn('r.property_id', $propertyFilterSelect);

		return $select;
	}
}

?>