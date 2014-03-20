<?php

namespace NP\system\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INTEGRATIONPACKAGE to INTEGRATIONREQUIREMENTS table
 *
 * @author Thomas Messier
 */
class IntPkgIntReqJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='ipkt', $fromAlias='ipk') {
		if ($cols === null) {
			$cols = [
				'invoice_ref_max',
				'vendor_name_max',
				'vendor_new_DefaultGLCodeOnly',
				'lineitem_description_max',
				'receipt_notes_max',
				'insurance_policynumber_max',
				'vendor_code_max',
				'custom_field7_maxlength',
				'custom_field8_maxlength',
				'receipt_customnotes_max',
				'vendor_city_max',
				'custom_field7_lineitem_maxlength',
				'custom_field8_lineitem_maxlength',
				'vendor_address1_max'
			];
		}
		$this->setTable(array($toAlias=>'integrationrequirements'))
			->setCondition("{$fromAlias}.integration_package_id = {$toAlias}.integration_package_id")
			->setCols($cols)
			->setType($type);
	}
	
}