<?php

namespace NP\shared\sql;

use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * A custom Select object for Invoice, PO, and receipt records with some shortcut methods
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
	 * Adds the po amount subquery as a column
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
	 * Adds the created by subquery as a column
	 *
	 * @param \NP\shared\AbstractEntitySelect Returns caller object for easy chaining
	 */
	public function columnCreatedBy() {
		return $this->column(
						Select::get()->from(array('ra'=>'recauthor'))
									->columns(array())
									->join(new \NP\user\sql\join\RecauthorUserprofileJoin())
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
			new Expression('DateDiff(day, (' . 
								Select::get()->column('approve_datetm')
											->from(array($alias=>'approve'))
											->whereEquals("{$alias}.tablekey_id", "{$this->tableAlias}.{$this->tableName}_id")
											->whereEquals("{$alias}.table_name", "'{$this->tableName}'")
											->whereEquals("{$alias}.approve_status", "'active'")
											->whereEquals(
												"{$alias}.approvetype_id",
												$this->getApproveTypeSubSelect('submitted')
											)
											->limit(1)
											->order("{$alias}.approve_datetm ASC")
											->toString() .
							'), getDate())'),
			'pending_approval_days'
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

	protected function getApproveSelect($alias, $approvetype_name) {
		if (strpos($approvetype_name, '%')) {
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

	protected function getApproveTypeSubSelect($approvetype_name) {
		if (strpos($approvetype_name, '%')) {
			$whereFn = 'whereLike';
		} else {
			$whereFn = 'whereEquals';
		}

		return Select::get()->from('approvetype')
							->column('approvetype_id')
							->$whereFn('approvetype_name', "'{$approvetype_name}'")
							->limit(1);
	}
}