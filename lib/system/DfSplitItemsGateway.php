<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the DFSPLITITEMS table
 *
 * @author Thomas Messier
 */
class DfSplitItemsGateway extends AbstractGateway {
	protected $pk         = 'dfsplititem_id';
}

?>