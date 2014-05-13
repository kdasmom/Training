<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 5/13/2014
 * Time: 5:29 PM
 */

namespace NP\import;


use NP\core\AbstractEntity;

class CustomFieldLineItemImportEntity extends AbstractEntity
{
	protected $fields = array(
		'CustomField' => array(
			'required' => true
		)
	);
}