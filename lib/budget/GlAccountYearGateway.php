<?php

namespace NP\budget;

use NP\core\AbstractGateway;
use NP\core\db\Update;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Expression;

/**
 * Gateway for the GLACCOUNTYEAR table
 *
 * @author Thomas Messier
 */
class GlAccountYearGateway extends AbstractGateway {

	public function createMissingGlAccountYears($entityType, $entity_id=null) {
		if ($entityType == 'po') {
			$itemTable = 'poitem';
			$entityTable = 'purchaseorder';
		} else if ($entityType == 'invoice') {
			$itemTable = 'invoiceitem';
			$entityTable = 'invoice';
		} else {
			throw new \NP\core\Exception("Invalid value '{$entityType}' for the \$entityType argument. Valid values are 'po' and 'invoice'");
		}

		$insert = new Insert();
		$select = Select::get()
			->distinct()
			->columns(array(
				'glaccount_id',
				'property_id',
				new Expression("YEAR(e.{$entityTable}_period)"),
				new Expression('0'),
				new Expression("
					CASE
						WHEN YEAR(e.{$entityTable}_period) = YEAR(getDate()) THEN 'active'
						ELSE 'inactive'
					END
				"),
				new Expression('0'),
			))
			->from(array('i'=>$itemTable))
			->join(array('e'=>$entityTable),
					"i.{$entityTable}_id = e.{$entityTable}_id",
					array())
			->whereIsNotNull('i.property_id')
			->whereIsNotNull('i.glaccount_id')
			->whereIsNotNull("e.{$entityTable}_period")
			->whereNotExists(
				Select::get()->from(array('gy'=>'glaccountyear'))
							->whereEquals('gy.glaccountyear_year', "YEAR(e.{$entityTable}_period)")
							->whereEquals('gy.property_id', 'i.property_id')
							->whereEquals('gy.glaccount_id', 'i.glaccount_id')
			);

		$params = [];
		if (!empty($entity_id)) {
			$params[] = $entity_id;
		}

		$insert->into('glaccountyear')
				->columns(array(
					'glaccount_id',
					'property_id',
					'glaccountyear_year',
					'glaccountyear_amount',
					'glaccountyear_status',
					'glaccountyear_totalallocated'
				))
				->values($select);

		$this->adapter->query($insert, $params);
	}

	public function activateYear($property_id, $glaccountyear_year) {
		$update = new Update();
		$update->table('glaccountyear')
				->values(array('glaccountyear_status'=>"'inactive'"))
				->whereNotEquals('glaccountyear_year', '?')
				->whereEquals('property_id', '?');

		$this->adapter->query($update, array($property_id, $glaccountyear_year));

		$update = new Update();
		$update->table('glaccountyear')
				->values(array('glaccountyear_status'=>"'active'"))
				->whereEquals('glaccountyear_year', '?')
				->whereEquals('property_id', '?');
		
		$this->adapter->query($update, array($property_id, $glaccountyear_year));
	}

}

?>