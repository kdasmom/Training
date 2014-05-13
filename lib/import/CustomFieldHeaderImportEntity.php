<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 5/12/2014
 * Time: 4:03 PM
 */

namespace NP\import;


use NP\core\AbstractEntity;

class CustomFieldHeaderImportEntity extends AbstractEntity {
	protected $fields = array(
		'CustomField'	 => array(
			'required' => true
		)
	);
} 