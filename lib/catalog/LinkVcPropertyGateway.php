<?php

namespace NP\catalog;

use NP\core\AbstractGateway;

/**
 * Gateway for the LINK_VC_PROPERTY table
 *
 * @author Thomas Messier
 */
class LinkVcPropertyGateway extends AbstractGateway {
	protected $table = 'LINK_VC_PROPERTY';
	protected $pk    = 'link_vc_property_id';
}

?>