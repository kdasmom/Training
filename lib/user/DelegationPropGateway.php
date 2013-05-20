<?php

namespace NP\user;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the DELEGATIONPROP table
 *
 * @author 
 */
class DelegationPropGateway extends AbstractGateway {

	public function findDelegationProperties($delegation_id) {
		$select = new Select();
		$select->column('property_id')
				->from(array('dp'=>'delegationprop'))
				->join(array('p'=>'property'),
						'dp.property_id = p.property_id',
						array())
				->whereEquals('dp.delegation_id', '?')
				->order('p.property_name');

		return $this->adapter->query($select, array($delegation_id));
	}

}

?>