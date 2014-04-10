<?php

namespace NP\jobcosting;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the JBCHANGEORDER table
 *
 * @author Thomas Messier
 */
class JbChangeOrderGateway extends AbstractGateway {

	/**
	 * Find change orders using a series of common filter option
	 */
	public function findByContract($jbcontract_id=null, $keyword=null, $sort='jbchangeorder_name') {
		$select = $this->getSelect()->from(['jbco'=>'jbchangeorder'])
									->whereExists(
										Select::get()->from(['jbcoc'=>'JbContract_ChangeOrder'])
													->whereEquals('jbcoc.jbchangeorder_id', 'jbco.jbchangeorder_id')
													->whereEquals('jbcoc.jbcontract_id', '?')
									)
									->order($sort);

		$params = [$jbcontract_id];

		if (!empty($keyword)) {
			$select->whereNest('OR')
						->whereLike('jbco.jbchangeorder_name', '?')
						->whereLike('jbco.jbchangeorder_desc', '?')
					->whereUnnest();

			$keyword .= '%';
			$params[] = $keyword;
			$params[] = $keyword;
		}

		return $this->adapter->query($select, $params);
	}
}

?>