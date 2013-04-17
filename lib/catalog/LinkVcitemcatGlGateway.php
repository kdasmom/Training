<?php

namespace NP\catalog;

use NP\core\AbstractGateway;

/**
 * Gateway for the LINK_VCITEMCAT_GL table
 *
 * @author Thomas Messier
 */
class LinkVcitemcatGlGateway extends AbstractGateway {
	protected $table = 'LINK_VCITEMCAT_GL';
	protected $pk    = 'link_vcitemcat_gl_id';
}

?>