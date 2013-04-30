<?php

namespace NP\catalog;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the LINK_VC_VCCAT table
 *
 * @author Thomas Messier
 */
class LinkVcVccatGateway extends AbstractGateway {
	protected $table = 'LINK_VC_VCCAT';
	protected $pk    = 'link_vc_vccat_id';

	public function getSelect() {
		$select = new Select();
		$select->from(array('lvc'=>$this->table))
				->join(array('vc'=>'vccat'),
					   'lvc.vccat_id = vc.vccat_id',
					   array());
		
		return $select;
	}
}

?>