<?php

namespace NP\vendor;

use NP\core\AbstractEntity;

class Vendor extends AbstractEntity {
	
	protected $fields = array(
		'vendor_id'		=> null,
		'vendorsite_id'		=> null,
		'vendor_id_alt'	=> '',
		'vendor_name'	=> '',
	);
	
}

?>