<?php

namespace NP\invoice;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Expression;
use NP\core\db\Join;

/**
 * Gateway for the AUDITRECLASS table
 *
 * @author Thomas Messier
 */
class AuditReclassGateway extends AbstractGateway {
	protected $tableAlias = 'ar';

	protected $configService;
    
    public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

	public function findByInvoice($invoice_id) {
		$caseField  = "CASE\n";
		$caseOldVal = "CASE\n";
		$caseNewVal = "CASE\n";
		$joins      = [];

		foreach([true,false] as $isLine) {
			$fields = ($isLine) ? InvoiceItemEntity::getAuditableFields() : InvoiceEntity::getAuditableFields();
			$auditData = $this->getAuditFieldData($fields, $isLine);

			$caseField  .= $auditData['caseField'];
			$caseOldVal .= $auditData['caseOldVal'];
			$caseNewVal .= $auditData['caseNewVal'];
			$joins      = array_merge($joins, $auditData['joins']);
		}

		$caseField .= 'ELSE ar.field
				END';

		$caseOldVal .= 'ELSE ar.old_val
				END';

		$caseNewVal .= 'ELSE ar.new_val
				END';

		$select = $this->getSelect()
					->columns(['auditreclass_date','audit_note'])
					->column(new Expression($caseField), 'field_display')
					->column(new Expression($caseOldVal), 'old_val')
					->column(new Expression($caseNewVal), 'new_val')
					->join(new sql\join\AuditReclassUserJoin())
					->join(new sql\join\AuditReclassDelegationUserJoin())
					->whereEquals('ar.invoice_id', '?')
					->order('ar.auditreclass_date');
		
		foreach ($joins as $alias=>$join) {
			$select->join(
				[$alias=>$join['table']],
				$join['condition'],
				[],
				Select::JOIN_LEFT
			);
		}

		return $this->adapter->query($select, [$invoice_id]);
	}

	/**
	 * 
	 */
	private function getAuditFieldData($fields, $isLine=false) {
		$caseField    = '';
		$caseOldVal   = '';
		$caseNewVal   = '';
		$joins        = [];

		foreach ($fields as $field=>$fieldDef) {
			$suffix = ($isLine) ? 'NOT NULL' : 'NULL';
			$suffix = "ar.invoiceitem_id IS {$suffix}";

			$fieldLabel = null;
			if (array_key_exists('displayName', $fieldDef)) {
				$fieldLabel = $fieldDef['displayName'];
			} else if (array_key_exists('displayNameSetting', $fieldDef)) {
				$fieldLabel = $this->configService->get($fieldDef['displayNameSetting']);
			}

			if ($fieldLabel !== null) {
				$fieldLabel = str_replace("'", "''", $fieldLabel);
				$caseField .= "WHEN ar.field = '{$field}' AND $suffix THEN '{$fieldLabel}'\n";
			}
			if (array_key_exists('table', $fieldDef)) {
				$table = $fieldDef['table'];
				
				$pk = $field;
				if (array_key_exists('pk', $fieldDef)) {
					$pk = $fieldDef['pk'];
				}
				
				$alias = "_{$table}";

				$joins[$alias] = [
					'table'     => $table,
					'condition' => "ar.old_val = CAST($alias.$pk AS varchar) AND ar.field = '{$field}'"
				];

				$caseOldVal .= "WHEN ar.field = '{$field}' THEN $alias.{$fieldDef['displayField']}\n";

				$alias = "_{$table}2";
				
				$joins[$alias] = [
					'table'     => $table,
					'condition' => "ar.new_val = CAST($alias.$pk AS varchar) AND ar.field = '{$field}'"
				];

				$caseNewVal .= "WHEN ar.field = '{$field}' THEN $alias.{$fieldDef['displayField']}\n";
			}
		}

		return [
			'caseField'  => $caseField,
			'caseOldVal' => $caseOldVal,
			'caseNewVal' => $caseNewVal,
			'joins'      => $joins
		];
	}

}

?>