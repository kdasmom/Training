<?php

namespace NP\catalog;

use NP\core\AbstractGateway;

/**
 * Gateway for the LINK_VC_VENDOR table
 *
 * @author Thomas Messier
 */
class LinkVcVendorGateway extends AbstractGateway {
	protected $table = 'LINK_VC_VENDOR';
	protected $pk    = 'link_vc_vendor_id';
}

?>