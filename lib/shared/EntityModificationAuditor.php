<?php

namespace NP\shared;

use NP\core\GatewayManager;
use NP\system\ConfigService;

/**
 * Abstract class for auditing an entity
 *
 * @author Thomas Messier
 */
class EntityModificationAuditor extends AbstractEntityAuditor {
	protected $gatewayManager, $auditType, $pk;

	public function __construct(ConfigService $configService, GatewayManager $gatewayManager, $auditType, $userprofile_id, $delegation_to_userprofile_id) {
		$this->configService                = $configService;
		$this->gatewayManager               = $gatewayManager;
		$this->auditType                    = $auditType;
		$this->userprofile_id               = $userprofile_id;
		$this->delegation_to_userprofile_id = $delegation_to_userprofile_id;
	}

	public function audit(\NP\core\AbstractEntity $newEntity, \NP\core\AbstractEntity $oldEntity) {
		$fields = $newEntity->getFields();
		reset($fields);
		$this->pk = key($fields);

		parent::audit($newEntity, $oldEntity);
	}

	protected function auditField($newVal, $oldVal, $field, $fieldDef) {
		// Deal with the special case of vendor field
		if ($field == 'paytablekey_id' || $field == 'vendorsite_id') {
			if (!empty($oldVal)) {
				$oldVal = $this->gatewayManager->get('VendorGateway')->findValue(
					['vs.vendorsite_id'=>'?'],
					[$oldVal],
					'vendor_name'
				);
			}

			if (!empty($newVal)) {
				$newVal = $this->gatewayManager->get('vendor')->findValue(
					['vs.vendorsite_id'=>'?'],
					[$newVal],
					'vendor_name'
				);
			}
		} else if (array_key_exists('table', $fieldDef)) {
			$gtw   = ucfirst($fieldDef['table'] . 'Gateway');
			$gtw   = $this->gatewayManager->get($gtw);
			$key   = $gtw->getPk();
			$alias = $gtw->getTableAlias();
			if (array_key_exists('key', $fieldDef)) {
				$key = $fieldDef['key'];
			}

			if (!empty($oldVal)) {
				$oldVal = $gtw->findValue(
					["{$alias}.{$key}"=>'?'],
					[$oldVal],
					$fieldDef['displayField']
				);
			}

			if (!empty($newVal)) {
				$newVal = $gtw->findValue(
					["{$alias}.{$key}"=>'?'],
					[$newVal],
					$fieldDef['displayField']
				);
			}
		}

		if (array_key_exists('displayNameSetting', $fieldDef)) {
			$newFieldName = $this->configService->get($fieldDef['displayNameSetting'], '');
			if (!empty($newFieldName)) {
				$field = $newFieldName;
			}
		}

		if (array_key_exists('convert', $fieldDef)) {
			$fn = $fieldDef['convert'];
			if ($fn == 'currency') {
				$symbol = $this->configService->get('PN.Intl.currencySymbol', '$');

				if (!empty($newVal)) {
					$newVal = $symbol . number_format($newVal, 2);
				}
				if (!empty($oldVal)) {
					$oldVal = $symbol . number_format($oldVal, 2);
				}
			} else {
				$newVal = $this->newEntity->$fn($newVal);
				$oldVal = $this->oldEntity->$fn($oldVal);
			}
		} else if (array_key_exists('date', $fieldDef)) {
			if (array_key_exists('format', $fieldDef['date'])) {
				$format = $fieldDef['date']['format'];
			} else {
				$format = \NP\util\Util::getServerDateFormat();
			}
			$toFormat = $this->configService->get('PN.Intl.DateFormat', 'm/d/Y');

			if (!empty($newVal)) {
				$newVal = \DateTime::createFromFormat($format, $newVal)->format($toFormat);
			}

			if (!empty($oldVal)) {
				$oldVal = \DateTime::createFromFormat($format, $oldVal)->format($toFormat);
			}
		}

		if (is_numeric($oldVal)) {
			$oldVal = strval($oldVal);
		}

		if (is_numeric($newVal)) {
			$newVal = strval($newVal);
		}

		$audittype_id     = $this->gatewayManager->get('AudittypeGateway')->findIdByType($this->auditType);
		$auditactivity_id = $this->gatewayManager->get('AuditactivityGateway')->findIdByType('modified');
		$pk = $this->pk;

		$this->gatewayManager->get('AuditlogGateway')->insert([
			'field_name'                   => $field,
			'field_new_value'              => $newVal,
			'field_old_value'              => $oldVal,
			'tablekey_id'                  => $this->newEntity->$pk,
			'userprofile_id'               => $this->userprofile_id,
			'delegation_to_userprofile_id' => $this->delegation_to_userprofile_id,
			'audittype_id'                 => $audittype_id,
			'auditactivity_id'             => $auditactivity_id
		]);
	}
}

?>