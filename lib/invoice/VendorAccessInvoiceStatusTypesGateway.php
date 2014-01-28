<?php

namespace NP\invoice;

use NP\core\AbstractGateway;

/**
 * Gateway for the VENDORACCESSINVOICESTATUSTYPES table
 *
 * @author Thomas Messier
 */
class VendorAccessInvoiceStatusTypesGateway extends AbstractGateway {
	protected $pk = 'status_type_id';

	/**
	 * Returns an status_type_id that matches the status_name argument
	 *
	 * @param  string $status_name
	 * @return int
	 */
	public function findIdByName($status_name) {
		return $this->findValue(
			['status_name'=>'?'],
			[$status_name],
			'status_type_id'
		);
	}
}

?>