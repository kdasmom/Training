<?php

namespace NP\system\sql;

use NP\system\ConfigService;
use NP\core\db\Select;
use NP\core\db\Expression;

/**
 * A custom Select object for AUDITLOG records with some shortcut methods
 *
 * @author Thomas Messier
 */
class AuditSelect extends Select {
	
	public function __construct(ConfigService $configService) {
		parent::__construct();

		$this->configService = $configService;

		$this->from(['al'=>'auditlog']);
	}

	/**
	 * Returns a Select object for getting deleted image entries for the history log
	 */
	public function addImageDeletedSpecification() {
		return $this->addImageSpecification('deleted');
	}

	/**
	 * Returns a Select object for getting scanned image entries for the history log
	 */
	public function addImageScannedSpecification() {
		return $this->addImageSpecification('scanned');
	}

	/**
	 * Returns a Select object for getting indexed image entries for the history log
	 */
	public function addImageIndexedSpecification() {
		return $this->addImageSpecification('indexed');
	}

	/**
	 * Returns a Select object for getting added image entries for the history log
	 */
	public function addImageAddedSpecification() {
		return $this->addImageSpecification('added');
	}

	protected function addImageSpecification($type) {
		$nullExp              = new Expression('NULL');
		$approvetype_name     = 'Image ' . ucfirst($type);
		$msg                  = 'Image was ' . $type;
		$transaction_id       = $nullExp;
		$userprofile_username = 'u.userprofile_username';

		switch ($type) {
			case 'deleted':
				$auditactivity = 'ImgDel';
				break;
			case 'scanned':
				$approvetype_name     = 'Uploaded';
				$auditactivity        = 'ImgUploaded';
				$userprofile_username = 'al.field_name';
				break;
			case 'indexed':
				$auditactivity  = 'ImgIndex';
				$transaction_id = new Expression('1');
				break;
			case 'added':
				$auditactivity  = 'ImgAdded';
				$transaction_id = new Expression('3');
				break;
		}

		return $this->columns([
						'approve_id'           => new Expression('-1'),
						'approve_datetm'       => 'DTS',
						'approvetype_name'     => new Expression("'{$approvetype_name}'"),
						'message'              => $this->getMessageCol($msg),
						'userprofile_username' => new Expression($userprofile_username),
						'forwardto_tablename'  => $nullExp,
						'forwardto_tablekeyid' => $nullExp,
						'glaccount_number'     => $nullExp,
						'approver'             => $nullExp,
						'transaction_id'       => $transaction_id
					])
					->join(new join\AuditLogAuditActivityJoin([]))
					->join(new join\AuditLogAuditTypeJoin([]))
					->join(new join\AuditLogUserJoin([]))
					->join(new join\AuditLogDelegationUserJoin([]))
					->whereEquals('at.audittype', '?')
					->whereEquals('al.tablekey_id', '?')
					->whereEquals('aa.auditactivity', "'{$auditactivity}'");
	}
	
	protected function getMessageCol($msg, $alias='al', $userIdField='userprofile_id',
										$delegUserIdField='delegation_to_userprofile_id') {
		$oldValue = ($alias == 'al') ? " (' + ISNULL(al.field_old_value, '') + ')" : "";

		return new Expression("
			'{$msg}{$oldValue}' +
			CASE
				WHEN {$alias}.{$userIdField} <> ISNULL({$alias}.{$delegUserIdField}, 0) 
					AND {$alias}.{$userIdField} IS NOT NULL 
					AND {$alias}.{$delegUserIdField} IS NOT NULL THEN
						' (done by ' + ud.userprofile_username + ' on behalf of ' + u.userprofile_username + ')'
				ELSE ''
			END
		");
	}

	/**
	 * 
	 */
	public function addSplitAuditSpecification() {
		$nullExp = new Expression('NULL');
		$cfData = $this->configService->getInvoicePoCustomFields();
		$cfData = $cfData['line']['fields'];
		$unitTerm = $this->configService->get('PN.InvoiceOptions.UnitAttachDisplay', 'Unit');

		return $this->columns([
						'approve_id'           => new Expression('-1'),
						'approve_datetm'       => 'DTS',
						'approvetype_name'     => new Expression("
							CASE
								WHEN aa.auditactivity IN ('SplitCreate','SplitChange') THEN 'Split'
								WHEN aa.auditactivity IN ('EditSplitCreate','EditSplitChange') THEN 'Split Edit'
							END
						"),
						'message'              => new Expression("
							CASE
								WHEN aa.auditactivity IN ('SplitCreate','EditSplitCreate') THEN 'Line item created with '
								WHEN aa.auditactivity IN ('SplitChange','EditSplitChange') THEN 'Line item edited - '
							END + 
							CASE
								WHEN al.field_name IN ('invoiceitem_amount','poitem_amount') THEN 'Item Amount'
								WHEN al.field_name IN ('invoiceitem_unitprice','poitem_unitprice') THEN 'Item Unit Price'
								WHEN al.field_name IN ('invoiceitem_quantity','poitem_quantity') THEN 'Item Quantity'
								WHEN al.field_name IN ('invoiceitem_description','poitem_description') THEN 'Item Description'
								WHEN al.field_name = 'glaccount_id' THEN 'GL Account'
								WHEN al.field_name = 'property_id' THEN 'Line Item Property'
								WHEN al.field_name = 'universal_field1' THEN '".str_replace("'", "''", $cfData[1]['label'])."'
								WHEN al.field_name = 'universal_field2' THEN '".str_replace("'", "''", $cfData[2]['label'])."'
								WHEN al.field_name = 'universal_field3' THEN '".str_replace("'", "''", $cfData[3]['label'])."'
								WHEN al.field_name = 'universal_field4' THEN '".str_replace("'", "''", $cfData[4]['label'])."'
								WHEN al.field_name = 'universal_field5' THEN '".str_replace("'", "''", $cfData[5]['label'])."'
								WHEN al.field_name = 'universal_field6' THEN '".str_replace("'", "''", $cfData[6]['label'])."'
								WHEN al.field_name = 'universal_field7' THEN '".str_replace("'", "''", $cfData[7]['label'])."'
								WHEN al.field_name = 'universal_field8' THEN '".str_replace("'", "''", $cfData[8]['label'])."'
								WHEN al.field_name = 'unit_id' THEN '".str_replace("'", "''", $unitTerm)."'
								ELSE al.field_name
							END + 
							CASE
								WHEN aa.auditactivity IN ('SplitChange','EditSplitChange') THEN ' changed from ' + CASE WHEN al.field_old_value IS NULL OR al.field_old_value = '' THEN '\"blank\"' ELSE '\"' + al.field_old_value + '\"' END + ' to ' + CASE WHEN al.field_new_value IS NULL OR al.field_new_value = '' THEN '\"blank\"' ELSE '\"' + al.field_new_value + '\"' END
								WHEN aa.auditactivity IN ('SplitCreate','EditSplitCreate') THEN ' of ' + al.field_new_value
							END +
							CASE
								WHEN al.userprofile_id <> ISNULL(al.delegation_to_userprofile_id, 0) 
									AND al.userprofile_id IS NOT NULL 
									AND al.delegation_to_userprofile_id IS NOT NULL THEN
										' (done by ' + ud.userprofile_username + ' on behalf of ' + u.userprofile_username + ')'
								ELSE ''
							END
						"),
						'userprofile_username' => new Expression('u.userprofile_username'),
						'forwardto_tablename'  => $nullExp,
						'forwardto_tablekeyid' => $nullExp,
						'glaccount_number'     => $nullExp,
						'approver'             => $nullExp,
						'transaction_id'       => $nullExp
					])
					->join(new join\AuditLogAuditActivityJoin([]))
					->join(new join\AuditLogAuditTypeJoin([]))
					->join(new join\AuditLogUserJoin([]))
					->join(new join\AuditLogDelegationUserJoin([]))
					->whereEquals('at.audittype', '?')
					->whereEquals('al.tablekey_id', '?')
					->whereIn('aa.auditactivity', "'SplitCreate','SplitChange','EditSplitCreate','EditSplitChange'")
					->whereNotEquals(
						new Expression("ISNULL(al.field_new_value, '')"),
						new Expression("ISNULL(al.field_old_value, '')")
					);
	}

	/**
	 * 
	 */
	public function addInvoiceCreatedSpecification() {
		$nullExp = new Expression('NULL');

		return $this->columns([
						'approve_id'           => new Expression('-1'),
						'approve_datetm'       => 'invoice_createddatetm',
						'approvetype_name'     => new Expression("'Created'"),
						'message'              => $this->getMessageCol('Invoice was created', 'ra'),
						'userprofile_username' => new Expression('u.userprofile_username'),
						'forwardto_tablename'  => $nullExp,
						'forwardto_tablekeyid' => $nullExp,
						'glaccount_number'     => $nullExp,
						'approver'             => $nullExp,
						'transaction_id'       => new Expression('2')
					])
					->from(['i'=>'invoice'])
					->join(new \NP\invoice\sql\join\InvoiceRecauthorJoin([]))
					->join(new \NP\user\sql\join\RecauthorUserprofileJoin([]))
					->join(new \NP\user\sql\join\RecauthorDelegationUserJoin([]))
					->whereEquals('i.invoice_id', '?');
	}

	/**
	 * 
	 */
	public function addInvoiceActivatedSpecification() {
		$nullExp = new Expression('NULL');

		return $this->columns([
						'approve_id'           => new Expression('-1'),
						'approve_datetm'       => 'invoicehold_activate_datetm',
						'approvetype_name'     => new Expression("'Activated'"),
						'message'              => $this->getMessageCol(
							'Activated On Hold Invoice',
							'ih',
							'activate_userprofile_id',
							'activate_delegation_to_userprofile_id'
						),
						'userprofile_username' => new Expression('u.userprofile_username'),
						'forwardto_tablename'  => $nullExp,
						'forwardto_tablekeyid' => $nullExp,
						'glaccount_number'     => $nullExp,
						'approver'             => $nullExp,
						'transaction_id'       => $nullExp
					])
					->from(['ih'=>'invoicehold'])
					->join(new \NP\invoice\sql\join\InvoiceRecauthorJoin([], Select::JOIN_LEFT, 'ra', 'ih'))
					->join(new \NP\user\sql\join\RecauthorUserprofileJoin([]))
					->join(new \NP\user\sql\join\RecauthorDelegationUserJoin([]))
					->whereEquals('ih.invoice_id', '?')
					->whereEquals('ih.invoicehold_active', '0');
	}

	/**
	 * 
	 */
	public function addVendorConnectSpecification() {
		$nullExp = new Expression('NULL');

		return $this->columns([
						'approve_id'           => new Expression('-1'),
						'approve_datetm'       => Select::get()->column('delivered_datetm')
																->from('vendoraccessinvoice')
																->whereEquals('pn_invoice_id', 'al.tablekey_id')
						,
						'approvetype_name'     => new Expression("'Received'"),
						'message'              => new Expression("'Invoice received from VendorConnect'"),
						'userprofile_username' => new Expression('u.userprofile_username'),
						'forwardto_tablename'  => $nullExp,
						'forwardto_tablekeyid' => $nullExp,
						'glaccount_number'     => $nullExp,
						'approver'             => $nullExp,
						'transaction_id'       => $nullExp
					])
					->join(new join\AuditLogAuditActivityJoin([]))
					->join(new join\AuditLogAuditTypeJoin([]))
					->join(new join\AuditLogUserJoin([]))
					->whereEquals('at.audittype', '?')
					->whereEquals('al.tablekey_id', '?')
					->whereEquals('aa.auditactivity', "'InvReceived'");
	}

	public function addInvoiceAuditSpecification() {
		$fields     = \NP\invoice\InvoiceEntity::getAuditableFields();

		$message = $this->getAuditMessageCol($fields);

		return $this->addBaseAuditSelect($message)
					->whereEquals('al.tablekey_id', '?')
					->whereEquals('at.audittype', "'Invoice'");
	}

	public function addInvoiceItemAuditSpecification() {
		$fields  = \NP\invoice\InvoiceItemEntity::getAuditableFields();
		$fields  = array_merge($fields, \NP\jobcosting\JbJobAssociationEntity::getAuditableFields());

		$message = $this->getAuditMessageCol($fields);

		return $this->addBaseAuditSelect($message)
					->whereEquals('at.audittype', "'InvoiceItem'")
					->whereIn(
						'al.tablekey_id',
						Select::get()->column('invoiceitem_id')
									->from('invoiceitem')
									->whereEquals('invoice_id', '?')
					);
	}

	private function addBaseAuditSelect($message) {
		$nullExp = new Expression('NULL');

		return $this->columns([
					'approve_id'           => new Expression('-1'),
					'approve_datetm'       => 'DTS',
					'approvetype_name'     => new Expression("'Edit'"),
					'message'              => new Expression($message),
					'userprofile_username' => new Expression('u.userprofile_username'),
					'forwardto_tablename'  => $nullExp,
					'forwardto_tablekeyid' => $nullExp,
					'glaccount_number'     => $nullExp,
					'approver'             => $nullExp,
					'transaction_id'       => $nullExp
				])
				->join(new join\AuditLogAuditActivityJoin([]))
				->join(new join\AuditLogAuditTypeJoin([]))
				->join(new join\AuditLogUserJoin([]))
				->join(new join\AuditLogDelegationUserJoin([]))
				->whereEquals('aa.auditactivity', "'Modified'")
				->whereNotEquals(
					new Expression("ISNULL(al.field_new_value, '')"),
					new Expression("ISNULL(al.field_old_value, '')")
				);
	}

	private function getAuditMessageCol($fields) {
		$messageField = 'CASE';

		foreach ($fields as $key=>$field) {
			$displayName = (array_key_exists('displayName', $field)) ? $field['displayName'] : $key;
			$messageField .= " WHEN al.field_name = '{$key}' THEN '{$displayName}'";
		}

		$messageField .= "
				ELSE al.field_name
			END + ' changed from ' + 
			CASE 
				WHEN al.field_old_value IS NULL OR al.field_old_value = '' THEN '\"blank\"' 
				ELSE '\"' + al.field_old_value + '\"' 
			END + ' to ' + 
			CASE 
				WHEN al.field_new_value IS NULL OR al.field_new_value = '' 
				THEN '\"blank\"' ELSE '\"' + al.field_new_value + '\"' 
			END +
			CASE
				WHEN al.userprofile_id <> ISNULL(al.delegation_to_userprofile_id, 0) 
					AND al.userprofile_id IS NOT NULL 
					AND al.delegation_to_userprofile_id IS NOT NULL THEN
						' (done by ' + ud.userprofile_username + ' on behalf of ' + u.userprofile_username + ')'			
				ELSE ''
			END
		";

		return $messageField;
	}

}

?>