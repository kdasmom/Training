<?php

use Phinx\Migration\AbstractMigration;

class RemoveVendorestWfruleTypes extends AbstractMigration
{
	/**
	 * Migrate Up.
	 */
	public function up()
	{
		$selectWFRulesSQL = "SELECT wfrule_id FROM wfrule WHERE wfruletype_id IN (SELECT wfruletype_id FROM wfruletype WHERE wfruletype_tablename = 'vendorest')";

		// Remove all related records
		$this->execute("DELETE FROM wfaction WHERE wfrule_id IN ({$selectWFRulesSQL})");
		$this->execute("DELETE FROM wfrulehour WHERE wfrule_id IN ({$selectWFRulesSQL})");
		$this->execute("DELETE FROM wfrulerelation WHERE wfrule_id IN ({$selectWFRulesSQL})");
		$this->execute("DELETE FROM wfrulescope WHERE wfrule_id IN ({$selectWFRulesSQL})");
		$this->execute("DELETE FROM wfruletarget WHERE wfrule_id IN ({$selectWFRulesSQL})");
		// Remove wf rules
		$this->execute("DELETE FROM wfrule WHERE wfruletype_id IN (SELECT wfruletype_id FROM wfruletype WHERE wfruletype_tablename = 'vendorest')");
		// Remove wf rule types relating to Vendor Estimates
		$this->execute("DELETE FROM wfruletype WHERE wfruletype_tablename = 'vendorest'");
	}

	/**
	 * Migrate Down.
	 */
	public function down()
	{
		$recs = array(
			array(
				'wfruletype_name' => 'Vendor Estimate to Invoice Conversion Threshold (Percentage Variance) - Master Rule',
				'ordinal' => 17,
				'type_id_alt' => 17,
				'wfruletype_id' => 17
			),
			array(
				'wfruletype_name' => 'Vendor Estimate to Invoice Conversion Threshold (Total Dollar Amount) - Master Rule',
				'ordinal' => 18,
				'type_id_alt' => 18,
				'wfruletype_id' => 18
			),
			array(
				'wfruletype_name' => 'Vendor Estimate to Invoice Conversion Threshold (Dollar Variance) - Master Rule',
				'ordinal' => 19,
				'type_id_alt' => 19,
				'wfruletype_id' => 19
			)
		);
		foreach ($recs as $rec) {
			$this->execute("INSERT INTO wfruletype (wfruletype_name, wfruletype_tablename, wfruletype_fieldname, ismaster, ordinal, type_id_alt, wfruletype_id) VALUES ('{$rec['wfruletype_name']}', 'vendorest', 'vendorest_id', 1, {$rec['ordinal']}, {$rec['type_id_alt']}, {$rec['wfruletype_id']})");
		}
	}
}