<?php

namespace NP\catalog;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the LINK_VC_PROPERTY table
 *
 * @author Thomas Messier
 */
class LinkVcPropertyGateway extends AbstractGateway {
	protected $table = 'LINK_VC_PROPERTY';
	protected $pk    = 'link_vc_property_id';

	public function getSelect() {
		$select = new Select();
		$select->from(array('lvp'=>$this->table))
				->join(array('p'=>'property'),
					   'lvp.property_id = p.property_id',
					   array());

		return $select;
	}
}

?>