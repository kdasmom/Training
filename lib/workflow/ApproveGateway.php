<?php

namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the APPROVE table
 *
 * @author Thomas Messier
 */
class ApproveGateway extends AbstractGateway {
	protected $tableAlias = 'a';

	public function getSelect() {
		return Select::get()->from([$this->tableAlias=>'approve'])
							->join(new sql\join\ApproveApproveTypeJoin(null));
	}
}

?>