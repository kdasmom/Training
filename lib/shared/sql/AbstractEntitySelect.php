<?php

namespace NP\shared\sql;

use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * A custom Select object for Invoice, PO, and Receipt records with some shortcut methods
 *
 * @author Thomas Messier
 */
abstract class AbstractEntitySelect extends Select {
	
	// These properties need to be set in the concrete classes
	protected $tableName, $lineTableName;

	protected $tableAlias, $lineTableAlias;

	public function __construct() {
		parent::__construct();

		$this->tableAlias = strtolower(substr($this->tableName, 0, 1));
		$this->lineTableAlias = $this->tableAlias . 'i';

		$this->from(array($this->tableAlias => $this->tableName));
	}
	
	/**
	 * Adds the entity amount subquery as a column
	 *
	 * @param \NP\shared\AbstractEntitySelect Returns caller object for easy chaining
	 */
	public function columnAmount() {
		return $this->column(
						Select::get()->from(array($this->lineTableAlias => $this->lineTableName))
									->column(new Expression("SUM({$this->lineTableAlias}.{$this->lineTableName}_amount + {$this->lineTableAlias}.{$this->lineTableName}_shipping + {$this->lineTableAlias}.{$this->lineTableName}_salestax)"))
									->where("{$this->lineTableAlias}.{$this->tableName}_id = {$this->tableAlias}.{$this->tableName}_id"),
						'entity_amount'
		);
	}
	
	/**
	 * Adds the entity shipping total subquery as a column
	 *
	 * @param \NP\shared\AbstractEntitySelect Returns caller object for easy chaining
	 */
	public function columnShippingAmount() {
		return $this->column(
						Select::get()->from(array($this->lineTableAlias => $this->lineTableName))
									->column(new Expression("SUM({$this->lineTableAlias}.{$this->lineTableName}_shipping)"))
									->where("{$this->lineTableAlias}.{$this->tableName}_id = {$this->tableAlias}.{$this->tableName}_id"),
						'shipping_amount'
		);
	}
	
	/**
	 * Adds the entity tax total subquery as a column
	 *
	 * @param \NP\shared\AbstractEntitySelect Returns caller object for easy chaining
	 */
	public function columnTaxAmount() {
		return $this->column(
						Select::get()->from(array($this->lineTableAlias => $this->lineTableName))
									->column(new Expression("SUM({$this->lineTableAlias}.{$this->lineTableName}_salestax)"))
									->where("{$this->lineTableAlias}.{$this->tableName}_id = {$this->tableAlias}.{$this->tableName}_id"),
						'tax_amount'
		);
	}
	
	/**
	 * Adds the created by subquery as a column
	 *
	 * @param \NP\shared\AbstractEntitySelect Returns caller object for easy chaining
	 */
	public function columnCreatedBy() {
		return $this->column(
						Select::get()->from(array('ra'=>'recauthor'))
									->columns(array(new Expression("pe.person_firstname + ' ' + pe.person_lastname")))
									->join(new \NP\user\sql\join\RecauthorUserprofileJoin(array()))
									->join(new \NP\user\sql\join\UserUserroleJoin(array()))
									->join(new \NP\user\sql\join\UserroleStaffJoin(array()))
									->join(new \NP\user\sql\join\StaffPersonJoin(array()))
									->whereEquals('ra.tablekey_id', "{$this->tableAlias}.{$this->tableName}_id")
									->whereEquals('ra.table_name', "'{$this->tableName}'"),
						'created_by'
		);
	}
	
	/**
	 * Adds the pending approval days column
	 *
	 * @param \NP\shared\AbstractEntitySelect Returns caller object for easy chaining
	 */
	public function columnPendingApprovalDays() {
		$alias = '__a';

		return $this->column(
			Select::get()->column(new Expression("DateDiff(day,{$alias}.approve_datetm,getDate())"))
						->from(array($alias=>'approve'))
						->whereEquals("{$alias}.tablekey_id", "{$this->tableAlias}.{$this->tableName}_id")
						->whereEquals("{$alias}.table_name", "'{$this->tableName}'")
						->whereEquals(
							"{$alias}.approvetype_id",
							$this->getApproveTypeSubSelect('submitted')
						)
						->limit(1)
						->order("{$alias}.approve_id DESC"),
			'pending_approval_days'
		);
	}

	/**
	 * 
	 */
	public function columnPendingApprovalFor() {
		$alias = '__a';

		return $this->column(
			Select::get()->column(new Expression("
								CASE 
									WHEN forwardto_tablename = 'role' THEN (
										SELECT role_name FROM ROLE WHERE role_id = forwardto_tablekeyid
									) 
									ELSE (
										SELECT DISTINCT p.person_firstname + ' ' + p.person_lastname
										FROM USERPROFILE u
											INNER JOIN USERPROFILEROLE ur ON u.userprofile_id = ur.userprofile_id 
											INNER JOIN ROLE r ON ur.role_id = r.role_id
											INNER JOIN STAFF s ON ur.tablekey_id = s.staff_id
											INNER JOIN PERSON p ON s.person_id = p.person_id
										WHERE r.table_name = 'staff'
											AND ur.userprofilerole_id = forwardto_tablekeyid
									)
								END
						"))
						->from(array($alias=>'approve'))
						->whereEquals("{$alias}.tablekey_id", "{$this->tableAlias}.{$this->tableName}_id")
						->whereEquals("{$alias}.table_name", "'{$this->tableName}'")
						->whereEquals("{$alias}.approve_status", "'active'")
						->whereEquals(
							"{$alias}.approvetype_id",
							$this->getApproveTypeSubSelect('submitted')
						)
						->limit(1)
						->order("{$alias}.approve_id DESC"),
			'pending_approval_for'
		);
	}

	/**
	 * Adds the Last Approved Date column
	 *
	 * @param \NP\shared\AbstractEntitySelect Returns caller object for easy chaining
	 */
	public function columnLastApprovedDate() {
		return $this->column(
			$this->getApproveSelect('__a', '%approved%')->column('approve_datetm'),
			'last_approved_datetm'
		);
	}

	/**
	 * Adds the Last Approved By column
	 *
	 * @param \NP\shared\AbstractEntitySelect Returns caller object for easy chaining
	 */
	public function columnLastApprovedBy() {
		$alias = '__a';
		return $this->column(
			$this->getApproveSelect($alias, '%approved%')->columns(array())
													->join(new \NP\workflow\sql\join\ApproveUserJoin(
														array('userprofile_username'),
														Select::JOIN_INNER,
														'u',
														$alias
													)),
			'last_approved_by'
		);
	}

	/**
	 * Adds the Rejected Date column
	 *
	 * @param \NP\shared\AbstractEntitySelect Returns caller object for easy chaining
	 */
	public function columnRejectedDate() {
		return $this->column(
			$this->getApproveSelect('__a', 'rejected')->column('approve_datetm'),
			'rejected_datetm'
		);
	}

	/**
	 * Adds the Rejected By column
	 *
	 * @param \NP\shared\AbstractEntitySelect Returns caller object for easy chaining
	 */
	public function columnRejectedBy() {
		$alias = '__a';
		return $this->column(
			$this->getApproveSelect($alias, 'rejected')->columns(array())
													->join(new \NP\workflow\sql\join\ApproveUserJoin(
														array('userprofile_username'),
														Select::JOIN_INNER,
														'u',
														$alias
													)),
			'rejected_by'
		);
	}

	/**
	 * Adds the rejection reason subquery as a column
	 *
	 * @param \NP\shared\AbstractEntitySelect Returns caller object for easy chaining
	 */
	public function columnRejectedReason() {
		return $this->column(
			Select::get()->columns(array())
						->from(array('rh'=>'rejectionhistory'))
						->join(
							array('rn'=>'rejectionnote'),
							'rh.rejectionnote_id = rn.rejectionnote_id',
							array('rejectionnote_text')
						)
						->whereEquals("rh.tablekey_id", "{$this->tableAlias}.{$this->tableName}_id")
						->whereEquals("rh.table_name", "'{$this->tableName}'")
						->order('rh.rejectionhistory_id DESC')
						->limit(1),
			'rejected_reason'
		);
	}

	protected function getApproveSelect($alias, $approvetype_name) {
		if (strpos($approvetype_name, '%') !== false) {
			$whereFn = 'whereIn';
		} else {
			$whereFn = 'whereEquals';
		}

		return Select::get()->from(array($alias=>'approve'))
					->whereEquals("{$alias}.tablekey_id", "{$this->tableAlias}.{$this->tableName}_id")
					->whereEquals("{$alias}.table_name", "'{$this->tableName}'")
					->$whereFn(
						"{$alias}.approvetype_id",
						$this->getApproveTypeSubSelect($approvetype_name)
					)
					->limit(1)
					->order("{$alias}.approve_datetm DESC");
	}

	public function getApproveTypeSubSelect($approvetype_name) {
		if (strpos($approvetype_name, '%') !== false) {
			$whereFn = 'whereLike';
		} else {
			$whereFn = 'whereEquals';
		}

		return Select::get()->from('approvetype')
							->column('approvetype_id')
							->$whereFn('approvetype_name', "'{$approvetype_name}'");
	}
}