<?php

namespace NP\image\sql\criteria;

use NP\core\db\Where;
use NP\core\db\Select;

/**
 * Filter to pull only invoice and utility invoice images
 *
 * @author Thomas Messier
 */
class ImageInvoiceDocCriteria extends Where {
	
	/**
	 * @param  string $alias
	 * @param  string $docTypes
	 */
	public function __construct($docTypes, $alias='img') {
		parent::__construct();

		$docTypes = explode(',', $docTypes);
		$docTypes = implode(',', array_map(function($docType) { return "'" . $docType . "'"; }, $docTypes));

		return $this->in(
			"{$alias}.tableref_id",
			Select::get()->column('image_tableref_id')
						->from('image_tableref')
						->whereIn('image_tableref_name', $docTypes)
		);
	}
	
}