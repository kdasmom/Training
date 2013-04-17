<?php

namespace NP\catalog;

use NP\core\AbstractGateway;

/**
 * Gateway for the LINK_VC_VCCAT table
 *
 * @author Thomas Messier
 */
class LinkVcVccatGateway extends AbstractGateway {
	protected $table = 'LINK_VC_VCCAT';
	protected $pk    = 'link_vc_vccat_id';
}

?>