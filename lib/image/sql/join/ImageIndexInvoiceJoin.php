<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_INDEX to INVOICE table
 *
 * @author Thomas Messier
 */
class ImageIndexInvoiceJoin extends Join {
	
	public function __construct($cols=array('invoice_id','invoice_ref','invoice_duedate','invoice_NeededBy_datetm'), $type=Select::JOIN_INNER, $toAlias='i', $fromAlias='img') {
		$this->setTable(array($toAlias=>'invoice'))
			->setCondition("{$fromAlias}.Tablekey_Id = {$toAlias}.invoice_id AND img.tableref_id IN (SELECT image_tableref_id FROM image_tableref WHERE image_tableref_name IN ('Invoice','Utility Invoice'))")
			->setCols($cols)
			->setType($type);
	}
	
}