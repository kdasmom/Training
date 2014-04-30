<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\db\Delete;
use NP\core\db\Expression;
use NP\core\db\Insert;
use NP\core\db\Select;

/**
 * Gateway for the FISCALCALMONTH table
 *
 * @author Thomas Messier
 */
class FiscalCalMonthGateway extends AbstractGateway {
	public function deleteMonths($deleted_id = []) {
		if (count($deleted_id) > 0){
			$delete = new Delete();

			$delete->from('fiscalcalmonth')
				->whereIn('fiscalcalmonth_id', implode(',', $deleted_id));

			return $this->adapter->query($delete);
		}

		return true;
	}

	public function saveFromSelect($fiscalcal_id, $out_fiscalcal_id) {
		$select = new Select();
		$selectNotExists = new Select();

		$selectNotExists->from(['fm2' => 'fiscalcalmonth'])
					->where([
						'fiscalcal_id'			=> '?',
						'fiscalcalmonth_num'	=> 'fm1.fiscalcalmonth_num'
					]);

		$select->from(['fm1' => 'fiscalcalmonth'])
				->columns([new Expression($out_fiscalcal_id), 'fiscalcalmonth_num', 'fiscalcalmonth_cutoff'])
				->where(['fiscalcal_id' => '?'])
				->whereNotExists($selectNotExists);

		$insert = new Insert();
		$insert->into('fiscalcalmonth')
			->columns(['fiscalcal_id', 'fiscalcalmonth_num', 'fiscalcalmonth_cutoff'])
			->values($select);

		return $this->adapter->query($insert, [$fiscalcal_id, $out_fiscalcal_id]);
	}
}

?>