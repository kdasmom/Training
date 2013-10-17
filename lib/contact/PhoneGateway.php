<?php

namespace NP\contact;

use NP\core\AbstractGateway;

/**
 * Gateway for the PHONE table
 *
 * @author Thomas Messier
 */
class PhoneGateway extends AbstractGateway {
	const PHONE_TYPE_FAX = 5;
	const PHONE_TYPE_MAIN = 6;
}

?>