<?php

namespace NP\invoice;

use NP\core\AbstractGateway;

use Zend\Db\Sql\Select;
use Zend\Db\ResultSet\ResultSet;

/**
 * An abstract class that contains functions useful for both POs and Invoices
 *
 * @author Thomas Messier
 */
abstract class AbstractPOInvoiceGateway extends AbstractGateway {
	
}

?>