<?php

namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the APPROVEGLLOG table
 *
 * @author Thomas Messier
 */
class ApproveGlLogGateway extends AbstractGateway {
	
	/**
	 * Gets records for modified gl accounts for an approve record
	 */
	public function getModifiedGl($approve_id) {
		$select = Select::get()
					->from(['ag'=>'approvegllog'])
						->join(
							['g'=>'glaccount'],
							'ag.approvegllog_gl_from = g.glaccount_id',
							['from_glaccount_number'=>'glaccount_number','from_glaccount_name'=>'glaccount_name']
						)
						->join(
							['g2'=>'glaccount'],
							'ag.approvegllog_gl_to = g2.glaccount_id',
							['to_glaccount_number'=>'glaccount_number','to_glaccount_name'=>'glaccount_name']
						)
						->whereEquals('ag.approve_id', '?')
						->whereNotEquals('ag.approvegllog_gl_from', 'ag.approvegllog_gl_to');

		return $this->adapter->query($select, [$approve_id]);
	}

	/**
	 * Gets records for modified descriptions for an approve record
	 */
	public function getModifiedDesc($approve_id) {
		return $this->find(
			[
				['equals', 'approve_id', '?'],
				['notEquals', "ISNULL(approvegllog_desc_from, '')", "ISNULL(approvegllog_desc_to, '')"]
			],
			[$approve_id],
			'approvegllog_id'
		);
	}
}

?>